import express from 'express'
import dotenv from 'dotenv'
import adminRoutes from './route.js'
import { v2 as cloudinary } from 'cloudinary'
import connectDB from './config/db.js';

dotenv.config()

cloudinary.config({
  cloud_name: process.env.Cloud_Name as string,
  api_key: process.env.Cloud_Api_Key as string,
  api_secret: process.env.Cloud_Api_Secret as string,
})


const app = express()

app.use(express.json())


app.use('/api/v1', adminRoutes)

app.use(connectDB)

const PORT = process.env.PORT || 7600;

const startServer = async () => {
  await connectDB()
  app.listen(5000, () => {
    console.log(`Server is Running on Port ${PORT}`)
  })
}

startServer()