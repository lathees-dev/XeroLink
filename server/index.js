import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import path from "path";
import { fileURLToPath } from "url";

import authRoutes from './routes/authRoutes.js'
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import queueRoutes from './routes/queueRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get('/', (req, res) => res.send("XeroLink API running!"));
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/queue', queueRoutes);
app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI)
.then(() => app.listen(5000, () => console.log("Server running on port 5000")))
.catch(err=>console.error("MongoDB connection error:", err));