import { HttpResponse } from 'msw'
import { http } from 'msw/core/http'
import { LocalDB } from '../local-db'
import { mock } from 'node:test'


// either a list of strings or a tuple of [folderName, contents]

type Directory = Array<string | { [folderName: string]: Directory }>

const fileSystemMock: { [path: string]: Directory } = {
    '/': [{'folder1': ['']}, {'folder2': [''] }, 'file1.txt', 'file2.log'],
}

function getMockFSPath(path: string): string[] {
    // directory is always starting from root; no need to handle relative paths
    const splitPath = path.split('/').filter(p => p.length > 0)
    let currentDir: Directory = fileSystemMock['/']
    for (const part of splitPath) {
        const nextDir = currentDir.find(item => {
            if (typeof item === 'string') return false
            return Object.keys(item)[0] === part
        })
        if (nextDir && typeof nextDir !== 'string') {
            currentDir = nextDir[part]
        } else {
            return [] // path not found
        }
    }
    // return the contents of the current directory
    return currentDir.map(item => {
        if (typeof item === 'string') return item
        return Object.keys(item)[0] + '/'
    })
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
        console.log(fsPath)
        // for mock purposes, return a fixed set of files/folders
        const response = {
            items: fsPath
        }
        return HttpResponse.json(response)
    })
]
