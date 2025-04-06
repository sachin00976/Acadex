import express from 'express'
import { upload } from '../middleware/multer.middleware.js'
import { verifyJWT } from '../middleware/admin.middleware.js';
import { 
    adminRegister,
    adminLogin,
    adminLogout

 } from '../controller/admin.controller.js'

const router=express.Router();

router.route('/register').post(upload.single("adminProfile"),adminRegister)
router.route("/login").post(adminLogin)
router.route("/logout").post(verifyJWT,adminLogout)

export {router}