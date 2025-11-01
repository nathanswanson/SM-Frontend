import { devtoolsExchange } from '@urql/devtools'
import { createClient as createWSClient, SubscribePayload } from 'graphql-ws'
import { cacheExchange, Client, fetchExchange, subscriptionExchange } from 'urql'
import { getBaseUrl } from '../utils/api'
const wsClient = createWSClient({
    url: getBaseUrl().replace(/^http/, 'ws') + '/graphql'
})

export const graphql_client = new Client({
    url: getBaseUrl() + '/graphql',
    exchanges: [
        cacheExchange,
        devtoolsExchange,
        subscriptionExchange({
            forwardSubscription: operation => ({
                subscribe: sink => {
                    const dispose = wsClient.subscribe(operation as SubscribePayload, sink)
                    return {
                        unsubscribe: dispose
                    }
                }
            })
        }),
        fetchExchange
    ]
})
