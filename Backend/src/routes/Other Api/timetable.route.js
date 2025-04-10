import express from "express"
import { getTimetable } from "../../controller/Other/timetable.controller.js";

const router=express.Router();
router.route("/getTimetable").get(getTimetable)

export {router}