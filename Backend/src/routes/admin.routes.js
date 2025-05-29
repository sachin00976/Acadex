import express from 'express'
import { upload } from '../middleware/multer.middleware.js'
import { verifyJWT } from '../middleware/admin.middleware.js';
import { 
    adminRegister,
    adminLogin,
    adminLogout,
    deleteAdmin,
    getDetail,
    updateDetail,
    passwordValidator,
    passwordChangeHandler

 } from '../controller/admin.controller.js'
 
const router=express.Router();

router.route('/register').post(upload.single("profile"),adminRegister)
router.route("/login").post(adminLogin)
router.route("/logout").post(verifyJWT,adminLogout)
router.route("/deleteAdmin/:adminId").delete(verifyJWT,deleteAdmin)
router.route("/getDetail").post(getDetail)
router.route("/updateProfile").patch(upload.single("profile"),updateDetail);
router.route('/passwordAuth').post(passwordValidator)
router.route("/passwordChange").patch(passwordChangeHandler)

export {router}