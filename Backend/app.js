import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { router as adminRoutes } from './src/routes/admin.routes.js';
import { router as facultyRoutes } from './src/routes/faculty.routes.js';
import { router as otherbranch } from './src/routes/Other Api/branch.route.js';
import { router as othermarks } from './src/routes/Other Api/marks.route.js';
import { router as othermaterial } from './src/routes/Other Api/material.route.js';

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

app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/faculty', facultyRoutes);
app.use('/api/v1/branch', otherbranch);
app.use('/api/v1/marks', othermarks);
app.use('/api/v1/material', othermaterial);

export default app;
