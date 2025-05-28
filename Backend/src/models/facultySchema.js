import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const facultySchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
         type: String,
         unique: true,
         required: [true, "Email is needed"],
         validate: {
             validator: (value) => validator.isEmail(value),
             message: "Please provide a valid email",
         },
     },
  phoneNumber: {
    type: String, 
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },
  experience: {
    type: Number,
    required: true,
  },
  post: {
    type: String,
    required: true,
  },
  profile: {
    public_id: { type: String, 
        required:true,
    },
    url: { type: String, 
        required:true,
    },
  },
  role:{
    type:String,
    required:true,
    default:"faculty"
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must contain at least 8 characters"],
    maxlength: [50, "Password cannot exceed 50 characters"],
  },
  refreshToken: {
    type: String,
},
}, { timestamps: true });

facultySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

facultySchema.methods.isPasswordCorrect = async function (inputPassword) {
  if (!inputPassword || !this.password) return false;
  return await bcrypt.compare(inputPassword, this.password);
};

facultySchema.methods.generateAccessToken = async function () {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("Missing ACCESS_TOKEN_SECRET in environment variables");
  }
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role:this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

facultySchema.methods.generateRefreshToken = async function () {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("Missing REFRESH_TOKEN_SECRET in environment variables");
  }
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const Faculty = mongoose.model("Faculty", facultySchema);
