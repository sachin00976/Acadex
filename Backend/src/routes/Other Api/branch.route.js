import express from "express"
import { getBranch } from "../../controller/Other/branch.controller.js";

const router=express.Router();

router.route("/getBranch").get(getBranch);