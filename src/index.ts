import dotenv from 'dotenv'
dotenv.config()

import morgan from 'morgan'
import express from 'express'
import bodyParser from 'body-parser'
const app = express()

import mongoSetup from '@app/mongo'
import jobsSetup from '@app/jobs'

import corsMiddleware from '@app/middlewares/cors'
import httpsMiddleware from '@app/middlewares/https'
import privateMiddleware from '@app/middlewares/private'
import errorMiddleware from '@app/middlewares/error'
import notFoundMiddleware from '@app/middlewares/notFound'

// API Routes
import locationFunc from '@app/routes/v1/location/:zipcode/func'
import userFunc from '@app/routes/v1/user/create/func'
import whatsappFunc from '@app/routes/v1/user/:whatsapp/get/func'

async function init() {
  await mongoSetup()
  await jobsSetup()

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(morgan('dev'))
  app.use(corsMiddleware)
  app.use(httpsMiddleware)
  app.use(privateMiddleware)

  app.get('/', (req, res) =>
    res.json({
      status: 'alive',
      now: new Date(),
    })
  )
  app.get('/v1/location/:zipcode', locationFunc)
  app.post('/v1/user', userFunc)
  app.get('/v1/user/:whatsapp', whatsappFunc)

  app.all('*', notFoundMiddleware)

  app.use('*', errorMiddleware)

  app.listen(process.env.PORT || 3000, () => {
    console.log('Server running on port 3000')
  })
}

init()
