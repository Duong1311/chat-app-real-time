/* eslint-disable no-console */
// Author: TrungQuanDev: https://youtube.com/@trungquandev

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { corsOptions } from '~/config/corsOptions'
import { APIs_V1 } from '~/routes/v1/'
import { connectDB } from '~/config/connectDb'
import dotenv from 'dotenv'
dotenv.config()

const START_SERVER = () => {
  // Init Express App
  const app = express()

  // Fix Cache from disk from ExpressJS
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  // Use Cookie
  app.use(cookieParser())

  // Allow CORS: for more info, check here: https://youtu.be/iYgAWJ2Djkw
  app.use(cors(corsOptions))

  // Enable req.body json data
  app.use(express.json())

  // Use Route APIs V1
  app.use('/v1', APIs_V1)

  // Connect to MongoDB
  connectDB()

  // Should be store to env in the actual product: check here: https://youtu.be/Vgr3MWb7aOw

  app.listen(process.env.LOCAL_DEV_APP_PORT, process.env.LOCAL_DEV_APP_HOST, () => {
    console.log(`Local DEV: Hello ${process.env.AUTHOR}, Back-end Server is running successfully at Host: ${process.env.LOCAL_DEV_APP_HOST} and Port: ${process.env.LOCAL_DEV_APP_PORT}`)
  })
}

(async () => {
  try {
    // Start Back-end Server
    console.log('Starting Server...')
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()
