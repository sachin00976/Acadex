import express from "express"
import { allMessage, sendMessage,deleteMessage } from "../controller/message.controller.js"
import { verifyJWT } from "../middleware/commonAuth.middleware.js"
const router=express.Router()

router.route("/sendMessage").post(verifyJWT,sendMessage)
router.route("/allMessage/:chatId").get(verifyJWT,allMessage)
router.route("/deleteMessage").delete(verifyJWT,deleteMessage)
export {router}