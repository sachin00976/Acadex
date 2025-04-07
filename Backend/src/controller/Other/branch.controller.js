import { Branch } from "../../models/other/branch.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";


const getBranch = asyncHandler(async (req, res) => {
    let branches = await Branch.find();
    if(!branches){
        throw new ApiError(404, "Branch not Found");
    }

    return res.status(200).json(
        new ApiResponse(200,branches,"All Branches Loaded!")
    )
});


const addBranch = asyncHandler(async (req, res) => {
    let { name } = req.body;
    let branch = await Branch.findOne({ name });
    if (branch) {
        throw new ApiError(400,"Branch already exist!");
    }
    await Branch.create({
        name
    });

    return res.status(200).json(
        new ApiResponse(200,"Branch Added successfully!")
    )

});

export {
    getBranch,
    addBranch,
}