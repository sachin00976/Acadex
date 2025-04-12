import mongoose from "mongoose";
import {Subject} from "../../models/other/subject.model.js"
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";

const getSubject = asyncHandler(async (req, res) => {
    const subject = await Subject.find();

    if (!subject || subject.length === 0) {
        return res.status(200).json(
            new ApiResponse(200,[], "No subject found")
        )
    }

    return res.status(200).json(
        new ApiResponse(200,subject, "All Subject Loaded!")
    );
});

const addSubject = asyncHandler(async (req, res) => {
    const { name, code } = req.body;

    if (!name || !code) {
        throw new ApiError(400, "Both name and code are required!");
    }

    const existingSubject = await Subject.findOne({ code });

    if (existingSubject) {
        throw new ApiError(400, "Subject Already Exists");
    }

    await Subject.create({ name, code });

    return res.status(201).json(
        new ApiResponse(201, "Subject Added!")
    );
});

const deleteSubject = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Subject ID is required!");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Subject ID format!");
    }

    const subject = await Subject.findByIdAndDelete(id);

    if (!subject) {
        throw new ApiError(404, "No Subject Exists!");
    }

    return res.status(200).json(
        new ApiResponse(200, "Subject Deleted!")
    );
});


export{
    getSubject,
    addSubject,
    deleteSubject
}
