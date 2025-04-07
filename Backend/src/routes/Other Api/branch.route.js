import express from "express"
import { addBranch, getBranch } from "../../controller/Other/branch.controller.js";

const router=express.Router();

router.route("/getBranch").get(getBranch);
router.route("/addBranch").post(addBranchBranch);