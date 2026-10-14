import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoute from './router.js';

dotenv.config()

const app = express()

app.use(express.json())


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOOSE_URL as string, {
            dbName: 'spotifyDB'
        })
        console.log('mongoose is connected')
    } catch (error) {
        console.log(error)
    }
};

app.use('/api/v1/',userRoute)

const PORT = process.env.PORT || 4460;

const startServer = async () => {
    await connectDB()
    app.listen(PORT, () => {
        console.log('server is runing', PORT)
    })
}
startServer()