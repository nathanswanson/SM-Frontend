import { client as apiClient } from '../../lib/hey-api/client/client.gen'

export const getBaseUrl = () => {
    // if (import.meta.env.PROD) {
    //     return window.location.origin
    // }
    return `https://localhost`
    // return envUrl;
}

export const getFrontendUrl = () => {
    // in prod this equals getBaseURL()
    return getBaseUrl()
}

apiClient.setConfig({
    baseUrl: getBaseUrl(),
    credentials: 'include'
})

// apiClient.interceptors.error.use(async (error: any, options: any) => {
//     // set flag to indicate the app should logout
//     if (import.meta.env.DEV) {
//         console.log(error)
//     }
//     if (options.status == 401) {
//         if (window.sessionStorage.getItem('logged_in')) {
//             console.log('Logging out due to 401')

//             window.sessionStorage.removeItem('logged_in')
//             // window.location.reload()
//             toaster.error({ title: 'error' })
//         }
//         return Promise.reject(error)
//     }
//     if (options.status == 422) {
//         if (error?.detail?.message) {
//             toaster.error({ title: 'Error', description: error.detail.message })
//         }
//     }
//     return error
// })

export const client = apiClient
