import { PostgresDeleteUserRepository } from './delete-user'
import { user } from '../../../tests/fixtures/user.js'
import { prisma } from '../../../../prisma/prisma.js'

describe('Delete User Repository', () => {
    it('should delete a user in the database', async () => {
        await prisma.user.create({
            data: user,
        })

        const sut = new PostgresDeleteUserRepository()
        const result = await sut.execute(user.id)

        // toScritctEqual é usado para comparar objetos, arrays e outros tipos de dados complexos,
        // garantindo que eles sejam idênticos em estrutura e conteúdo.
        expect(result).toStrictEqual(true)
    })
})
