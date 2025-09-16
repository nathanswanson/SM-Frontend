import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get(`http://${import.meta.env.VITE_BACKEND_HOST}/vapi/container/list`, () => {
    return HttpResponse.json({
      containers: [
        'Ruthless-Ogres',
        'Yoked-Gregarious',
        'Bewildered-Igor',
        'Dark-Sky'
      ]
    })
  })
]
