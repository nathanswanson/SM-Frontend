import { LoremIpsum } from 'lorem-ipsum'
import { http, HttpResponse, passthrough } from 'msw'
import { ServerStatusResponse } from '../../lib/hey-api/client/types.gen'
import { getBaseUrl } from '../utils/api'
import { LocalDB } from './local-db'
import { socketIOHandlers } from './socket-io-handlers'
const db: LocalDB = LocalDB.getInstance()

const InternalMockData = {
    loggedIn: false,
    serversOnline: [] as string[]
}

// const ip = 'http://api.localhost'
const ip = getBaseUrl()

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

const auto_login = true

function generateLogLine(serverName: string): string {
    return `[${new Date().toISOString()}][${serverName}][INFO]:${lorem.generateSentences(1)}`
}

export const handlers: any[] = [
    // socket.io
    ...socketIOHandlers,
    //public functions
    http.post(`${ip}/users/token`, () => {
        InternalMockData.loggedIn = true
        return new HttpResponse({ status: 200 })
    }),
    http.get(`${ip}/`, async () => {
        return passthrough()
    }),
    http.get(`${ip}/site.webmanifest`, async () => {
        return passthrough()
    }),
    //auth
    http.all(`${ip}/*`, async () => {
        if (auto_login) {
            InternalMockData.loggedIn = true
        }
        if (!InternalMockData.loggedIn) {
            return new HttpResponse('not authorized', { status: 401 })
        }
    }),
    //private functions
    http.post(`${ip}/users/me`, async () => {
        return HttpResponse.json(await db.get('users', 1))
    }),
    http.get(`${ip}/search/:type`, async ({ params }) => {
        const { type } = params
        const namesList = await db.namesList(type as string)
        return HttpResponse.json(namesList)
    }),
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
    }),
    // server commands
    http.post(`${ip}/servers/:id/start`, async ({ params }) => {
        // if server exists in db, this will return 200
        // mark server as online
        if (params.id !== undefined && typeof params.id === 'string') {
            if (!InternalMockData.serversOnline.includes(params.id)) {
                InternalMockData.serversOnline.push(params.id)
            }
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
        InternalMockData.serversOnline = InternalMockData.serversOnline.filter(id => id !== params.id)
        return new HttpResponse({ status: 200 })
    }),
    http.get(`${ip}/servers/:id/status`, async ({ params }) => {
        if (params.id === undefined || typeof params.id !== 'string') {
            return new HttpResponse({ status: 404 })
        }
        const response = {
            running: InternalMockData.serversOnline.includes(params.id),
            health: 'good'
        } as ServerStatusResponse
        return HttpResponse.json(response)
    }),
    //CRUD operations
    http.post(`${ip}/:type/`, async ({ request, params }) => {
        const { type } = params
        const bodyRaw = await request.json()
        if (bodyRaw === undefined || bodyRaw === null) {
            return new HttpResponse('Bad Request', { status: 400 })
        }
        // Narrow/convert so it satisfies LocalDB.add's expected parameter type
        const body = bodyRaw as unknown as any
        await db.add(type as string, body)
        return HttpResponse.json(body)
    }),
    http.get(`${ip}/:type/:id`, async req => {
        const { type, id } = req.params
        let data
        try {
            // timeout if takes too long
            data = await Promise.race([
                db.get(type as string, Number(id)),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
            ])
        } catch (e) {
            return new HttpResponse('Not Found', { status: 404 })
        }
        return HttpResponse.json(data)
    }),
    http.delete(`${ip}/:type/:id`, async req => {
        const { type, id } = req.params
        await db.del(type as string, Number(id))
        return new HttpResponse(null, { status: 204 })
    }),
    http.all(`${ip}/*`, async () => {
        return passthrough()
    })
]
