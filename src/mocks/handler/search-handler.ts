import { HttpResponse } from 'msw'
import { http } from 'msw/core/http'
import { LocalDB } from '../local-db'

function getMockFSPath(path: string): string[] {
    const parts = path.split('/').filter(part => part.length > 0)
    console.log({ parts })
    return parts
}

export const searchHandler = (ip: string, db: LocalDB) => [
    // search
    http.get(`${ip}/search/:type`, async ({ params }) => {
        const { type } = params
        const namesList = await db.namesList(type as string)
        return HttpResponse.json(namesList)
    }),
    http.get(`${ip}/search/fs/:serverId/:path`, async ({ params }) => {
        const { serverId, path } = params
        if (serverId === undefined || typeof serverId !== 'string' || path === undefined || typeof path !== 'string') {
            return new HttpResponse('Not Found', { status: 404 })
        }
        const fsPath = getMockFSPath(path)
        console.log({ fsPath })
        // for mock purposes, return a fixed set of files/folders
        const response = {
            items: []
        }
        return HttpResponse.json(response)
    })
]
