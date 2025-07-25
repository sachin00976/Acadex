import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { router as adminRoutes } from './src/routes/admin.routes.js';
import { router as facultyRoutes } from './src/routes/faculty.routes.js';
import { router as otherbranch } from './src/routes/Other Api/branch.route.js';
import { router as othermarks } from './src/routes/Other Api/marks.route.js';
import { router as othermaterial } from './src/routes/Other Api/material.route.js';
import { router as othernotice } from './src/routes/Other Api/notice.route.js';
import { router as othersubject } from './src/routes/Other Api/subject.route.js';
import { router as othertimetable } from './src/routes/Other Api/timetable.route.js';
import {router as commonUser} from './src/routes/commonUser.routes.js'
import { router as chatRoutes } from './src/routes/chatRoutes.js';
import {router as messageRoutes} from "./src/routes/messgae.routes.js"
import { router as studentRoutes } from './src/routes/student.routes.js';
import { router as notificationRoutes } from './src/routes/notification.routes.js';


const app = express();

// Configure CORS
app.use(cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "PUT", "DELETE", "POST", "PATCH"]
}));
app.use('/media', express.static('public/media'));
// Middleware for cookies and JSON parsing
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/faculty', facultyRoutes);
app.use('/api/v1/branch', otherbranch);
app.use('/api/v1/marks', othermarks);
 app.use('/api/v1/material', othermaterial);
app.use('/api/v1/notice', othernotice);
app.use('/api/v1/subject', othersubject);
app.use('/api/v1/timetable', othertimetable);
app.use('/api/v1/student',studentRoutes)
app.use('/api/v1/search',commonUser)
app.use("/api/v1/chat",chatRoutes)
app.use("/api/v1/message",messageRoutes)
app.use("/api/v1/notifications", notificationRoutes);


export default app;
