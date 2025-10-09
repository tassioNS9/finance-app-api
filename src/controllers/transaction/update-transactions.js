import { checkIfIdIsValid, invalidIdResponse } from '../helpers/validation.js'

import {
    checkIfTypeIsValid,
    checkIfAmountIsValid,
} from '../helpers/transaction.js'
import { serverError, badRequest, ok } from '../helpers/http.js'

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
                const amountIsValid = checkIfAmountIsValid(params.amount)

                if (!amountIsValid) {
                    return badRequest({
                        message: 'Amount must be a valid number!',
                    })
                }
            }
            if (params.type) {
                const typeIsValid = checkIfTypeIsValid(params.type)

                if (!typeIsValid) {
                    return badRequest({ message: 'Type is not valid!' })
                }
            }

            const transaction = await this.updateTransactionUseCase.execute(
                httpRequest.params.transactionId,
                params
            )

            return ok(transaction)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
