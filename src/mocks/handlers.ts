import { http, HttpResponse } from 'msw'
import { getBaseUrl } from '../utils/urlIntercept'

export const handlers = [
  http.get(`${getBaseUrl()}/vapi/container/list`, () => {
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
