import mongoose from "mongoose";

const marksSchema = new mongoose.Schema({
  enrollmentNo: {
    type: Number,
    required: true,
  },
  internal: {
    type: {},
  },
  external: {
    type: {},
  }
}, { timestamps: true });

export const Marks=mongoose.model("Marks",marksSchema);