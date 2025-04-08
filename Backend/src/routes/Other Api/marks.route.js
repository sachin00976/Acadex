import express from "express"
import { addMarks, getMarks } from "../../controller/Other/marks.controller.js";

const router=express.Router();

router.route("/getMarks").post(getMarks);
router.route("/addMarks").post(addMarks);

export {router}