import express, { json } from 'express'
import "express-async-errors"
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError } from '@ticketing-mcsv/common'
import { currentUser } from '@ticketing-mcsv/common'

import { newOrderRouter } from './routes/new'
import {showOrderRouter} from './routes/show'
import { indexOrderRouter } from './routes'
import { deleteOrderRouter } from './routes/delete'

var cors = require('cors')

const app = express()
app.use(cors())
app.set('trust proxy', true)
app.use(json())
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}))
app.use(currentUser)

app.use(newOrderRouter)
app.use(showOrderRouter)
app.use(indexOrderRouter)
app.use(deleteOrderRouter)


app.all('*', async ()=>{
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }
