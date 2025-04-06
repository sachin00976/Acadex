import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
  faculty: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  }
}, { timestamps: true });
export const Material=mongoose.model("Material",materialSchema);