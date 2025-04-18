import mongoose from "mongoose";

const timeTableSchema = new mongoose.Schema({
  link: {
   public_id:{
    type:String,
    required:true
   },
   url:{
    type:String,
    required:true
   }
  },
  branch: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  }
}, { timestamps: true });


export const TimeTable=mongoose.model("Timetable",timeTableSchema);