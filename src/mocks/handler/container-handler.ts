import { LoremIpsum } from 'lorem-ipsum'
import { http, HttpResponse } from 'msw'
import { LocalDB } from '../local-db'

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

function generateLogLine(serverName: string): string {
    return `[${new Date().toISOString()}][${serverName}][INFO]:${lorem.generateSentences(1)}`
}

export const containerHandler = (ip: string, db: LocalDB) => [
    // container commands
    http.get(`${ip}/containers/:id/logs`, async ({ params }) => {
        const { id } = params
        if (id === undefined || typeof id !== 'string') {
            return new HttpResponse('Not Found', { status: 404 })
        }
        // generate 100 log lines
        const response = {
            items: Array.from({ length: 100 }, () => generateLogLine(id))
        }
        return HttpResponse.json(response)
    }),
    http.post(`${ip}/containers/:id/command`, async ({ params }) => {
        // just return 200
        const { id } = params
        if (id === undefined || typeof id !== 'string') {
            return new HttpResponse('Not Found', { status: 404 })
        }
        return new HttpResponse({ status: 200 })
    })
]
