import { ok, serverError } from './helpers/http.js'
import { invalidIdResponse } from './helpers/user.js'
import { DeleteUserUseCase } from '../use-cases/delete-user.js'
import validator from 'validator'

export class DeleteUserController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId
            const isIdValid = validator.isUUID(userId)

            if (!isIdValid) {
                return invalidIdResponse()
            }
            const deleteUserUseCase = new DeleteUserUseCase()

            const deletedUser = await deleteUserUseCase.execute(userId)
            return ok(deletedUser)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
