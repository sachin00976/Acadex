import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import {Material} from "../../models/other/material.model.js"
import { asyncHandler } from "../../utils/AsyncHandler.js";

const getMaterial = asyncHandler(async (req, res) => {
    const material = await Material.find(req.body);

    if (!material || material.length === 0) {
        throw new ApiError(404, "No Material Available!");
    }

    return res.status(200).json(
        new ApiResponse(200, "Material Found!", material)
    );
});

export {
    getMaterial
}

