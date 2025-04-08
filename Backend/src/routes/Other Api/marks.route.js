import express from "express"
import { getMarks } from "../../controller/Other/marks.controller.js";

const router=express.Router();

router.route("/getMarks").post(getMarks);

export {router}