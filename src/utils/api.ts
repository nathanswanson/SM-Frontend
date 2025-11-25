import { toaster } from '../../lib/chakra/toaster'
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
    auth: initialToken ? `Bearer ${initialToken}` : '',
    credentials: 'include'
})

apiClient.interceptors.error.use(async (error: any, options: any) => {
    // set flag to indicate the app should logout
    if (import.meta.env.DEV) {
        console.log(error)
    }
    if (options.status == 401) {
        if (getAccessToken() != '') {
            console.log('Logging out due to 401')
            // removeAccessToken()
            // window.location.reload()
        }
        return Promise.reject(error)
    }
    if (options.status == 422) {
        if (error?.detail?.message) {
            toaster.error({ title: 'Error', description: error.detail.message })
        }
    }
    return error
})

export const client = apiClient
