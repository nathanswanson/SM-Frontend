import { client as apiClient } from '../../lib/hey-api/client/client.gen'

export const getBaseUrl = () => {
    // In development, use the dev server URL
    if (import.meta.env.DEV) {
        return 'https://home.localhost/api'
    }
    // In production, use relative URLs or current origin
    return window.location.origin + '/api'
}

export const getAccessToken = () => {
    return window.sessionStorage.getItem('access_token') || ''
}

export const setAccessToken = (token: string) => {
    window.sessionStorage.setItem('access_token', token)
    updateClientAuth(token)
}

export const removeAccessToken = () => {
    sessionStorage.removeItem('access_token')
    updateClientAuth('')
}

export const updateClientAuth = (token: string) => {
    apiClient.setConfig({
        baseUrl: getBaseUrl(),
        auth: token ? token : ''
    })
}

const initialToken = getAccessToken()
apiClient.setConfig({
    baseUrl: getBaseUrl(),
    auth: initialToken ? `Bearer ${initialToken}` : ''
})

export const client = apiClient
