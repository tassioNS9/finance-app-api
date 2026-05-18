import { faker } from '@faker-js/faker'
import { DeleteUserController } from './delete-user.js'

describe('DeleteUserController', () => {
    class DeleteUserUseCaseStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 10 }),
            }
        }
    }

    const makeSut = () => {
        const deleteUserUseCase = new DeleteUserUseCaseStub()
        const sut = new DeleteUserController(deleteUserUseCase)
        return { sut, deleteUserUseCase }
    }
    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    }

    it('should return 200 when deleting a user successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute(httpRequest)

        // assert
        expect(response.statusCode).toBe(200)
    })

    it('should return 400 if id is invalid', async () => {
        // arrange
        const { sut } = makeSut()
        const httpRequest = {
            params: {
                userId: 'invalid-uuid',
            },
        }
        // act
        const response = await sut.execute(httpRequest)
        // assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 404 if user is not found', async () => {
        // arrange
        const { sut, deleteUserUseCase } = makeSut()
        jest.spyOn(deleteUserUseCase, 'execute').mockReturnValueOnce(null)
        // act
        const response = await sut.execute(httpRequest)
        // assert
        expect(response.statusCode).toBe(404)
    })

    it('should return 500 if DeleteUserUseCase throws an error', async () => {
        // arrange
        const { sut, deleteUserUseCase } = makeSut()
        jest.spyOn(deleteUserUseCase, 'execute').mockImplementationOnce(() => {
            throw new Error()
        })
        // act
        const response = await sut.execute(httpRequest)
        // assert
        expect(response.statusCode).toBe(500)
    })
})
