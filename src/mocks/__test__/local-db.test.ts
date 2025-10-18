import { LocalDB, dbTestData } from '../local-db'
import { beforeEach, afterEach, describe, expect, it } from 'vitest'

describe('LocalDB', () => {
    // Test instance creation
    it('should create an instance', () => {
        const db = LocalDB.getInstance()
        expect(db).toBeInstanceOf(LocalDB)
    })

    // Test adding and retrieving data
    let db: LocalDB

    beforeEach(async () => {
        db = LocalDB.createInstance()
    })

    it('should add and retrieve data', async () => {
        // We assume the ID is 1, but we should verify the retrieved data
        await db.add('users', dbTestData.users[0])

        const retrievedData = await db.get('users', 1)

        const expectedData = { ...dbTestData.users[0] }

        // The testData/expectedData should now match the retrieved object exactly
        expect(retrievedData).toEqual(expectedData)
    })

    // Test deleting data
    it('should delete data', async () => {
        const user_id = 2
        await db.add('users', dbTestData.users[user_id - 1])
        await db.del('users', user_id)
        const retrievedData = await db.get('users', user_id)
        expect(retrievedData).toBeUndefined()
    })
})
