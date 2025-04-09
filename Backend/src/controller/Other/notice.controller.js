import {Notice} from "../../models/other/notice.model.js"
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";

const getNotice = asyncHandler(async (req, res) => {
    const notice = await Notice.find(req.body);

    if (!notice || notice.length === 0) {
        throw new ApiError(404, "No Notice Available!");
    }

    return res.status(200).json(
        new ApiResponse(200, "Notice Get Successfully", notice)
    );
});

const addNotice = asyncHandler(async (req, res) => {
    const { link, description, title, type } = req.body;

    if (!link || !description || !title || !type) {
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



export {
    getNotice,
    addNotice,
}