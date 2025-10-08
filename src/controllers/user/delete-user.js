import { notFound, ok, serverError } from '../helpers/http.js'
import { invalidIdResponse } from '../helpers/user.js'
import validator from 'validator'

export class DeleteUserController {
    constructor(deleteUserUseCase) {
        this.deleteUserUseCase = deleteUserUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId
            const isIdValid = validator.isUUID(userId)

            if (!isIdValid) {
                return invalidIdResponse()
            }

            const deletedUser = await this.deleteUserUseCase.execute(userId)

            if (!deletedUser) {
                return notFound({ message: 'User not found' })
            }
            return ok(deletedUser)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
