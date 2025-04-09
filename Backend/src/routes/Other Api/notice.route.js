import express from "express"
import { getNotice } from "../../controller/Other/notice.controller.js";

const router=express.Router();
router.route("/getNotice").get(getNotice)

export {router}