import { checkIfIdIsValid, invalidIdResponse } from '../helpers/validation.js'

import { serverError, badRequest, ok, forbidden } from '../helpers/http.js'
import { ZodError } from 'zod'
import { updateTransactionSchema } from '../../schemas/transactions.js'
import { ForbiddenError } from '../../errors/user.js'

export class UpdateTransactionController {
    constructor(updateTransactionUseCase) {
        this.updateTransactionUseCase = updateTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const idIsValid = checkIfIdIsValid(httpRequest.params.transactionId)
            if (!idIsValid) {
                return invalidIdResponse()
            }

            const params = httpRequest.body

            await updateTransactionSchema.parseAsync(params) // O ParseAsync para fazer a validação de forma assincrona

            const transaction = await this.updateTransactionUseCase.execute(
                httpRequest.params.transactionId,
                params
            )

            return ok(transaction)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.errors[0].message,
                })
            }

            if (error instanceof ForbiddenError) {
                return forbidden()
            }
            console.error(error)
            return serverError()
        }
    }
}
