import {TimeTable} from "../../models/other/timetable.model.js"
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";

const getTimetable = asyncHandler(async (req, res) => {
    const timetable = await TimeTable.find(req.body);

    if (!timetable || timetable.length === 0) {
        throw new ApiError(404, "Timetable Not Found");
    }

    return res.status(200).json(
        new ApiResponse(200, timetable,"Timetable Fetched Successfully")
    );
});

export {
    getTimetable,
    
}
