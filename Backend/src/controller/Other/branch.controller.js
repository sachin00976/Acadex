import mongoose from "mongoose";
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

const deleteBranch = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Branch ID is required!");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Branch ID format!");
    }

    const branch = await Branch.findByIdAndDelete(id);

    if (!branch) {
        throw new ApiError(404, "No Branch Data Exists!");
    }

    return res.status(200).json(
        new ApiResponse(200, "Branch Deleted!")
    );
});

export {
    getBranch,
    addBranch,
    deleteBranch,
    
}