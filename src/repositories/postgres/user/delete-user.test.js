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
        console.log(result, 'result')

        //toMatchObject é usado para comparar objetos,
        // verificando se o objeto esperado contém as mesmas propriedades e valores do objeto real, mas não exige que sejam exatamente iguais.

        expect(result).toMatchObject(user)
    })

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresDeleteUserRepository()
        const prismaSpy = jest.spyOn(prisma.user, 'delete')
        await sut.execute(user.id)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: user.id,
            },
        })
    })
})
