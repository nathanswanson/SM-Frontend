import {
    NodesBase,
    NodesRead,
    ServersBase,
    ServersRead,
    TemplatesBase,
    TemplatesRead,
    UsersBase
} from '../../lib/hey-api/client'
import { mockingEnabled } from '../utils/mode'

export function openDB() {}

interface LocalDBData {
    users: UsersBase[]
    servers: ServersRead[]
    nodes: NodesRead[]
    templates: TemplatesRead[]
}

export const dbTestData: LocalDBData = {
    users: [
        { username: 'John', admin: true, disabled: false },
        { username: 'Jane', admin: false, disabled: false }
    ],
    servers: [
        {
            name: 'Server-1',
            cpu: 2,
            env: { EULA: 'true' },
            disk: 16,
            memory: 4,
            tags: ['latest'],
            container_name: 'Server-1',
            node_id: 1,
            template_id: 1,
            id: 1,
            port: [30001]
        },
        {
            name: 'Server-2',
            cpu: 2,
            env: {},
            disk: 16,
            memory: 4,
            container_name: 'Server-2',
            node_id: 1,
            template_id: 1,
            id: 2,
            port: [30002]
        }
    ],
    nodes: [
        {
            name: 'RPI 01',
            cpus: 4,
            disk: 256,
            memory: 8,
            cpu_name: 'ARM Cortex A76',
            max_hz: 2000,
            arch: 'arm64',
            id: 1
        }
    ],
    templates: [
        {
            name: 'Minecraft Server',
            image: 'itzg/minecraft-server',
            tags: ['latest', 'java8'],
            description: 'A Minecraft Server Template',
            resource_min_cpu: 2,
            resource_min_mem: 2,
            resource_min_disk: 16,
            id: 1,
            modules: [],
            exposed_port: [25565],
            exposed_volume: ['/data']
        },
        {
            name: 'Terraria',
            image: 'passivelemon/terraria-server',
            tags: ['latest'],
            description: 'A Terraria Server Template',
            resource_min_cpu: 1,
            resource_min_mem: 1,
            resource_min_disk: 8,
            id: 2,
            modules: [],
            exposed_port: [7777]
        }
    ]
}
export type BaseType = ServersBase | TemplatesBase | UsersBase | NodesBase

export class LocalDB {
    private db: IDBDatabase | null = null
    private static instance: LocalDB
    private ready: Promise<void>

    public static createInstance(initial_data?: LocalDBData): LocalDB {
        if (mockingEnabled()) {
            LocalDB.instance = new LocalDB(initial_data)
        } else {
            console.warn('Mocking is not enabled, cannot create LocalDB instance')
        }
        return LocalDB.instance
    }

    public static getInstance(): LocalDB {
        if (!LocalDB.instance) {
            LocalDB.instance = new LocalDB(dbTestData)
        }
        return LocalDB.instance
    }
    public async get(key: string, id?: number): Promise<any> {
        await this.ready
        return new Promise((resolve, reject) => {
            if (!this.db) {
                return reject(new Error('Database not initialized.'))
            }

            let t: IDBTransaction
            try {
                t = this.db.transaction(key, 'readonly')
            } catch (e) {
                return null
            }
            t.onerror = event => {
                reject((event.target as IDBRequest).error)
            }
            const os = t.objectStore(key)

            const req = !id ? os.getAll() : os.get(id)
            req.onsuccess = event => {
                resolve((event.target as IDBRequest).result)
            }
            req.onerror = event => {
                reject((event.target as IDBRequest).error)
            }
        })
    }
    public async add(key: string, baseObject: BaseType) {
        await this.ready
        return new Promise((resolve, reject) => {
            if (!this.db) {
                return reject(new Error('Database not initialized.'))
            }
            const t = this.db.transaction(key, 'readwrite')
            t.onerror = event => {
                reject((event.target as IDBRequest).error)
            }
            const os = t.objectStore(key)

            const req = os.add(baseObject)
            req.onsuccess = event => {
                resolve((event.target as IDBRequest).result)
            }
            req.onerror = event => {
                reject((event.target as IDBRequest).error)
            }
        })
    }
    public async update(key: string, id: number, updatedObject: BaseType) {
        await this.ready
        return new Promise((resolve, reject) => {
            if (!this.db) {
                return reject(new Error('Database not initialized.'))
            }
            const t = this.db.transaction(key, 'readwrite')
            t.onerror = event => {
                reject((event.target as IDBRequest).error)
            }
            const os = t.objectStore(key)

            const getReq = os.get(id)
            getReq.onsuccess = event => {
                const data = (event.target as IDBRequest).result
                if (data === undefined) {
                    return resolve(null)
                }
                const updated = { ...data, ...updatedObject }
                const putReq = os.put(updated)
                putReq.onsuccess = () => {
                    resolve(updated)
                }
                putReq.onerror = event => {
                    reject((event.target as IDBRequest).error)
                }
            }
            getReq.onerror = event => {
                reject((event.target as IDBRequest).error)
            }
        })
    }
    public async del(key: string, id: number) {
        await this.ready
        return new Promise((resolve, reject) => {
            if (!this.db) {
                return reject(new Error('Database not initialized.'))
            }
            const t = this.db.transaction(key, 'readwrite')
            t.onerror = event => {
                reject((event.target as IDBRequest).error)
            }
            const os = t.objectStore(key)

            const req = os.delete(id)
            req.onsuccess = () => {
                resolve(true)
            }
            req.onerror = event => {
                reject((event.target as IDBRequest).error)
            }
        })
    }

