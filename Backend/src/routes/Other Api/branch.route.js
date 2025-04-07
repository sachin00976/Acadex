import express from "express"
import { addBranch, deleteBranch, getBranch } from "../../controller/Other/branch.controller.js";

const router=express.Router();

router.route("/getBranch").get(getBranch);
router.route("/addBranch").post(addBranch);
router.route("/deleteBranch/:id").delete(deleteBranch);