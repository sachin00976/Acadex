import express from 'express'
import { upload } from '../controller/multer.middleware.js'
import { 
    adminRegister,
    adminLogin

 } from '../controller/admin.controller.js'

const router=express.Router();

router.route('/register').post(upload.single("adminProfile"),adminRegister)
router.route("/login").post(adminLogin)

export {router}