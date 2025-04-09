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


export {
    getNotice,
    
}