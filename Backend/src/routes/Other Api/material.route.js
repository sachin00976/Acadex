import express from "express"
import { addMaterial, getMaterial } from "../../controller/Other/material.controller.js";

const router=express.Router();
router.route("/getMaterial").post(getMaterial)
router.route("/addMaterial").post(upload.single("material"),addMaterialaterial)


export {router}