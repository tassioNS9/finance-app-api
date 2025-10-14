import { ZodError } from 'zod'
import { createTransactionSchema } from '../../schemas/transactions.js'
import { badRequest, serverError, created } from '../helpers/http.js'
// import {
//     checkIfAmountIsValid,
//     checkIfTypeIsValid,
// } from '../helpers/transaction.js'
// import {
//     checkIfIdIsValid,
//     invalidIdResponse,
//     validateRequiredFields,
// } from '../helpers/validation.js'
export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            // const requiredFields = ['user_id', 'name', 'date', 'amount', 'type']

            // const { ok: requiredFieldsWereProvided, missingField } =
            //     validateRequiredFields(params, requiredFields)

            // if (!requiredFieldsWereProvided) {
            //     return badRequest({
            //         message: `The Field ${missingField} is required.`,
            //     })
            // }
            // const userIdIsValid = checkIfIdIsValid(params.user_id)

            // if (!userIdIsValid) {
            //     return invalidIdResponse()
            // }

            // const amountIsValid = checkIfAmountIsValid(params.amount)

            // if (!amountIsValid) {
            //     return badRequest({
            //         message: 'The amount must be a valid currency value',
            //     })
            // }

            // const type = params.type.trim().toUpperCase()

            // const typeIsValid = checkIfTypeIsValid(type) // EARNING, EXPENSE, INVESTIMENT

            // if (!typeIsValid) {
            //     return badRequest({
            //         message: 'The type must be EARNING, EXPENSE or INVESTIMENT',
            //     })
            // }

            await createTransactionSchema.parseAsync(params)

            const createdTransaction =
                await this.createTransactionUseCase.execute(params)

            return created(createdTransaction)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.errors[0].message,
                })
            }
            console.error(error)
            return serverError()
        }
    }
}
