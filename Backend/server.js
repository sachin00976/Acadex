import dotenv from 'dotenv'
import app from "./app.js";
import {v2 as cloudinary} from 'cloudinary'
import { dbConnect } from './src/database/index.js';
import { Server } from 'socket.io';
dotenv.config({
    path:'./.env'
})

const server=app.listen(`${process.env.PORT}` || "8000",()=>{
    console.log("app is listening")
})

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
const io=new Server(server,{
    pingTimeout:60000,
    cors:{
        origin: "http://localhost:5173",
        credentials:true
    }
})

io.on("connection",(socket)=>{
    //console.log("Connected to socket io");

    socket.on("setup",(userData)=>{
        
        socket.join(userData._id)
        // console.log(userData._id)
        socket.emit("connected")
    });

    socket.on("join chat",(room)=>{
        socket.join(room)
        console.log("User joined room:"+room);
        
    })
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    socket.on("newMessage",(newMessage)=>{
        var chat=newMessage.chat;
        if(!chat.users) return console.log("chat.user not defined")

        chat.users.forEach(({user}) => {
            if(user._id===newMessage.sender._id) return;
            socket.in(user._id).emit("message recieved",newMessage)
            
        });
    })
    
})


  dbConnect();