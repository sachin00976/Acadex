import express from "express"
import { verifyJWT } from "../middleware/commonAuth.middleware.js"
import { upload } from "../middleware/multer.middleware.js"
import { 
    accessChat,
    createGroupChat,
    renameGroup,
    removeFromGroup,
    addToGroup,
    fetchChat,
    leaveGroup
 } from "../controller/chatControllers.js"

const router=express.Router()

router.route('/accessChat').post(verifyJWT,accessChat)
router.route('/createGroup').post(verifyJWT,upload.single("image"),createGroupChat)
router.route("/renameGroup").put(verifyJWT,renameGroup)
router.route("/removeMemeber").put(verifyJWT,removeFromGroup)
router.route("/addMember").put(verifyJWT,addToGroup)
router.route("/fetchChat").get(verifyJWT,fetchChat)
router.route("/leaveGroup").put(verifyJWT,leaveGroup)


export {router}