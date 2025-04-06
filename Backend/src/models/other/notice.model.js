import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
  link: {
    type: String,
  }
}, { timestamps: true });

export const Notice=mongoose.model("Notice",noticeSchema)