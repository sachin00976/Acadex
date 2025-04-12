import mongoose from "mongoose";
import { Marks } from "../../models/other/marks.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";

const getMarks = asyncHandler(async (req, res) => {
    const marks = await Marks.find(req.body);

    if (!marks || marks.length === 0) {
        new ApiResponse(200,"Marks not uploaded yet!");
    }

    return res.status(200).json(
        new ApiResponse(200, marks,"All Marks Loaded!")
    );
});

const addMarks = asyncHandler(async (req, res) => {
    const { enrollmentNo, internal, external } = req.body;

    if (!enrollmentNo) {
        throw new ApiError(400, "Enrollment number is required!");
    }

    let existingMarks = await Marks.findOne({ enrollmentNo });

    if (existingMarks) {
        if (internal) {
            existingMarks.internal = {
                ...existingMarks.internal,
                ...internal
            };
        }

        if (external) {
            existingMarks.external = {
                ...existingMarks.external,
                ...external
            };
        }

        await existingMarks.save();

        return res.status(200).json(
            new ApiResponse(200, "Marks Updated!")
        );
    }

    await Marks.create(req.body);

    return res.status(201).json(
        new ApiResponse(201, "Marks Added!")
    );
});

const deleteMarks = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Marks ID is required!");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Marks ID format!");
    }

    const mark = await Marks.findByIdAndDelete(id);

    if (!mark) {
        throw new ApiError(404, "No Marks Data Exists!");
    }

    return res.status(200).json(
        new ApiResponse(200, "Marks Deleted!")
    );
});



export {
    getMarks,
    addMarks,
    deleteMarks
}