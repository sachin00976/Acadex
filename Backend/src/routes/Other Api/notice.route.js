import express from "express"
import { addNotice, getNotice, updateNotice } from "../../controller/Other/notice.controller.js";

const router=express.Router();
router.route("/getNotice").get(getNotice)
router.route("/addNotice").post(addNotice);
router.route("/updateNotice/:id").put(updateNotice)

export {router}