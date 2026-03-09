import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import express from 'express'
import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js'
import complaintRoutes from './routes/complaint.route.js'
import chatRoutes from './routes/chatbot.route.js'
import adminRoutes from './routes/admin.route.js'
import volunteerRoutes from './routes/volunteer.route.js'
import { connectDB } from './config/db.js';
import cors from 'cors'



const app = express();
connectDB();

app.use(cors());
app.use(express.json());



app.use("/api/auth",authRoutes)
app.use("/api/user",userRoutes)
app.use("/api/complaints",complaintRoutes)
app.use("/api/chat",chatRoutes)
app.use("/api/admin",adminRoutes)
app.use("/api/volunteer",volunteerRoutes)



const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log("welcome to civic_issue");
})
