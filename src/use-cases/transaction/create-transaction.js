import { UserNotFoundError } from '../../errors/user.js'
import { v4 as uuidv4 } from 'uuid'
export class CreateTransactionUseCase {
    constructor(createTransacionRepository, getUserByIdRepository) {
        this.createTransactionRepository = createTransacionRepository
        this.getUserByIdRepository = getUserByIdRepository
    }
    async execute(createTransactionParams) {
        const userId = createTransactionParams.userId
        const existingUser = await this.getUserByIdRepository.execute(userId)

        if (existingUser) {
            throw new UserNotFoundError(userId)
        }

        const transactionId = uuidv4()

        // chamar o repositório
        const createdTransaction = await this.createUserRepository.execute({
            ...createTransactionParams,
            id: transactionId,
        })

        return createdTransaction
    }
}
