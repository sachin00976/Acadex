import express from 'express'
import { upload } from '../middleware/multer.middleware.js'
import { verifyJWT } from '../middleware/admin.middleware.js';
import {studentRegister,studentLogin,studentLogout,deleteStudent,getDetail,updateStudent} from '../controller/student.controller.js'

const router=express.Router();

router.route('/register').post(upload.single("profile"),studentRegister)
router.route('/login').post(studentLogin)
router.route("/logout").post(verifyJWT,studentLogout);
router.route("/deleteFaculty/:studentId").delete(verifyJWT,deleteStudent);
router.route("/getdetail").post(getDetail);
router.route('/updateDetail').patch(upload.single("profile"),updateStudent)

export {router}