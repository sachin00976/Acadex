import express  from "express";
import { verifyJWT } from "../middleware/faculty.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { 
    facultyRegister,
    facultyLogin
 } from "../controller/faculty.controller.js";

const router=express.Router()

router.route("/register").post(upload.single("facultyProfile"),facultyRegister);
router.route("/login").post(facultyLogin);

export {router}
