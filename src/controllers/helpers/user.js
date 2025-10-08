import { badRequest } from './http.js'
import validator from 'validator'

export const invalidPasswordResponse = () => {
    return badRequest({
        message: 'Password must be at least 6 characters',
    })
}

export const emailIsAlreadyInUseResponse = () => {
    return badRequest({
        message: 'The provided e-mail is already in use',
    })
}

export const generateInvalidIdResponse = () => {
    return badRequest({ message: 'The provided id is not valid!' })
}

export const invalidIdResponse = () => {
    return badRequest({ message: 'The provided id is not valid!' })
}

export const checkIfIdIsValid = (id) => validator.isUUID(id)

export const checkIfPasswordIsValid = (password) => password.length >= 6

export const checkIfEmailIsValid = (email) => validator.isEmail(email)
