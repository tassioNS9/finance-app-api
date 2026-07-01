import { PostgresCreateUserRepository } from './create-user'
import { user } from '../../../tests/fixtures/user.js'
import { prisma } from '../../../../prisma/prisma.js'

describe('Create User Repository', () => {
    it('should create a user in the database', async () => {
        const sut = new PostgresCreateUserRepository()
        const result = await sut.execute(user)

        expect(result.id).toBe(user.id)
        expect(result.firstName).toBe(user.firstName)
        expect(result.lastName).toBe(user.lastName)
        expect(result.email).toBe(user.email)
        expect(result.password).toBe(user.password)
    })

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresCreateUserRepository()
        const prismaSpy = jest.spyOn(prisma.user, 'create')
        await sut.execute(user)

        expect(prismaSpy).toHaveBeenCalledWith({
            data: user,
        })
    })
})
