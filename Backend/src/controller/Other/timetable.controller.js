import mongoose from "mongoose";
import {TimeTable} from "../../models/other/timetable.model.js"
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import {uploadOnCloudinary,deleteOnCloudinary} from "../../utils/cloudinary.js"

const getTimetable = asyncHandler(async (req, res) => {
    const timetable = await TimeTable.find(req.body);

    if (!timetable || timetable.length === 0) {
        throw new ApiError(404, "Timetable Not Found");
    }

    return res.status(200).json(
        new ApiResponse(200, timetable,"Timetable Fetched Successfully")
    );
});


const addTimetable = asyncHandler(async (req, res) => {
    const { semester, branch } = req.body;

    if (!semester || !branch || !req.file?.filename) {
        throw new ApiError(400, "Semester, branch, and file are required!");
    }

    const timeTablePath = req.file.path;
    const timeTableFileType = req.file.mimetype;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedFormats.includes(timeTableFileType)) {
        throw new ApiError(400, "Invalid file type. Please upload PNG, JPG, or WebP format.");
    }

    const uploadResponse = await uploadOnCloudinary(timeTablePath);
    if (!uploadResponse) {
        throw new ApiError(500, "Failed to upload image on Cloudinary.");
    }

    const timeTableData = {
        semester,
        branch,
        link: {
            public_id: uploadResponse.public_id,
            url: uploadResponse.secure_url
        }
    };

    const existing = await TimeTable.findOne({ semester, branch });

    if (existing) {
        const timeTablePublicId = existing.link.public_id;
        if (timeTablePublicId) {
            await deleteOnCloudinary(timeTablePublicId);
        }

        await TimeTable.findByIdAndUpdate(existing._id, timeTableData);

        return res.status(200).json(
            new ApiResponse(200, "Timetable Updated!")
        );
    }

    await TimeTable.create(timeTableData);

    return res.status(201).json(
        new ApiResponse(201, "Timetable Added!")
    );
});


const deleteTimetable = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Timetable ID is required!");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Timetable ID format!");
    }

    const timetable = await TimeTable.findByIdAndDelete(id);

    if (!timetable) {
        throw new ApiError(404, "No Timetable Exists!");
    }

    return res.status(200).json(
        new ApiResponse(200, "Timetable Deleted!")
    );
});


export {
    getTimetable,
    addTimetable,
    deleteTimetable
}
