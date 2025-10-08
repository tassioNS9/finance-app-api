import { badRequest, serverError, ok } from '../helpers/http.js'
import validator from 'validator'
import { EmailAlreadyInUseError } from '../../errors/user.js'
import {
    invalidPasswordResponse,
    emailIsAlreadyInUseResponse,
    checkIfPasswordIsValid,
    checkIfEmailIsValid,
} from '../helpers/user.js'

import { invalidIdResponse } from '../helpers/validation.js'

export class UpdateUserController {
    constructor(updateUserUseCase) {
        this.updateUserUseCase = updateUserUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            const isIdValid = validator.isUUID(userId)

            if (!isIdValid) {
                return invalidIdResponse()
            }
            const params = httpRequest.body

            const allowedFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            const someFieldIsNotAllowed = Object.keys(params).some(
                (key) => !allowedFields.includes(key)
            )

            if (someFieldIsNotAllowed) {
                return badRequest({
                    message: 'Some field is not allowed to be updated!',
                })
            }

            if (params.password) {
                const passwordIsValid = checkIfPasswordIsValid(params.password)

                if (!passwordIsValid) {
                    return invalidPasswordResponse()
                }
            }

            if (params.email) {
                const emailIsValid = checkIfEmailIsValid(params.email)

                if (!emailIsValid) {
                    return emailIsAlreadyInUseResponse()
                }
            }
            const updatedUser = await this.updateUserUseCase.execute(
                userId,
                params
            )

            return ok(updatedUser)
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }
            console.error(error)
            return serverError()
        }
    }
}
