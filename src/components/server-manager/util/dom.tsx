'use client'

import DOMPurify from 'dompurify'
export function purify(text: string) {
    return DOMPurify.sanitize(text)
}
