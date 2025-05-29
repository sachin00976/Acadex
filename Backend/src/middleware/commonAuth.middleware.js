import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { Faculty } from "../models/facultySchema.js";
import { Admin } from "../models/adminSchema.js";
import { Student } from "../models/studentSchema.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(400, "Token not found!");
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      throw new ApiError(401, "Invalid or expired token");
    }

    if (!decodedToken?.id) {
      throw new ApiError(401, "Invalid token payload");
    }
    console.log(decodedToken)
    let user
    if(decodedToken.role==="admin")
    {
        user=await Admin.findById(decodedToken.id)
    }
    else if(decodedToken.role==="faculty")
    {
        user=await Faculty.findById(decodedToken.id)
    }
    else
    {
        user=await Student.findById(decodedToken.id)
    }
    
    if(!user)
    {
        throw new ApiError(400,"Invalid token!")
    }
    req.user = user;
    
    next();
  } catch (error) {
    next(new ApiError(401, error.message || "Unauthorized access"));
  }
});


export { verifyJWT };