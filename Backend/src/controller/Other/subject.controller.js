import {Subject} from "../../models/other/subject.model.js"
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";

const getSubject = asyncHandler(async (req, res) => {
    const subject = await Subject.find();

    if (!subject || subject.length === 0) {
        throw new ApiError(404, "No Subject Available");
    }

    return res.status(200).json(
        new ApiResponse(200,subject, "All Subject Loaded!")
    );
});

export{
    getSubject,
    
}
