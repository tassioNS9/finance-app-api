import { faker } from '@faker-js/faker'

export const user = {
    id: faker.string.uuid(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({
        length: 8,
    }),
}

export const userBalance = {
    earnings: faker.datatype.number(),
    expenses: faker.datatype.number(),
    investments: faker.datatype.number(),
    balance: faker.datatype.number(),
}
