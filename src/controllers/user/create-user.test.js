import { EmailAlreadyInUseError } from '../../errors/user'
import { CreateUserController } from './create-user'
import { faker } from '@faker-js/faker'
describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        execute(userData) {
            return userData
        }
    }

    const makeSut = () => {
        const createUserUseCase = new CreateUserUseCaseStub()
        const sut = new CreateUserController(createUserUseCase)
        return { createUserUseCase, sut }
    }

    const httpRequest = {
        body: {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 10 }),
        },
    }

    it('should return 201 when creating a new user successfully', async () => {
        // arrange
        const { sut } = makeSut()
        // act
        const result = await sut.execute(httpRequest)
        // assert
        expect(result.statusCode).toBe(201)
        expect(result.body).toEqual(httpRequest.body)
    })

    it('should return 400 if first_name is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        const result = await sut.execute({
            ...httpRequest.body,
            first_name: undefined,
        })
        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if last_name is not provided', async () => {
        // arrange
        const { sut } = makeSut()
        const result = await sut.execute({
            ...httpRequest.body,
            last_name: undefined,
        })
        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not provided', async () => {
        // arrange
        const { sut } = makeSut()
        const result = await sut.execute({
            ...httpRequest.body,
            email: undefined,
        })
        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is invalid', async () => {
        // arrange
        const { sut } = makeSut()

        const result = await sut.execute({
            ...httpRequest.body,
            email: 'invalid-email',
        })
        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        const result = await sut.execute({
            ...httpRequest.body,
            password: undefined,
        })
        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is less than 6 characters', async () => {
        // arrange
        const { sut } = makeSut()
        const result = await sut.execute({
            ...httpRequest.body,
            password: faker.internet.password({ length: 5 }),
        })
        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should call CreateUserCase with correct params', async () => {
        // arrange
        const { sut, createUserUseCase } = makeSut()
        const executeSpy = jest.spyOn(createUserUseCase, 'execute')

        // act
        await sut.execute(httpRequest)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
        expect(executeSpy).toHaveBeenCalledTimes(1)
    })

    it('should return 500 if CreateUserCase throws an error', async () => {
        class CreateUserUseCaseStub {
            execute(userData) {
                throw new Error()
            }
        }
        // arrange
        const { sut, createUserUseCase } = makeSut()
        jest.spyOn(createUserUseCase, 'execute').mockImplementationOnce(() => {
            throw new Error('Database error')
        })

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(500)
    })

    it('should return 500 if CreateUserUseCase throws EmailAlreadyInUseError', async () => {
        //arange
        const { createUserUseCase, sut } = makeSut()
        jest.spyOn(createUserUseCase, 'execute').mockImplementationOnce(() => {
            throw new EmailAlreadyInUseError(httpRequest.body.email)
        })

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
    })
})
