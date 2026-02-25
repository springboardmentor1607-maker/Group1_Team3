import express from 'express'
import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js'
import chatRoutes from './routes/chatbot.route.js'
import { connectDB } from './config/db.js';
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config();
console.log("Check MONGO_URL:", process.env.MONGO_URL);


const app = express();
connectDB();

app.use(cors());
app.use(express.json());



app.use("/api/auth",authRoutes)
app.use("/api/user",userRoutes)
app.use("/api/chat",chatRoutes)


const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log("welcome to civic_issue");
})
