import express  from "express";
import { verifyJWT } from "../middleware/faculty.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { 
    facultyRegister,
    facultyLogin,
    facultyLogout,
    deleteFaculty
 } from "../controller/faculty.controller.js";

const router=express.Router()

router.route("/register").post(upload.single("profile"),facultyRegister);
router.route("/login").post(facultyLogin);
router.route("/logout").post(verifyJWT,facultyLogout);
router.route("/deleteFaculty/:facultyId").delete(verifyJWT,deleteFaculty);

export {router}
