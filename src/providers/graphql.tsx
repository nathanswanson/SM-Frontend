import { devtoolsExchange } from '@urql/devtools'
import { createClient as createWSClient, SubscribePayload } from 'graphql-ws'
import { cacheExchange, Client, fetchExchange, subscriptionExchange } from 'urql'
import { getAccessToken, getBaseUrl } from '../utils/api'
import { authExchange } from '@urql/exchange-auth'

const wsClient = createWSClient({
    url: getBaseUrl().replace(/^http/, 'ws') + '/graphql',
    connectionParams: async () => {
        const token = getAccessToken()
        return {
            Authorization: token ? `Bearer ${token}` : ''
        }
    }
})

async function initAuthState() {
    const token = await getAccessToken()
    return { token }
}
console.log('GraphQL Client initialized with URL:', getBaseUrl() + '/graphql')
export const graphql_client = new Client({
    url: getBaseUrl() + '/graphql',
    exchanges: [
        devtoolsExchange,
        cacheExchange,

        authExchange(async utils => {
            const { token } = await initAuthState()
            return {
                addAuthToOperation: operation => {
                    if (!token) {
                        return operation
                    }

                    return utils.appendHeaders(operation, {
                        Authorization: `Bearer ${token}`
                    })
                },
                didAuthError: (error, _operation) => {
                    return error.response?.status === 401
                },
                async refreshAuth() {}
            }
        }),
        fetchExchange,
        subscriptionExchange({
            forwardSubscription: operation => ({
                subscribe: sink => {
                    const dispose = wsClient.subscribe(operation as SubscribePayload, sink)
                    return {
                        unsubscribe: dispose
                    }
                }
            })
        })
    ]
})
