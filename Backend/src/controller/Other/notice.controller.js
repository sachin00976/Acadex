import mongoose from "mongoose";
import {Notice} from "../../models/other/notice.model.js"
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";

const getNotice = asyncHandler(async (req, res) => {
    const notice = await Notice.find(req.body);

    if (!notice || notice.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, [],"No notice found", )
        )
    }

    return res.status(200).json(
        new ApiResponse(200, notice,"Notice Get Successfully", )
    );
});

const addNotice = asyncHandler(async (req, res) => {
    const { link, description, title, type } = req.body;
    

    if (!description || !title) {
        throw new ApiError(400, "All fields (link, description, title, type) are required!");
    }

    const existingNotice = await Notice.findOne({ link, description, title, type });

    if (existingNotice) {
        throw new ApiError(400, "Notice Already Exists!");
    }

    await Notice.create({ link, description, title, type });

    return res.status(201).json(
        new ApiResponse(201, "Notice Added Successfully")
    );
});

const updateNotice = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { link, description, title, type } = req.body;

    if (!id) {
        throw new ApiError(400, "Notice ID is required!");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Notice ID format!");
    }

    const updatedFields = { link, description, title, type };

    const notice = await Notice.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!notice) {
        throw new ApiError(404, "No Notice Available!");
    }

    return res.status(200).json(
        new ApiResponse(200,notice ,"Notice Updated Successfully")
    );
});

const deleteNotice = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Notice ID is required!");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Notice ID format!");
    }

    const notice = await Notice.findByIdAndDelete(id);

    if (!notice) {
        throw new ApiError(404, "No Notice Available!");
    }

    return res.status(200).json(
        new ApiResponse(200, "Notice Deleted Successfully")
    );
});

export {
    getNotice,
    addNotice,
    updateNotice,
    deleteNotice
}