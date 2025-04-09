import express from "express"
import { addSubject, getSubject } from "../../controller/Other/subject.controller.js";

const router=express.Router();
router.route("/getSubject").get(getSubject)
router.route("/addSubject").post(addSubject)

export {router}