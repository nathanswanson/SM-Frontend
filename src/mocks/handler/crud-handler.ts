import { HttpResponse } from 'msw'
import { http } from 'msw/core/http'
import { LocalDB } from '../local-db'

export const crudHandler = (ip: string, db: LocalDB) => [
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
    http.patch(`${ip}/:type/:id`, async req => {
        const { type, id } = req.params
        const bodyRaw = await req.request.json()
        if (bodyRaw === undefined || bodyRaw === null) {
            return new HttpResponse('Bad Request', { status: 400 })
        }
        // Narrow/convert so it satisfies LocalDB.update's expected parameter type
        const body = bodyRaw as unknown as any
        const updated = await db.update(type as string, Number(id), body)
        if (updated === null) {
            return new HttpResponse('Not Found', { status: 404 })
        }
        return HttpResponse.json(updated)
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
    })
]
