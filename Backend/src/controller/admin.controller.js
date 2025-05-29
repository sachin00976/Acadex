import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Admin } from "../models/adminSchema.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { response } from "express";
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
const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(404, "Please enter all fields to login");
    }

    const admin = await Admin.findOne({ email }).select("-createdAt -updatedAt -__v");

    if (!admin) {
        throw new ApiError(404, "Invalid email. Please try again!");
    }

    const isPasswordValid = await admin.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(404, "Invalid password. Please try again!");
    }

    const adminData = admin.toObject();
    delete adminData.password;
    delete adminData.refreshToken;

    const { refreshToken, accessToken } = await genrateAccessTokenAndRefreshToken(admin._id);

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                ...adminData,
                token: accessToken // Include access token here
            }, "Admin logged in successfully")
        );
});

const adminLogout = asyncHandler(async (req, res) => {
    
    if (!req.admin || !req.admin.id) {
        throw new ApiError(401, "Unauthorized: No user data found in request");
    }

    const adminId = req.admin.id;
    const admin = await Admin.findById(adminId);

    if (!admin) {
        throw new ApiError(401, "User not found. Please log in again.");
    }

    admin.refreshToken = null;
    await admin.save({ validateBeforeSave: false });

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});
const deleteAdmin=asyncHandler(async(req,res)=>{
    const {adminId}=req.params;
    const admin=await Admin.findById(adminId);
    if(!admin)
    {
        throw new ApiError(404,"No Admin Found");
    }
    await admin.deleteOne();

    return res.status(200).json(
        new ApiResponse(200,"Admin deleted successfully")
    )
    
})
const getDetail = asyncHandler(async (req, res) => {
    
    const { employeeId } = req.body;

    if (!employeeId) {
        throw new ApiError(400, "Employee ID is required.");
    }

    const employee = await Admin.findOne({ employeeId }).select("-password -createdAt -updatedAt -__v");

    if (!employee) {
        return res.status(200).json(new ApiResponse(200, [], "No employee found with the given ID."));
    }

    return res.status(200).json(new ApiResponse(200, employee, "Employee found successfully."));
});
const updateDetail = asyncHandler(async (req, res) => {
    const { employeeId, firstName, middleName, lastName, email, phoneNumber, gender } = req.body;
    

    if (!employeeId || !firstName || !lastName || !email || !phoneNumber || !gender ) {
        throw new ApiError(400, "All fields are required!");
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
        throw new ApiError(404, "Invalid Request");
    }

    const newData = {
        employeeId,
        firstName,
        middleName,
        lastName,
        email,
        phoneNumber,
        gender,
    };

    if (req.file) {
        const { path: adminProfilePath, mimetype: adminProfileType } = req.file;
        const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

        if (!allowedFormats.includes(adminProfileType)) {
            throw new ApiError(400, "Invalid file type. Please provide a profile in PNG, JPG, or WebP format");
        }

        
            const profilePublicId = admin.profile?.public_id;
            if (profilePublicId) {
                await deleteOnCloudinary(profilePublicId);
            }

            const uploadResponse = await uploadOnCloudinary(adminProfilePath);
            if (!uploadResponse) {
                throw new ApiError(500, "Failed to upload image to Cloudinary");
            }

            newData.profile = {
                public_id: uploadResponse.public_id,
                url: uploadResponse.secure_url
            };
        
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(admin._id, newData, {
        new: true,
        runValidators: true
    });

    if (!updatedAdmin) {
        throw new ApiError(500, "Error occurred while updating the profile of admin");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedAdmin, "Admin detail updated successfully")
    );
});
const passwordValidator = asyncHandler(async (req, res) => {
    const { employeeId, password } = req.body;
    
    if (!employeeId || !password) {
        throw new ApiError(400, "Employee ID or password is missing");
    }

    const admin = await Admin.findOne({ employeeId });

    if (!admin) {
        throw new ApiError(404, "No admin found with given employeeId");
    }

    const isPasswordValid = await admin.isPasswordCorrect(password);
    

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid current password");
    }

    return res.status(200).json(
        new ApiResponse(200, [], "Valid Password")
    );
});

const passwordChangeHandler = asyncHandler(async (req, res) => {
    const { newPassword, employeeId } = req.body;

    if (!newPassword || !employeeId) {
        throw new ApiError(400, "Both newPassword and employeeId are required");
    }

    const admin = await Admin.findOne({ employeeId });
    if (!admin) {
        throw new ApiError(404, "No admin found with given employeeId");
    }

    admin.password = newPassword; 
    admin.markModified("password");
    await admin.save();
    

    return res
        .status(200)
        .json(new ApiResponse(200, [], "Password updated successfully"));
});




export {

    adminRegister,
    adminLogin,
    adminLogout,
    deleteAdmin,
    getDetail,
    updateDetail,
    passwordValidator,
    passwordChangeHandler
}
