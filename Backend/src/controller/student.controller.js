import { asyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Student } from "../models/studentSchema";
import { uploadOnCloudinary } from "../utils/cloudinary";

const genrateAccessTokenAndRefreshToken=async(studentId)=>{
    try {
        const student=await Student.findById(studentId)
        const accessToken= await admin.generateAccessToken();
        const refreshToken=await admin.generateRefreshToken();

        student.refreshToken=refreshToken
        student.save({validateBeforeSave:false})

        return {accessToken,refreshToken}


    } catch (error) {
        throw new ApiError(500,"error occur while genrating tokens")
    }
}
const options = {
    httpOnly: true, 
    secure: true
  }


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
  
      const {enrollmentNo, firstName, middleName, lastName, email, phoneNumber, gender, password,semester } = req.body;

     
      if(!password)
        {
            password=`${firstName}.${enrollmentNo}`;
        }
        if (!enrollmentNo || !firstName || !lastName || !email || !phoneNumber || !gender || !password || !semester) {
            throw new ApiError(400, "All fields are required!");
        }
      
  
      const user = await Student.findOne({
          $or: [{ email }, { employeeId }]
      });
  
      if (user) {
        throw new ApiError(409, "Student with given email or employeeId already exists");
      }
  
      const uploadResponse = await uploadOnCloudinary(studentProfilePath);
      if (!uploadResponse) {
          throw new ApiError(500, "Error occurred while uploading the student profile");
      }
  
      const createResponse = await Admin.create({
          enrollmentNo,
          firstName,
          middleName,
          lastName,
          email,
          phoneNumber,
          gender,
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
  
      const { refreshToken, accessToken } = await generateAccessTokenAndRefreshToken(student._id);
  
      return res.status(200)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", refreshToken, options)
          .json(new ApiResponse(200, studentData, "Student logged in successfully"));
  });

  