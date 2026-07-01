import { PostgresCreateUserRepository } from './create-user'
import { user } from '../../../tests/fixtures/user.js'

describe('Create User Repository', () => {
    it('should create a user in the database', async () => {
        const sut = new PostgresCreateUserRepository()
        const result = await sut.execute(user)

        expect(result).not.toBeNull()
    })
})
