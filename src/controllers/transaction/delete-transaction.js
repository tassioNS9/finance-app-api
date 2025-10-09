import { notFound, ok, serverError } from '../helpers/http.js'
import { checkIfIdIsValid, invalidIdResponse } from '../helpers/validation.js'
import validator from 'validator'

export class DeleteTransactionController {
    constructor(deleteTransactionUseCase) {
        this.deleteTransactionUseCase = deleteTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const idIsValid = checkIfIdIsValid(httpRequest.params.TransactionId)

            if (!idIsValid) {
                return invalidIdResponse()
            }

            const deletedTransaction =
                await this.deleteTransactionUseCase.execute(
                    httpRequest.params.TransactionId
                )

            return ok(deletedTransaction)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
