import express from "express"
import { addNotice, deleteNotice, getNotice, updateNotice } from "../../controller/Other/notice.controller.js";

const router=express.Router();
router.route("/getNotice").get(getNotice)
router.route("/addNotice").post(addNotice);
router.route("/updateNotice/:id").put(updateNotice)
router.route("/deleteNotice/:id").delete(deleteNotice)

export {router}