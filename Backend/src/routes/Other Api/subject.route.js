import express from "express"
import { getSubject } from "../../controller/Other/subject.controller.js";

const router=express.Router();
router.route("/getSubject").get(getSubject)

export {router}