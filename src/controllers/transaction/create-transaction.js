import { badRequest, serverError } from '../../helpers/http-helper.js'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    created,
} from '../helpers/user.js'
import validator from 'validator'
export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            const requiredFields = [
                'id',
                'user_id',
                'name',
                'date',
                'amount',
                'type',
            ]

            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return badRequest({ message: `Missing param: ${field}` })
                }
            }

            const userIdIsValid = checkIfIdIsValid(params.user_id)

            if (!userIdIsValid) {
                return invalidIdResponse()
            }

            if (params.amount <= 0) {
                return badRequest({
                    message: 'The amount must be greater than zero',
                })
            }

            const amountIsValid = validator.isCurrency(
                params.amount.toString(),
                {
                    allow_negatives: false,
                    digits_after_decimal: [2],
                    decimal_separator: '.',
                }
            )

            if (!amountIsValid) {
                return badRequest({
                    message: 'The amount must be a valid currency value',
                })
            }

            const type = params.type.trim().toUpperCase()

            const typeIsValid = ['EARNING', 'EXPENSE', 'INVESTIMENT'].includes(
                type
            )

            if (!typeIsValid) {
                return badRequest({
                    message: 'The type must be EARNING, EXPENSE or INVESTIMENT',
                })
            }

            const createdTransaction =
                await this.createTransactionUseCase.execute({
                    ...params,
                    type,
                })

            return created(createdTransaction)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
