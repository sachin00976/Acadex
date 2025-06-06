import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import {Material} from "../../models/other/material.model.js"
import { asyncHandler } from "../../utils/AsyncHandler.js";
import mongoose from "mongoose";

const getMaterial = asyncHandler(async (req, res) => {
    // console.log("cat")
    const material = await Material.find(req.body);

    if (!material || material.length === 0) {
        throw new ApiError(404, "No Material Available!");
    }

    return res.status(200).json(
        new ApiResponse(200,material, "Material Found!")
    );
});

const addMaterial = asyncHandler(async (req, res) => {
    const { faculty, subject, title } = req.body;
    const link = req?.file?.filename;

    if (!faculty || !subject || !title || !link) {
        throw new ApiError(400, "All fields (faculty, subject, title, file) are required!");
    }

    await Material.create({
        faculty,
        subject,
        title,
        link,
    });

    return res.status(201).json(
        new ApiResponse(201, "Material Added!")
    );
});


const deleteMaterial = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Material ID is required!");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Material ID format!");
    }

    const material = await Material.findByIdAndDelete(id);

    if (!material) {
        throw new ApiError(404, "No Material Available!");
    }

    return res.status(200).json(
        new ApiResponse(200, material,"Material Deleted!")
    );
});


const updateMaterial = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { faculty, link, subject, title } = req.body;

    if (!id) {
        throw new ApiError(400, "Material ID is required!");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Material ID format!");
    }

    const updatedFields = { faculty, link, subject, title };

    const material = await Material.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!material) {
        throw new ApiError(404, "No Material Available!");
    }

    return res.status(200).json(
        new ApiResponse(200,material ,"Material Updated!")
    );
});



export {
    getMaterial,
    addMaterial,
    deleteMaterial,
    updateMaterial
}

