import { http, HttpResponse, passthrough } from 'msw'
import { getBaseUrl } from '../utils/api'
import { containerHandler } from './handler/container-handler'
import { crudHandler } from './handler/crud-handler'
import { searchHandler } from './handler/search-handler'
import { serverHandler } from './handler/server-handler'
import { LocalDB } from './local-db'
import { InternalMockData } from './session-state'

const db: LocalDB = LocalDB.getInstance()

const ip = getBaseUrl()

export const handlers: any[] = [
    //public functions
    http.post(`${ip}/users/token`, () => {
        InternalMockData.loggedIn = true
        return HttpResponse.json({ access_token: 'mocked_token' })
    }),
    // files
    http.get(`/`, async () => {
        return passthrough()
    }),
    http.get(`/assets/*`, async () => {
        return passthrough()
    }),
    http.get(`/site.webmanifest`, async () => {
        return passthrough()
    }),
    //authentication middleware
    http.all(`${ip}/*`, async () => {
        if (!InternalMockData.loggedIn) {
            // return new HttpResponse('Unauthorized', { status: 401 }) temp disable logout
        }
    }),
    //private functions authenticated
    http.get(`${ip}/users/me`, async () => {
        return HttpResponse.json(await db.get('users', 1))
    }),
    http.post(`${ip}/users/revoke`, async () => {
        InternalMockData.loggedIn = false
        return HttpResponse.json({ success: true })
    }),
    ...searchHandler(ip, db),
    ...containerHandler(ip, db),
    ...serverHandler(ip, db, InternalMockData),
    ...crudHandler(ip, db),
    http.all(`${ip}/*`, async () => {
        console.error('Unhandled request in mocks/handlers.ts')
        return new HttpResponse('Not Found', { status: 404 })
    })
]
