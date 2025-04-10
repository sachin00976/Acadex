import express from "express"
import { addMaterial, deleteMaterial, getMaterial, updateMaterial } from "../../controller/Other/material.controller.js";
import { upload } from "../../middleware/multer.middleware.js";

const router=express.Router();
router.route("/getMaterial").post(getMaterial)
router.route("/addMaterial").post(upload.single("material"),addMaterial)
router.route("/deleteMaterial/:id").delete(deleteMaterial)
router.route("/updateMaterial/:id").put(updateMaterial)


export {router}