import express from 'express'
import { adminRegister } from '../controller/admin.controller.js'
import { upload } from '../controller/multer.middleware.js'

const router=express.Router();

router.route('/register').post(upload.single("adminProfile"),adminRegister)

export {router}