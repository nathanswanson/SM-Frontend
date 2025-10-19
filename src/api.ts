import { client as apiClient } from '../lib/hey-api/client/client.gen'

const getBaseUrl = () => {
    return `http://api.localhost`
    // return envUrl;
}

apiClient.setConfig({
    baseUrl: getBaseUrl(),
    credentials: 'include'
})

apiClient.interceptors.error.use(async (error: any, options: any) => {
    // set flag to indicate the app should logout
    if (options.status == 401) {
        if (window.sessionStorage.getItem('logged_in')) {
            console.log('Logging out due to 401')
            window.sessionStorage.removeItem('logged_in')
            window.location.reload()
        }
        return Promise.reject(error)
    }
    return error
})

export const client = apiClient