    public async namesList(storeName: string): Promise<{
        items: {
            [key: string]: number
        }
    }> {
        await this.ready
        return new Promise((resolve, reject) => {
            if (!this.db) {
                return reject(new Error('Database not initialized.'))
            }
            const t = this.db.transaction(storeName, 'readonly')
            t.onerror = event => {
                reject((event.target as IDBRequest).error)
            }
            const os = t.objectStore(storeName)

            const req = os.getAll()
            req.onsuccess = event => {
                const result = (event.target as IDBRequest).result as BaseType[]
                const names = { items: {} as { [key: string]: number } }
                result.forEach(item => {
                    names.items[(item as any).name as string] = (item as any).id as number
                })
                resolve(names)
            }
            req.onerror = event => {
                reject((event.target as IDBRequest).error)
            }
        })
    }

    private constructor(initial_data?: LocalDBData) {
        this.ready = new Promise((resolvePromise, rejectPromise) => {
            const DBOpenRequest = window.indexedDB.open('mockdb')
            DBOpenRequest.onerror = e => {
                console.error('Failed to open DB', (e.target as IDBOpenDBRequest).error)
                rejectPromise((e.target as IDBOpenDBRequest).error)
            }

            DBOpenRequest.onsuccess = (e: Event) => {
                this.db = (e.target as IDBOpenDBRequest).result
                console.log('Database opened', this.db)
                resolvePromise()
            }

            DBOpenRequest.onupgradeneeded = (e: IDBVersionChangeEvent) => {
                this.db = (e.target as IDBOpenDBRequest).result
                console.log('Database upgrade needed', this.db)

                // Create object stores
                // Use "id" as the primary key path so the generated numeric key is stored on the object
                const userStore = this.db.createObjectStore('users', { keyPath: 'id', autoIncrement: true })
                const serverStore = this.db.createObjectStore('servers', { keyPath: 'id', autoIncrement: true })
                const nodeStore = this.db.createObjectStore('nodes', { keyPath: 'id', autoIncrement: true })
                const templateStore = this.db.createObjectStore('templates', { keyPath: 'id', autoIncrement: true })

                if (!initial_data) {
                    return
                }
                // define indexes from sample objects
                // Create indexes automatically from a sample object for each store
                this.createIndexesFromSample(userStore, initial_data.users && initial_data.users[0])
                this.createIndexesFromSample(serverStore, initial_data.servers && initial_data.servers[0])
                this.createIndexesFromSample(nodeStore, initial_data.nodes && initial_data.nodes[0])
                this.createIndexesFromSample(templateStore, initial_data.templates && initial_data.templates[0])
                // Populate initial data
                for (const user of initial_data.users) {
                    userStore.add(user)
                }
                for (const server of initial_data.servers) {
                    serverStore.add(server)
                }
                for (const node of initial_data.nodes) {
                    nodeStore.add(node)
                }
                for (const template of initial_data.templates) {
                    templateStore.add(template)
                }
            }
        })
    }

    // Add helper to auto-create indexes from a sample object.
    // It will skip the primary key, nested objects, and create multiEntry indexes for arrays.
    private createIndexesFromSample(store: IDBObjectStore, sample: Record<string, any> | undefined) {
        if (!sample || typeof sample !== 'object') return

        for (const key of Object.keys(sample)) {
            // skip primary key 'id' — it is handled by keyPath on the store
            if (key === 'id') continue
            const val = sample[key]
            if (val === undefined) continue

            // skip nested objects for now
            if (val !== null && typeof val === 'object' && !Array.isArray(val)) continue

            // prepare index options
            const options: IDBIndexParameters = { unique: false }
            if (Array.isArray(val)) {
                options.multiEntry = true
            }

            try {
                if (!store.indexNames.contains(key)) {
                    store.createIndex(key, key, options)
                }
            } catch (err) {
                // Fail gracefully if an index can't be created
                console.warn('Failed to create index', key, err)
            }
        }
    }
}
