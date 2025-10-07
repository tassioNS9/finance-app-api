export class GetUserByIdUseCase {
    constructor(getUserByIdRepository) {
        this.getUserByIdRepository = getUserByIdRepository
    }
    async execute(userId) {
        // chamar o repositório
        const user = await this.getUserByIdRepository.execute(userId)

        return user
    }
}
