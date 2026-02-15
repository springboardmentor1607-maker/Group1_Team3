import express from 'express'
import userRoutes from './routes/user.routes.js'
import { connectDB } from './config/db.js';
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config();
console.log("Check MONGO_URL:", process.env.MONGO_URL);


const app = express();
connectDB();

app.use(cors());
app.use(express.json());



app.use("/api/user", userRoutes)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log("welcome to civic_issue");
})
