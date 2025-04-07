import { Branch } from "../../models/other/branch.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";


const getBranch = async (req, res) => {
    try {
        let branches = await Branch.find();

        return res.status(200).json(
            new ApiResponse(200,branches?branches:[],"All Branches Loaded!")
        )
    } catch (error) {
        console.error(error.message);
        console.log(error)
        throw new ApiError(500,"Internal Server Error");
    }

}