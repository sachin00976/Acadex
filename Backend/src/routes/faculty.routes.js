import express  from "express";
import { upload } from "../middleware/multer.middleware.js";
import { 
    facultyRegister
 } from "../controller/faculty.controller.js";

const router=express.Router()

router.route("/register").post(upload.single("facultyProfile"),facultyRegister);

export {router}
