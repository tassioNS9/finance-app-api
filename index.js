import express from 'express'
import 'dotenv/config.js'

const app = express()

app.use(express.json())

app.listen(3000, () => console.log('listening on port 3000'))
