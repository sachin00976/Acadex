import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Student } from "../models/studentSchema.js";
import { uploadOnCloudinary,deleteOnCloudinary } from "../utils/cloudinary.js";

const genrateAccessTokenAndRefreshToken = async (studentId) => {
    try {
        const student = await Student.findById(studentId);
        const accessToken = await student.generateAccessToken();
        const refreshToken = await student.generateRefreshToken();
        console.log("123");
        student.refreshToken = refreshToken;
        student.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "error occur while genrating tokens");
    }
};
const options = {
    httpOnly: true,
    secure: true
};

const studentRegister = asyncHandler(async (req, res) => {
    const studentProfilePath = req.file?.path;
    const studentProfileType = req.file?.mimetype;

    if (!studentProfilePath) {
        throw new ApiError(400, "Student profile is required!");
    }

    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(studentProfileType)) {
        throw new ApiError(400, "Invalid file type. Please provide a profile in PNG, JPG, or WebP format.");
    }

    console.log(req.body);

    let { enrollmentNo, firstName, middleName, lastName, email, phoneNumber, gender, branch, password, semester } = req.body;

    if (!password) {
        password = `${firstName}.${enrollmentNo}`;
    }

    if (!enrollmentNo || !firstName || !lastName || !email || !phoneNumber || !gender || !branch || !password || !semester) {
        throw new ApiError(400, "All fields are required!");
    }

    const user = await Student.findOne({
        $or: [{ email }, { enrollmentNo }]
    });

    if (user) {
        throw new ApiError(409, "Student with given email or enrollement already exists");
    }

    const uploadResponse = await uploadOnCloudinary(studentProfilePath);
    if (!uploadResponse) {
        throw new ApiError(500, "Error occurred while uploading the student profile");
    }

    const createResponse = await Student.create({
        enrollmentNo,
        firstName,
        middleName,
        lastName,
        email,
        phoneNumber,
        gender,
        branch,
        password,
        semester,
        profile: {
            public_id: uploadResponse.public_id,
            url: uploadResponse.secure_url,
        }
    });

    if (!createResponse) {
        throw new ApiError(500, "Failed to register student");
    }

    const createdStudent = await Student.findOne({ email }).select("-password -__v -createdAt -updatedAt");

    if (!createdStudent) {
        throw new ApiError(500, "Internal DB server error! Please try again");
    }

    const { refreshToken, accessToken } = await genrateAccessTokenAndRefreshToken(createdStudent._id);

    return res.status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(201, createdStudent, "Student registered successfully"));
});

const studentLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(404, "Please enter all fields to login");
    }

    const student = await Student.findOne({ email }).select("-createdAt -updatedAt -__v");

    if (!student) {
        throw new ApiError(404, "Invalid email. Please try again!");
    }

    const isPasswordValid = await student.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(404, "Invalid password. Please try again!");
    }

    const studentData = student.toObject();
    delete studentData.password;
    delete studentData.refreshToken;

    const { refreshToken, accessToken } = await genrateAccessTokenAndRefreshToken(student._id);

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {
            ...studentData,
            token: accessToken  // <-- add token here for frontend
        }, "Student logged in successfully"));
});


const studentLogout = asyncHandler(async (req, res) => {
    if (!req.student || !req.student.id) {
        throw new ApiError(401, "Unauthorized: No user data found in request");
    }

    const studentId = req.student._id;
    const student = await Student.findById(studentId);

    if (!student) {
        throw new ApiError(401, "User not found. Please log in again.");
    }

    student.refreshToken = null;
    await student.save({ validateBeforeSave: false });

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const deleteStudent = asyncHandler(async (req, res) => {
    const { studentId } = req.params;

    const student = await Student.findById(studentId);
    if (!student) {
        throw new ApiError(404, "No Student Found");
    }

    await student.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, "Student deleted successfully")
    );
});

const getDetail = asyncHandler(async (req, res) => {
    const { enrollmentNo } = req.body;

    if (!enrollmentNo) {
        throw new ApiError(400, "enrollmentNo is required.");
    }

    const student = await Student.findOne({ enrollmentNo }).select("-password -createdAt -updatedAt -__v");
    
    if (!student) {
        return res.status(200).json(new ApiResponse(200, [], "No student found with the given enrollmentNo."));
    }
    return res.status(200).json(new ApiResponse(200, student, "Student found successfully."));
});
const getDetails = asyncHandler(async (req, res) => {
    const { enrollmentNo } = req.body;

    if (!enrollmentNo) {
        throw new ApiError(400, "enrollmentNo is required.");
    }

    const student = await Student.findOne({ enrollmentNo }).select("-password -createdAt -updatedAt -__v");
    
    if (!student) {
        return res.status(200).json(new ApiResponse(200, [], "No student found with the given enrollmentNo."));
    }
    return res.status(200).json(new ApiResponse(200, student, "Student found successfully."));
});

