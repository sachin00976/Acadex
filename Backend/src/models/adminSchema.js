import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const adminSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
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
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
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
    default:"Admin"
  },
    password: {
        type: String,
        required: true,
        minLength: [8, "Password must contain at least 8 characters"],
        maxLength: [50, "Password cannot exceed 50 characters"],
    },
    refreshToken: {
      type: String,
  },
  },
  { timestamps: true }
);


adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});


adminSchema.methods.isPasswordCorrect = async function (inputPassword) {
  if (!inputPassword || !this.password) return false;
  return await bcrypt.compare(inputPassword, this.password);
};


adminSchema.methods.generateAccessToken = async function () {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("Missing ACCESS_TOKEN_SECRET in environment variables");
  }
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role:this.role
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};


adminSchema.methods.generateRefreshToken = async function () {
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



export const Admin = mongoose.model("Admin", adminSchema);
