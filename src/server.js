import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { connectDB } from './config/db.js'
import userRoutes from './routes/user.route.js'
import bookingRoutes from './routes/booking.route.js'

dotenv.config()

const app = express()

//DB connect
connectDB()

//middleware
app.use(express.json())
app.use(cookieParser())


//routes
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);

app.listen(process.env.PORT,()=>{
    console.log("server running on PORT = ",process.env.PORT);
    
})