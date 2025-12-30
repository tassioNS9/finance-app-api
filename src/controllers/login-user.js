import { ZodError } from 'zod'
import { loginUserSchema } from '../schemas/user.js'
import {
    serverError,
    ok,
    badRequest,
    unauthorized,
    notFound,
} from './helpers/http.js'
import { InvalidPasswordError, UserNotFoundError } from '../errors/user.js'

export class LoginUserController {
    constructor(loginUserUseCase) {
        this.loginUserUseCase = loginUserUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            await loginUserSchema.parseAsync(params)
            const user = await this.loginUserUseCase.execute(
                params.email,
                params.password
            )
            return ok(user)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.errors[0].message,
                })
            }

            if (error instanceof InvalidPasswordError) {
                return unauthorized()
            }

            if (error instanceof UserNotFoundError) {
                return notFound({
                    message: 'User not Foud!',
                })
            }
            return serverError()
        }
    }
}
