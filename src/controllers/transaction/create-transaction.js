import { ZodError } from 'zod'
import { createTransactionSchema } from '../../schemas/transactions.js'
import { badRequest, serverError, created } from '../helpers/http.js'

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            await createTransactionSchema.parseAsync(params) // O ParseAsync para fazer a validação de forma assincrona

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
