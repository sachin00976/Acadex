import { Student } from "../models/studentSchema.js";
import { Admin } from "../models/adminSchema.js";
import { Faculty } from "../models/facultySchema.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const searchUser = asyncHandler(async (req, res) => {
    const { employeeId, email } = req.query;

    const condition = [];
    
    if (employeeId) {
        condition.push({ employeeId });
    }

    if (email) {
        condition.push({ email: { $regex: email, $options: "i" } }); 
    }

    
    const query = condition.length > 0 ? { $or: condition } : {};

        const res1 = await Admin.find({
    ...query,
    $nor: [
        { email: req.user.email },
        { employeeId: req.user.employeeId }
    ]
    }).select("firstName lastName email profile employeeId role");


        const res2 = await Faculty.find({
    ...query,
    $nor: [
        { email: req.user.email },
        { employeeId: req.user.employeeId }
    ]
    }).select("firstName lastName email profile employeeId role");

    
        const res3 = await Student.find({
    ...query,
    $nor: [
        { email: req.user.email },
        { employeeId: req.user.employeeId }
    ]
    }).select("firstName lastName email profile employeeId role");
        const result = [...res1, ...res2, ...res3];

    return res.status(200).json(
        new ApiResponse(200, result, "User(s) fetched successfully")
    );
});


export {
    searchUser
}