export class DeleteUserUseCase {
    constructor(deleteUserRepository) {
        this.deleteUserRepository = deleteUserRepository
    }
    async execute(userId) {
        // chamar o repositório
        const deletedUser = await this.deleteUserRepository.execute(userId)

        return deletedUser
    }
}
