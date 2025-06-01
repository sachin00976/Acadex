import express from "express"
const router=express.Router()
import { searchUser } from "../controller/common.controller.js"
import { verifyJWT } from "../middleware/commonAuth.middleware.js"

router.route('/searchUser').get(verifyJWT,searchUser)

export {router}