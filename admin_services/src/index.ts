import express from 'express'
import dotenv from 'dotenv'
import { sql } from './config/db.js';
import adminRoutes from './route.js'

dotenv.config()

const app = express()

app.use(express.json())


async function initDB() {
    try {
        await sql`
      CREATE TABLE IF NOT EXISTS albums(
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        thumbnail VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

        await sql`
      CREATE TABLE IF NOT EXISTS songs(
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        thumbnail VARCHAR(255),
        audio VARCHAR(255) NOT NULL,
        album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

        console.log('✅ Database initialized successfully');
    } catch (error) {
        console.error('❌ Error initDB:', error);
        throw error;
    }
}

app.use('/api/v1',adminRoutes)


const PORT = process.env.PORT || 7600;

const startServer = async () => {
    app.listen(5000, () => {
        console.log(`Server is Running on Port ${PORT}`)
    })
}

startServer()