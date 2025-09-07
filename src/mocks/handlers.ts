import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('http://raspberrypi.home:8000/vapi/container/list', () => {
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
