import { LoremIpsum } from 'lorem-ipsum'
import { GraphQLRequest, makeOperation, OperationContext } from 'urql'
import { filter, fromValue, interval, map, pipe } from 'wonka'
import { dbTestData } from './local-db'
import { InternalMockData } from './session-state'

type MetricPoint = { timestamp: number; value: number }

const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 1,
        min: 1
    },
    wordsPerSentence: {
        max: 16,
        min: 4
    }
})

function generateLogLine(): string {
    return `[${new Date().toUTCString()}][INFO] ${lorem.generateWords(4)}`
}

function getServerIdFromName(name: string): string {
    // Find server by name in dbTestData and return its ID as string
    // in real implementation, this would query the database
    return dbTestData.servers.find(server => server.container_name === name)?.id.toString() || '0'
}

function serverOnline(containerName: string): boolean {
    // Check if the server is online in dbTestData
    return InternalMockData.serversOnline.includes(getServerIdFromName(containerName))
}

export function* metricStreamGenerator(
    startValue = 60,
    options = {
        drift: 0.02,
        noise: 3,
        spikeChance: 0.03,
        spikeSize: 25,
        intervalMs: 1000 // new point every second
    }
): Generator<MetricPoint> {
    let value = startValue
    let timestamp = Date.now()

    while (true) {
        // small drift
        value += (Math.random() - 0.5) * options.drift * startValue

        // random noise
        value += (Math.random() - 0.5) * 2 * options.noise

        // occasional spikes
        if (Math.random() < options.spikeChance) {
            value += (Math.random() - 0.5) * 2 * options.spikeSize
        }

        value = Math.max(0, Number(value.toFixed(2)))

        yield { timestamp, value }

        timestamp += options.intervalMs
    }
}
export const mockGraphQlClient = {
    executeSubscription: (query: GraphQLRequest) => {
        const serverName = (query.query.definitions[0] as any).selectionSet.selections[0].arguments[0].value.value
        if (!serverName) {
            return fromValue({ error: new Error('No server name provided') })
        }
        // Get the query string
        try {
            const queryString = (query.query.definitions[0] as any).selectionSet.selections[0].name.value
            if (queryString === 'getMetrics') {
                let generators: Map<string, Generator<MetricPoint>> = new Map()
                generators.set('cpu', metricStreamGenerator(4))
                generators.set('memory', metricStreamGenerator(4))
                generators.set('network', metricStreamGenerator(200))
                generators.set('disk', metricStreamGenerator(500 + Math.random() * 50))
                return pipe(
                    interval(5000),
                    map((i: number) => ({
                        operation: makeOperation('subscription', query, {} as OperationContext),
                        data: {
                            getMetrics: {
                                cpu: serverOnline(serverName) ? generators.get('cpu')!.next().value.value : 0,
                                disk: serverOnline(serverName) ? generators.get('disk')!.next().value.value : 0,
                                memory: serverOnline(serverName) ? generators.get('memory')!.next().value.value : 0,
                                network: serverOnline(serverName) ? generators.get('network')!.next().value.value : 0
                            }
                        }
                    }))
                )
            } else if (queryString === 'getLogs') {
                return pipe(
                    interval(1000),
                    filter(() => serverOnline(serverName)),
                    map(() => {
                        return {
                            operation: makeOperation('subscription', query, {} as OperationContext),
                            data: {
                                getLogs: generateLogLine()
                            }
                        }
                    })
                )
            }
        } catch (error) {
            return fromValue({ error: new Error('Failed to parse query') })
        }
    }
}
