import { UserNotFoundError } from '../../errors/user.js'
export class CreateTransactionUseCase {
    constructor(
        createTransacionRepository,
        getUserByIdRepository,
        idGeneratorAdapter,
    ) {
        this.createTransactionRepository = createTransacionRepository
        this.getUserByIdRepository = getUserByIdRepository
        this.idGeneratorAdapter = idGeneratorAdapter
    }
    async execute(createTransactionParams) {
        const userId = createTransactionParams.user_id
        const existingUser = await this.getUserByIdRepository.execute(userId)

        if (!existingUser) {
            throw new UserNotFoundError(userId)
        }

        const transactionId = this.idGeneratorAdapter.execute()

        // chamar o repositório
        const createdTransaction =
            await this.createTransactionRepository.execute({
                ...createTransactionParams,
                id: transactionId,
            })

        return createdTransaction
    }
}
