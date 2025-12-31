import { UnauthorizedError } from '../../errors/user.js'
import { ZodError } from 'zod'
import { refreshTokenSchema } from '../../schemas/user'
import { badRequest, ok, serverError, unauthorized } from '../helpers/http.js'

export class RefreshTokenController {
    constructor(refreshTokenUseCase) {
        this.refreshTokenUseCase = refreshTokenUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            await refreshTokenSchema.parseAsync(params)
            const response = this.refreshTokenUseCase.execute(
                params.refreshToken
            )
            return ok(response)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.errors[0].message,
                })
            }

            if (error instanceof UnauthorizedError) {
                return unauthorized()
            }
            return serverError()
        }
    }
}
