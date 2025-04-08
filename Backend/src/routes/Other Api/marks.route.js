import express from "express"
import { addMarks, deleteMarks, getMarks } from "../../controller/Other/marks.controller.js";

const router=express.Router();

router.route("/getMarks").post(getMarks);
router.route("/addMarks").post(addMarks);
router.route("/deleteMarks/:id").delete(deleteMarks);

export {router}