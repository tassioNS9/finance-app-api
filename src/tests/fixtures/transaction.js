import { faker } from '@faker-js/faker'

export const transaction = {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    name: faker.person.jobDescriptor(),
    date: faker.date.recent().toISOString(),
    type: faker.helpers.arrayElement(['EXPENSE', 'EARNING', 'INVESTMENT']),
    amount: Number(faker.finance.amount()),
}
