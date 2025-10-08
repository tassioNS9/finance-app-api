import { badRequest } from './http.js'
import validator from 'validator'
export const invalidIdResponse = () => {
    return badRequest({ message: 'The provided id is not valid!' })
}

export const checkIfIdIsValid = (id) => validator.isUUID(id)
