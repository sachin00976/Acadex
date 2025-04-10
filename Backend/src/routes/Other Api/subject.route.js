import express from "express"
import { addSubject, deleteSubject, getSubject } from "../../controller/Other/subject.controller.js";

const router=express.Router();
router.route("/getSubject").get(getSubject)
router.route("/addSubject").post(addSubject)
router.route("/deleteSubject/:id").delete(deleteSubject)

export {router}