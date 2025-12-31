import express, { response } from 'express'
import 'dotenv/config.js'
import {
    makeCreateUserController,
    makeDeleteUserController,
    makeGetUserByIdController,
    makeLoginUserController,
    makeRefreshTokenController,
    makeUpdateUserController,
} from './src/factories/controllers/user.js'

import { makeCreateTransactionController } from './src/factories/controllers/transaction.js'
import { makeGetTransactionsByUserIdController } from './src/factories/controllers/transaction.js'
import { makeUpdateTransactionController } from './src/factories/controllers/transaction.js'
import { makeDeleteTransactionController } from './src/factories/controllers/transaction.js'
import { makeGetUserBalanceController } from './src/factories/controllers/user.js'
import { auth } from './middlewares/auth.js'
const app = express()

app.use(express.json())

app.get('/api/users', auth, async (request, response) => {
    const getUserByIdController = makeGetUserByIdController()

    const { statusCode, body } = await getUserByIdController.execute({
        // Com isso passamos o id do Usuário logado e ele só pegar suas informações próprias
        ...request,
        params: {
            userId: request.userId,
        },
    })

    response.status(statusCode).send(body)
})

app.get('/api/users/balance', auth, async (request, response) => {
    const getUserBalanceController = makeGetUserBalanceController()

    const { statusCode, body } = await getUserBalanceController.execute({
        ...request,
        params: {
            userId: request.userId,
        },
    })

    response.status(statusCode).send(body)
})

app.post('/api/users', async (request, response) => {
    const createUserController = makeCreateUserController()

    const { statusCode, body } = await createUserController.execute(request)

    response.status(statusCode).send(body)
})

app.patch('/api/users/:userId', auth, async (request, response) => {
    const updateUserController = makeUpdateUserController()

    const { statusCode, body } = await updateUserController.execute(request)

    response.status(statusCode).send(body)
})

app.delete('/api/users/:userId ', auth, async (request, response) => {
    const deleteUserController = makeDeleteUserController()

    const { statusCode, body } = await deleteUserController.execute(request)

    response.status(statusCode).send(body)
})

app.post('/api/login', async (request, response) => {
    const loginUserController = makeLoginUserController()
    const { statusCode, body } = await loginUserController.execute(request)

    response.status(statusCode).send(body)
})

app.post('/api/refresh-token', async (request, response) => {
    const refreshTokenController = makeRefreshTokenController()
    const { statusCode, body } = await refreshTokenController.execute(request)
    response.status(statusCode).send(body)
})

app.post('/api/transactions', auth, async (request, response) => {
    const createTransactionController = makeCreateTransactionController()

    const { statusCode, body } = await createTransactionController.execute({
        ...request,
        body: {
            ...request.body,
            user_id: request.userId,
        },
    })

    response.status(statusCode).send(body)
})

app.get('/api/transactions', auth, async (request, response) => {
    const getTransactionsByUserIdController =
        makeGetTransactionsByUserIdController()

    const { statusCode, body } =
        await getTransactionsByUserIdController.execute({
            // Com isso apenas o usuario logado só pode ter acesso a suas proprias transações
            ...request,
            query: {
                ...request.query,
                userId: request.userId,
            },
        })

    response.status(statusCode).send(body)
})

app.patch(
    '/api/transactions/:transactionId',
    auth,
    async (request, response) => {
        const updateTransactionController = makeUpdateTransactionController()
        const { statusCode, body } = await updateTransactionController.execute({
            ...request,
            body: {
                ...request.body,
                user_id: request.userId,
            },
        })
        response.status(statusCode).send(body)
    }
)

app.delete('/api/transactions/:transactionId', async (request, response) => {
    const deleteTransactionController = makeDeleteTransactionController()

    const { statusCode, body } = await deleteTransactionController.execute(
        request
    )
    response.status(statusCode).send(body)
})

// eslint-disable-next-line no-undef
app.listen(process.env.PORT, () =>
    // eslint-disable-next-line no-undef
    console.log(`listening on port ${process.env.PORT}`)
)
