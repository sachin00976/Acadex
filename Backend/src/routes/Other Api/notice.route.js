import express from "express"
import { addNotice, getNotice } from "../../controller/Other/notice.controller.js";

const router=express.Router();
router.route("/getNotice").get(getNotice)
router.route("/addNotice").post(addNotice);

export {router}