const updateStudent = asyncHandler(async (req, res) => {
    
    const {
        enrollmentNo,
        firstName,
        middleName,
        lastName,
        email,
        phoneNumber,
        gender,
        semester,
        branch,
    } = req.body;

    if (
        !enrollmentNo ||
        !firstName ||
        !lastName ||
        !email ||
        !phoneNumber ||
        !gender ||
        !semester ||
        !branch
    ) {
        throw new ApiError(400, "All fields are required!");
    }
    const student = await Student.findOne({ enrollmentNo });
    if (!student) {
        throw new ApiError(404, "Invalid enrollementNo");
    }
    const newData = {
        enrollmentNo,
        firstName,
        middleName,
        lastName,
        email,
        phoneNumber,
        gender,
        semester,
        branch,
    };

    if (req.file) {
        const studentProfilePath = req.file?.path;
        const studentProfileType = req.file?.mimetype;

        const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
        if (!allowedFormats.includes(studentProfileType)) {
            throw new ApiError(
                400,
                "Invalid file type. Please provide a profile in PNG, JPG, or WebP format."
            );
        }

        const profilePublicId = student.profile?.public_id;
        if (profilePublicId) {
            await deleteOnCloudinary(profilePublicId);
        }

        const uploadResponse = await uploadOnCloudinary(studentProfilePath);

        newData.profile = {
            public_id: uploadResponse.public_id,
            url: uploadResponse.secure_url,
        };
    }

    const updatedStudent = await Student.findByIdAndUpdate(student._id, newData, {
        new: true,
        runValidators: true,
    });

    if (!updatedStudent) {
        throw new ApiError(500, "Error occurred while updating the student");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedStudent, "Student detail updated successfully")
        );
});

const getAllStudents = asyncHandler(async (req, res) => {
    const { branch, semester } = req.body;

    if (!branch || !semester) {
        throw new ApiError(400, "Branch and semester are required");
    }

    const students = await Student.find({ branch, semester }).select("enrollmentNo");

    if (!students || students.length === 0) {
        throw new ApiError(404, "No students found for the specified branch and semester");
    }

    return res.status(200).json(
        new ApiResponse(200, students, "Student enrollment numbers fetched successfully")
    );
});

const getStudentById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const student = await Student.findById(id).select("-password -__v -createdAt -updatedAt");
    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    return res.status(200).json(new ApiResponse(200, student, "Student fetched successfully"));
});

const updateStudentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Old password and new password are required");
    }

    const student = await Student.findById(req.student._id);
    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    const isMatch = await student.isPasswordCorrect(oldPassword);
    if (!isMatch) {
        throw new ApiError(401, "Old password is incorrect");
    }

    student.password = newPassword;
    await student.save();

    return res.status(200).json(new ApiResponse(200, {}, "Password updated successfully"));
});
const updateStudentProfileOnly = asyncHandler(async (req, res) => {
    const { enrollmentNo } = req.body;
    if (!enrollmentNo) {
        throw new ApiError(400, "Enrollment number is required");
    }

    const student = await Student.findOne({ enrollmentNo });
    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    const studentProfilePath = req.file?.path;
    const studentProfileType = req.file?.mimetype;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!studentProfilePath || !allowedFormats.includes(studentProfileType)) {
        throw new ApiError(400, "Valid profile image required");
    }

    const profilePublicId = student.profile?.public_id;
    if (profilePublicId) {
        await deleteOnCloudinary(profilePublicId);
    }

    const uploadResponse = await uploadOnCloudinary(studentProfilePath);
    if (!uploadResponse) {
        throw new ApiError(500, "Upload failed");
    }

    student.profile = {
        public_id: uploadResponse.public_id,
        url: uploadResponse.secure_url
    };
    await student.save();

    return res.status(200).json(new ApiResponse(200, student, "Profile updated successfully"));
});

const passwordValidator = asyncHandler(async (req, res) => {
    const { enrollmentNo, password } = req.body;

    if (!enrollmentNo || !password) {
        throw new ApiError(400, "Enrollment number or password is missing");
    }

    const student = await Student.findOne({ enrollmentNo });

    if (!student) {
        throw new ApiError(404, "No student found with given enrollment number");
    }

    const isPasswordValid = await student.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid current password");
    }

    return res.status(200).json(
        new ApiResponse(200, null, "Valid Password")
    );
});
export {
    studentRegister,
    studentLogin,
    studentLogout,
    deleteStudent,
    getDetail,
    getDetails,
    updateStudent,
    getAllStudents,
    getStudentById,
    updateStudentPassword,
    updateStudentProfileOnly,
    passwordValidator
};
