import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Faculty } from "../models/facultySchema.js";
import { uploadOnCloudinary,deleteOnCloudinary } from "../utils/cloudinary.js";

const generateAccessTokenAndRefreshToken = async (facultyId) => {
    try {
        const faculty = await Faculty.findById(facultyId);
        if (!faculty) {
            throw new ApiError(404, "Faculty not found");
        }

        const accessToken = await faculty.generateAccessToken();
        const refreshToken = await faculty.generateRefreshToken();

        faculty.refreshToken = refreshToken;
        await faculty.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Error occurred while generating tokens");
    }
};

const options = {
    httpOnly: true,
    secure: true
};

const facultyRegister = asyncHandler(async (req, res) => {
    const facultyProfilePath = req.file?.path;
    const facultyProfileType = req.file?.mimetype;

    if (!facultyProfilePath) {
        throw new ApiError(400, "Faculty profile is required!");
    }

    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(facultyProfileType)) {
        throw new ApiError(400, "Invalid file type. Please provide a profile in PNG, JPG, or WebP format.");
    }

    let { employeeId, firstName, middleName, lastName, email, phoneNumber, gender, password,department,experience,post } = req.body;
    if(!password)
    {
        password=`${firstName}.${employeeId}`;
        console.log(password)
    }
    if (!employeeId || !firstName || !lastName || !email || !phoneNumber || !gender || !password || !department || !experience || !post) {
        throw new ApiError(400, "All fields are required!");
    }

    const existingFaculty = await Faculty.findOne({
        $or: [{ email }, { employeeId }]
    });

    if (existingFaculty) {
        throw new ApiError(409, "Faculty with given email or employeeId already exists");
    }

    const uploadResponse = await uploadOnCloudinary(facultyProfilePath);
    if (!uploadResponse) {
        throw new ApiError(500, "Error occurred while uploading the faculty profile");
    }

    const createResponse = await Faculty.create({
        employeeId,
        firstName,
        middleName,
        lastName,
        email,
        phoneNumber,
        gender,
        password,
        post,
        experience,
        department,
        profile: {
            public_id: uploadResponse.public_id,
            url: uploadResponse.secure_url,
        }
    });

    if (!createResponse) {
        throw new ApiError(500, "Failed to register faculty");
    }

    const createdFaculty = await Faculty.findOne({ email }).select("-password -__v -createdAt -updatedAt");

    if (!createdFaculty) {
        throw new ApiError(500, "Internal DB server error! Please try again");
    }

    const { refreshToken, accessToken } = await generateAccessTokenAndRefreshToken(createdFaculty._id);

    return res.status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(201, createdFaculty, "Faculty registered successfully"));
});
const facultyLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(404, "Please enter all fields to login");
    }

    const faculty = await Faculty.findOne({ email }).select("-createdAt -updatedAt -__v");

    if (!faculty) {
        throw new ApiError(404, "Invalid email. Please try again!");
    }

    const isPasswordValid = await faculty.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(404, "Invalid password. Please try again!");
    }

    const facultyData = faculty.toObject();
    delete facultyData.password;
    delete facultyData.refreshToken;

    const { refreshToken, accessToken } = await generateAccessTokenAndRefreshToken(faculty._id);

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, 
            {
                ...facultyData,
                token: accessToken  // added token here
            }, 
            "Faculty logged in successfully"
        ));
});

const facultyLogout = asyncHandler(async (req, res) => {
    
    if (!req.faculty || !req.faculty.id) {
        throw new ApiError(401, "Unauthorized: No user data found in request");
    }

    const facultyId = req.faculty.id;
    const faculty = await Faculty.findById(facultyId);

    if (!faculty) {
        throw new ApiError(401, "User not found. Please log in again.");
    }

    faculty.refreshToken = null;
    await faculty.save({ validateBeforeSave: false });

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});
const deleteFaculty = asyncHandler(async (req, res) => {
    const { facultyId } = req.params;

    const faculty = await Faculty.findById(facultyId);
    if (!faculty) {
        throw new ApiError(404, "No Faculty Found");
    }

    await faculty.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, "Faculty deleted successfully")
    );
});
const getDetail = asyncHandler(async (req, res) => {
    
    const { employeeId } = req.body;

    if (!employeeId) {
        throw new ApiError(400, "Employee ID is required.");
    }

    const employee = await Faculty.findOne({ employeeId }).select("-password -createdAt -updatedAt -__v");

    if (!employee) {
        return res.status(200).json(new ApiResponse(200, [], "No employee found with the given ID."));
    }

    return res.status(200).json(new ApiResponse(200, employee, "Employee found successfully."));
});

const updateFaculty = asyncHandler(async (req, res) => {
    const {
      employeeId,
      firstName,
      middleName,
      lastName,
      email,
      phoneNumber,
      gender,
      department,
      experience,
      post,
    } = req.body;
  
    if (
      !employeeId ||
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !gender ||
      !department ||
      !experience ||
      !post
    ) {
      throw new ApiError(400, "All fields are required!");
    }
  
    const faculty = await Faculty.findOne({ employeeId });
    if (!faculty) {
      throw new ApiError(404, "Invalid employeeId");
    }
  
    const newData = {
      employeeId,
      firstName,
      middleName,
      lastName,
      email,
      phoneNumber,
      gender,
      department,
      experience,
      post,
    };
  
    if (req.file) {
      const facultyProfilePath = req.file?.path;
      const facultyProfileType = req.file?.mimetype;
  
      const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
      if (!allowedFormats.includes(facultyProfileType)) {
        throw new ApiError(
          400,
          "Invalid file type. Please provide a profile in PNG, JPG, or WebP format."
        );
      }
  
      const profilePublicId = faculty.profile?.public_id;
      if (profilePublicId) {
        await deleteOnCloudinary(profilePublicId);
      }
  
      const uploadResponse = await uploadOnCloudinary(facultyProfilePath);
  
      newData.profile = {
        public_id: uploadResponse.public_id,
        url: uploadResponse.secure_url,
      };
    }
  
    const updatedFaculty = await Faculty.findByIdAndUpdate(faculty._id, newData, {
      new: true,
      runValidators: true,
    });
  
    if (!updatedFaculty) {
      throw new ApiError(500, "Error occurred while updating the faculty");
    }
  
    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedFaculty, "Faculty detail updated successfully")
      );
  });
  const passwordValidator = asyncHandler(async (req, res) => {
    const { employeeId, password } = req.body;
    
    if (!employeeId || !password) {
        throw new ApiError(400, "Employee ID or password is missing");
    }

    const faculty = await Faculty.findOne({ employeeId });

    if (!faculty) {
        throw new ApiError(404, "No faculty found with given employee ID");
    }

    const isPasswordValid = await faculty.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid current password");
    }

    return res.status(200).json(
        new ApiResponse(200, null, "Valid Password")
    );
});

const passwordChangeHandler = asyncHandler(async (req, res) => {
    const { newPassword, employeeId } = req.body;
    console.log(req.body)
    if (!newPassword || !employeeId) {
        throw new ApiError(400, "Both newPassword and employeeId are required");
    }

    const faculty = await Faculty.findOne({ employeeId });
    if (!faculty) {
        throw new ApiError(404, "No faculty found with given employeeId");
    }

    faculty.password = newPassword; 
    faculty.markModified("password");
    await faculty.save();

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Password updated successfully"));
});

export {
    facultyRegister,
    facultyLogin,
    facultyLogout,
    deleteFaculty,
    getDetail,
    updateFaculty,
    passwordChangeHandler,
    passwordValidator
    
}


