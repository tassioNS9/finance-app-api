import { UpdateUserController } from './update-user'
import { faker } from '@faker-js/faker'

describe('updateUserController', () => {
    class UpdateUserUseCaseStub {
        async execute(user) {
            return user
        }
    }

    const makeSut = () => {
        const updateUserUseCase = new UpdateUserUseCaseStub()
        const sut = new UpdateUserController(updateUserUseCase)

        return { sut, updateUserUseCase }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
        body: {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 7 }),
        },
    }
    it('should return 200 when user is updated successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute(httpRequest)

        // assert
        expect(response.statusCode).toBe(200)
    })

    it('should return 400 if email is not provided', async () => {
        // arrange
        const { sut } = makeSut()
        const result = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                email: 'invalid-email',
            },
        })
        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is less than 6 characters', async () => {
        // arrange
        const { sut } = makeSut()
        const result = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                password: faker.internet.password({ length: 5 }),
            },
        })
        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if id is not a valid uuid', async () => {
        // arrange
        const { sut } = makeSut()
        const result = await sut.execute({
            params: {
                userId: 'invalid-uuid',
            },
            body: httpRequest.body,
        })
        // assert
        expect(result.statusCode).toBe(400)
    })
    it('should return 400 when an unallowed field is provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                unallowedField: 'unallowed',
            },
        })
        // assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 500 if UpdateUserUseCase throws an error', async () => {
        // arrange
        const { sut, updateUserUseCase } = makeSut()
        jest.spyOn(updateUserUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(500)
    })
})
