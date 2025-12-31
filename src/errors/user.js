export class EmailAlreadyInUseError extends Error {
    constructor() {
        super('The provided email is already in use')
        this.name = 'EmailAlreadyInUseError'
    }
}

export class UserNotFoundError extends Error {
    constructor(userId) {
        super('User not found with ID: ' + userId)
    }
}

export class InvalidPasswordError extends Error {
    constructor() {
        super('Invalid Password')
    }
}

export class ForbiddenError extends Error {
    constructor() {
        super('Forbidden.')
        this.name = 'ForbiddenError'
    }
}

export class UnauthorizedError extends Error {
    constructor() {
        super('Unauthorized')
        this.name = 'UnauthorizedError'
    }
}
