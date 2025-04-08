import { Marks } from "../../models/other/marks.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";

const getMarks = asyncHandler(async (req, res) => {
    const marks = await Marks.find(req.body);

    if (!marks || marks.length === 0) {
        throw new ApiError(404, "Marks Not Available");
    }

    return res.status(200).json(
        new ApiResponse(200, "All Marks Loaded!", marks)
    );
});

export {
    getMarks,
    
}