import { HttpResponse } from 'msw'
import { http } from 'msw/core/http'
import { ServerStatusResponse } from '../../../lib/hey-api/client/types.gen'
import { LocalDB } from '../local-db'

export const serverHandler = (ip: string, db: LocalDB, state: any) => [
    // server commands
    http.post(`${ip}/servers/:id/start`, async ({ params }) => {
        // if server exists in db, this will return 200
        // mark server as online
        if (params.id !== undefined && typeof params.id === 'string') {
            if (!state.serversOnline.includes(params.id)) {
                state.serversOnline.push(params.id)
            }
            // add delay to simulate startup time
            await new Promise(resolve => setTimeout(resolve, 500))
            return new HttpResponse({ status: 200 })
        }
        return new HttpResponse({ status: 404 })
    }),
    http.post(`${ip}/servers/:id/stop`, async ({ params }) => {
        // if server exists in db, this will return 200
        // mark server as offline
        if (params.id === undefined || typeof params.id !== 'string') {
            return new HttpResponse({ status: 404 })
        }
        state.serversOnline = state.serversOnline.filter((id: any) => id !== params.id)
        // add delay to simulate shutdown time
        await new Promise(resolve => setTimeout(resolve, 500))
        return new HttpResponse({ status: 200 })
    }),
    http.get(`${ip}/servers/:id/status`, async ({ params }) => {
        if (params.id === undefined || typeof params.id !== 'string') {
            return new HttpResponse({ status: 404 })
        }
        const response = {
            running: state.serversOnline.includes(params.id),
            health: 'good'
        } as ServerStatusResponse
        return HttpResponse.json(response)
    }),
    http.post(`${ip}/servers/:id/command`, async ({ params, request }) => {
        const url = new URL(request.url)
        const command = url.searchParams.get('command') || ''
        return new HttpResponse({ status: 200 })
    })
]
