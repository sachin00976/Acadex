import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const studentSchema = new mongoose.Schema(
  {
    password: {
        type: String,
        required: true,
        minLength: [8, "Password must contain at least 8 characters"],
        maxLength: [50, "Password cannot exceed 50 characters"],
    },
    enrollmentNo: {
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
    semester: {
      type: Number,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"], 
    },
    role:{
    type:String,
    required:true,
    default:"student"
   },
    profile: {
        public_id: { type: String, 
            required:true,
        },
        url: { type: String, 
            required:true,
        },
      },
      refreshToken: {
        type: String,
    },
  },
  { timestamps: true }
);

studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    console.log(this.password);
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

studentSchema.methods.isPasswordCorrect = async function (inputPassword) {
  
  if (!inputPassword || !this.password) return false;

  return await bcrypt.compare(inputPassword, this.password);
};

studentSchema.methods.generateAccessToken = async function () {
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

studentSchema.methods.generateRefreshToken = async function () {
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

export const Student = mongoose.model("Student", studentSchema);
