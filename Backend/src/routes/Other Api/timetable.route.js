import express from "express"
import { addTimetable, getTimetable } from "../../controller/Other/timetable.controller.js";
import { upload } from "../../middleware/multer.middleware.js";

const router=express.Router();
router.route("/getTimetable").get(getTimetable)
router.route("/addTimetable").post(upload.single("timetable"),addTimetable)

export {router}