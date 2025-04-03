import dotenv from 'dotenv'
import app from "./app.js";
import {v2 as cloudinary} from 'cloudinary'
dotenv.config({
    path:'./.env'
})
app.listen(`${process.env.PORT}` || "8000",()=>{
    console.log("app is listening")
})
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });