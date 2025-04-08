import express from "express"
import { getMaterial } from "../../controller/Other/material.controller.js";

const router=express.Router();
router.route("getMaterial").post(getMaterial)


export {router}