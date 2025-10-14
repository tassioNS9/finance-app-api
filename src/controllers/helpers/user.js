import { badRequest, notFound } from './http.js'

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

export const userNotFoundResponse = () =>
    notFound({ message: 'User not found.' })
