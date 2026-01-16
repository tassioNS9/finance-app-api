import { UserNotFoundError } from '../../errors/user.js'
import { getTransactionsSchema } from '../../schemas/transactions.js'
import { serverError, ok, badRequest } from '../helpers/http.js'
import { userNotFoundResponse } from '../helpers/user.js'
import { ZodError } from 'zod'
export class GetTransactionsByUserIdController {
    constructor(getTransactionsByUserIdUseCase) {
        this.getTransactionsByUserIdUseCase = getTransactionsByUserIdUseCase
    }

    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId
            const from = httpRequest.query.from
            const to = httpRequest.query.to

            await getTransactionsSchema.parseAsync({
                user_id: userId,
                from,
                to,
            })

            const transactions =
                await this.getTransactionsByUserIdUseCase.execute({
                    userId,
                    from,
                    to,
                })

            return ok(transactions)
        } catch (error) {
            console.error(error)

            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.errors[0].message,
                })
            }

            return serverError()
        }
    }
}
