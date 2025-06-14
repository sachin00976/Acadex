import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import {Material} from "../../models/other/material.model.js"
import { asyncHandler } from "../../utils/AsyncHandler.js";
import mongoose from "mongoose";

const getMaterial = asyncHandler(async (req, res) => {
    
    const material = await Material.find(req.body);

    if (!material || material.length === 0) {
        throw new ApiError(404, "No Material Available!");
    }
  //  console.log(material)
    return res.status(200).json(
        new ApiResponse(200,material, "Material Found!")
    );
    
});

const addMaterial = asyncHandler(async (req, res) => {
    const { faculty, subject, title } = req.body;
    const link = req?.file?.filename;
   // console.log("link: ",link);
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
    const { faculty,  subject, title } = req.body;
    const link = req?.file?.filename;
    console.log("link___ ",link);
    if (!id) {
        throw new ApiError(400, "Material ID is required!");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Material ID format!");
    }
   
    // Updated fields only if they are provided (avoid overwriting with undefined)
    const updatedFields = {};
    if (faculty !== undefined) updatedFields.faculty = faculty;
    if (link !== undefined) updatedFields.link = link;
    if (subject !== undefined) updatedFields.subject = subject;
    if (title !== undefined) updatedFields.title = title;

    const material = await Material.findByIdAndUpdate(id, updatedFields, { new: true, runValidators: true });
    console.log(material)
    if (!material) {
        throw new ApiError(404, "No Material Available!");
    }
   
    return res.status(200).json(
        new ApiResponse(200, material, "Material Updated!")
    );
});




export {
    getMaterial,
    addMaterial,
    deleteMaterial,
    updateMaterial
}

