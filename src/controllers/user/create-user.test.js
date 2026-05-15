import { CreateUserController } from './create-user'

describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        execute(userData) {
            return userData
        }
    }

    it('should return 201 when creating a new user successfully', async () => {
        // arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)
        const httpRequest = {
            body: {
                first_name: 'John Doe',
                last_name: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
            },
        }
        // act
        const result = await createUserController.execute(httpRequest)
        // assert
        expect(result.statusCode).toBe(201)
        expect(result.body).toEqual(httpRequest.body)
    })

    it('should return 400 if first_name is not provided', async () => {
        // arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)
        const httpRequest = {
            body: {
                last_name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'password123',
            },
        }
        const result = await createUserController.execute(httpRequest)
        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if last_name is not provided', async () => {
        // arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)
        const httpRequest = {
            body: {
                first_name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'password123',
            },
        }
        const result = await createUserController.execute(httpRequest)
        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not provided', async () => {
        // arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)
        const httpRequest = {
            body: {
                first_name: 'John Doe',
                last_name: 'Doe',
                password: 'password123',
            },
        }
        const result = await createUserController.execute(httpRequest)
        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is invalid', async () => {
        // arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)
        const httpRequest = {
            body: {
                first_name: 'John Doe',
                last_name: 'Doe',
                email: 'invalid-email',
                password: 'password123',
            },
        }
        const result = await createUserController.execute(httpRequest)
        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is not provided', async () => {
        // arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)
        const httpRequest = {
            body: {
                first_name: 'John Doe',
                last_name: 'Doe',
                email: 'john.doe@example.com',
            },
        }
        const result = await createUserController.execute(httpRequest)
        // assert
        expect(result.statusCode).toBe(400)
    })
})
