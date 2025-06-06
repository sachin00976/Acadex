import express from 'express';
import { upload } from '../middleware/multer.middleware.js';
import { verifyJWT } from '../middleware/student.middleware.js';
import {
  studentRegister,
  studentLogin,
  studentLogout,
  deleteStudent,
  getDetail,
  updateStudent,
  getAllStudents,
  getStudentById,
  updateStudentPassword,
  updateStudentProfileOnly,
  passwordValidator,
  getDetails
} from '../controller/student.controller.js';

const router = express.Router();

// Register/Login/Logout
router.route('/register').post(upload.single("profile"), studentRegister);
router.route('/login').post(studentLogin);
router.route("/logout").post(verifyJWT, studentLogout);

// CRUD routes
router.route("/deleteStudent/:studentId").delete(verifyJWT, deleteStudent);
router.route("/getdetail").post(verifyJWT, getDetail);
router.route("/getdetails").post(getDetails);
router.route("/updateDetail").patch(upload.single("profile"), updateStudent);

// Additional functionalities
router.route("/all").post(getAllStudents);
router.route("/:id").get(verifyJWT, getStudentById);
router.route("/update-password").patch(verifyJWT, updateStudentPassword);
router.route("/update-profile").patch(verifyJWT, upload.single("profile"), updateStudentProfileOnly);
router.route('/passwordAuth').post(passwordValidator)


export { router };
