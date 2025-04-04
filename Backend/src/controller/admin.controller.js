import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Admin } from "../models/adminSchema.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
const genrateAccessTokenAndRefreshToken=async(adminId)=>{
    try {
        const admin=await Admin.findById(adminId)
        const accessToken= await admin.generateAccessToken();
        const refreshToken=await admin.generateRefreshToken();

        admin.refreshToken=refreshToken
        admin.save({validateBeforeSave:false})

        return {accessToken,refreshToken}


    } catch (error) {
        throw new ApiError(500,"error occur while genrating tokens")
    }
}
const options = {
    httpOnly: true, 
    secure: true
  }


const adminRegister = asyncHandler(async (req, res) => {
    const adminProfilePath = req.file?.path;
    const adminProfileType = req.file?.mimetype;
    
    if (!adminProfilePath) {
        throw new ApiError(400, "Admin profile is required!");
    }

    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(adminProfileType)) {
        throw new ApiError(400, "Invalid file type. Please provide a profile in PNG, JPG, or WebP format.");
    }

    const { employeeId, firstName, middleName, lastName, email, phoneNumber, gender, password } = req.body;
    
    if (!employeeId || !firstName || !lastName || !email || !phoneNumber || !gender || !password) {
        throw new ApiError(400, "All fields are required!");
    }

    const user = await Admin.findOne({
        $or: [{ email }, { employeeId }]
    });

    if (user) {
        throw new ApiError(409, "Admin with given email or employeeId already exists");
    }

    const uploadResponse = await uploadOnCloudinary(adminProfilePath);
    if (!uploadResponse) {
        throw new ApiError(500, "Error occurred while uploading the admin profile");
    }

    const createResponse = await Admin.create({
        employeeId,
        firstName,
        middleName,
        lastName,
        email,
        phoneNumber,
        gender,
        password,
        profile: {
            public_id: uploadResponse.public_id,
            url: uploadResponse.secure_url,
        }
    });

    if (!createResponse) {
        throw new ApiError(500, "Failed to register admin");
    }

    const createdAdmin = await Admin.findOne({ email }).select("-password -__v -createdAt -updatedAt");

    if (!createdAdmin) {
        throw new ApiError(500, "Internal DB server error! Please try again");
    }

    const { refreshToken, accessToken } = await genrateAccessTokenAndRefreshToken(createdAdmin._id);

    return res.status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(201, createdAdmin, "Admin registered successfully"));
});

export {
    adminRegister,

}
