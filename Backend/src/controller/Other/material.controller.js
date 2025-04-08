import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import {Material} from "../../models/other/material.model.js"
import { asyncHandler } from "../../utils/AsyncHandler.js";

const getMaterial = asyncHandler(async (req, res) => {
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


export {
    getMaterial,
    addMaterial,
}

