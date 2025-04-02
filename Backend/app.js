import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
// Configure CORS
app.use(cors({
    origin: [], 
    credentials: true, 
    methods: ["GET", "PUT", "DELETE", "POST", "PATCH"]
}));
// Middleware for cookies and JSON parsing
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

export default app;