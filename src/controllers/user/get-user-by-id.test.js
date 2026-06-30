import { faker } from '@faker-js/faker'
import { GetUserByIdController } from './get-user-by-id.js'
import { user } from '../../tests/fixtures/user.js'

describe('getUserByIdController', () => {
    class GetUserByIdUseCaseStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getUserByIdUseCase = new GetUserByIdUseCaseStub()
        const sut = new GetUserByIdController(getUserByIdUseCase)

        return { sut, getUserByIdUseCase }
    }
    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    }

    it('should return 200 if a user is found', async () => {
        // arrange
        const { sut } = makeSut()
        // act
        const httpResponse = await sut.execute(httpRequest)
        // assert
        expect(httpResponse.statusCode).toBe(200)
    })

    it('should return 400 when userId is invalid', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const httpResponse = await sut.execute({
            params: {
                userId: 'invalid-uuid',
            },
        })

        // assert
        expect(httpResponse.statusCode).toBe(400)
    })
    it('should return 404 if user is not found', async () => {
        // arrange
        const { sut, getUserByIdUseCase } = makeSut()

        jest.spyOn(getUserByIdUseCase, 'execute').mockResolvedValue(null)
        // act
        const response = await sut.execute(httpRequest)
        // assert
        expect(response.statusCode).toBe(404)
    })

    it('should return 500 if GetUserByIdUseCase throws an error', async () => {
        // arrange
        const { sut, getUserByIdUseCase } = makeSut()
        jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )
        // act
        const httpResponse = await sut.execute(httpRequest)
        // assert
        expect(httpResponse.statusCode).toBe(500)
    })

    it('should call GetUserByIdUseCase with correct userId', async () => {
        // arrange
        const { sut, getUserByIdUseCase } = makeSut()
        const executeSpy = jest.spyOn(getUserByIdUseCase, 'execute')
        // act
        await sut.execute(httpRequest)
        // assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId)
    })
})
