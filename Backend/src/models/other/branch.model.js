import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }
}, { timestamps: true });


export const Branch = mongoose.model("Branch", branchSchema);