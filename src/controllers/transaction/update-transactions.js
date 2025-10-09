import {
    checkIfIdIsValid,
    invalidIdResponse,
    checkIfTypeIsValid,
} from '../helpers/validation.js'
import { serverError, badRequest, ok } from '../helpers/http.js'

export class UpdateTransactionController {
    constructor(updateTransactionUseCase) {
        this.updateTransactionUseCase = updateTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const idIsValid = checkIfIdIsValid(
                httpRequest.params.transactionsId
            )
            if (!idIsValid) {
                return invalidIdResponse()
            }

            const params = httpRequest.body

            const allowedFields = ['name', 'date', 'amount', 'type']

            const someFieldIsNotAllowed = Object.keys(params).some(
                (key) => !allowedFields.includes(key)
            )

            if (someFieldIsNotAllowed) {
                return badRequest({
                    message: 'Some field is not allowed to be updated!',
                })
            }

            if (params.amount) {
                const amountIsValid = checkIfIdIsValid(params.amount)

                if (!amountIsValid) {
                    return badRequest({
                        message: 'Amount must be a valid number!',
                    })
                }
            }

            const type = params.type.trim().toUpperCase()

            const typeIsValid = checkIfTypeIsValid(type) // EARNING, EXPENSE, INVESTIMENT

            if (!typeIsValid) {
                return badRequest({
                    message: 'The type must be EARNING, EXPENSE or INVESTIMENT',
                })
            }

            const transaction = await this.updateTransactionUseCase.execute(
                httpRequest.params.transactionsId,
                params
            )

            return ok(transaction)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
