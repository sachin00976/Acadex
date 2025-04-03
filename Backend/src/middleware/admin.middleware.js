import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { Admin } from "../models/adminSchema.js";
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

    const admin = await Admin.findById(decodedToken.id);
    if (!admin) {
      throw new ApiError(401, "Invalid Token - Admin not found");
    }

    req.admin = admin;
    next();
  } catch (error) {
    next(new ApiError(401, error.message || "Unauthorized access"));
  }
});

export { verifyJWT };
