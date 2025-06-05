import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { TbLogin2 } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedIn } from "../features/authSlice.js"; 

import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const Login = () => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState("Student");
    const { register, handleSubmit } = useForm();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const role = useSelector((state) => state.auth.role);
    console.log("userfac,,,,",user);
    console.log("role,,",role);
    
    const onSubmit = (data) => {
        if (data.email !== "" && data.password !== "") {
          axios
            .post(`/api/v1/${selected.toLowerCase()}/login`, data, {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            })
            .then((response) => {
              const { data: userData, token, loginid } = response.data;
      
              if (!userData.token) {
                toast.error("Token not provided by server");
                return;
              }
      
              // Get uniqueId directly from userData
              const role = selected.toLowerCase();
              const uniqueId =
                role === "student"
                  ? userData.enrollmentNo
                  : role === "faculty" || role === "admin"
                  ? userData.employeeId
                  : null;
      
              // Store user info and token in Redux and localStorage
              dispatch(userLoggedIn({ user: userData, role, token: userData.token }));
              localStorage.setItem("user", JSON.stringify(userData));
              localStorage.setItem("token", token);
              localStorage.setItem("role", role);
      
              // Navigate using fresh uniqueId
              navigate(`/${role}/profile/${uniqueId}`, {
                state: { type: selected, loginid },
              });
            })
            .catch((error) => {
              toast.dismiss();
              console.error(error);
              toast.error(error.response?.data?.message || "Login failed");
            });
        } else {
          toast.error("Please fill all fields");
        }
      };
      
    
    return (
        <div className="bg-white h-[100vh] w-full flex justify-between items-center">
            <img 
              src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="" 
              className='w-[60%] h-[100vh] object-cover' 
            />

            <div className='w-[40%] flex justify-center items-start flex-col pl-8'>
                <p className="text-3xl font-semibold pb-2 border-b-2 border-green-500">
                    {selected} Login
                </p>
                <form onSubmit={handleSubmit(onSubmit)} className='flex justify-center items-start flex-col w-full mt-10'>
                    <div className='flex flex-col w-[70%]'>
                        <label htmlFor="email" className='mb-1'>
                            {selected} Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            required
                            className='bg-white outline-none border-2 border-gray-400 py-2 px-4 rounded-md w-full focus:border-blue-500'
                            {...register("email")}
                        />
                    </div>

                    <div className="flex flex-col w-[70%] mt-3">
                        <label className="mb-1" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            required
                            className="bg-white outline-none border-2 border-gray-400 py-2 px-4 rounded-md w-full focus:border-blue-500"
                            {...register("password")}
                        />
                    </div>

                    <button
                        className="bg-blue-500 mt-5 text-white px-6 py-2 text-xl rounded-md hover:bg-blue-700 ease-linear duration-300 flex justify-center items-center"
                        type="submit"
                    >
                        Login
                        <span>
                            <TbLogin2 />
                        </span>
                    </button>
                </form>
            </div>

            <div className='absolute top-4 right-4'>
                {["Student", "Faculty", "Admin"].map((role) => (
                    <button
                        key={role}
                        className={`text-blue-500 mr-6 text-base font-semibold hover:text-blue-700 transition-all duration-300 ${
                            selected === role ? "border-b-2 border-green-500" : ""
                        }`}
                        onClick={() => setSelected(role)}
                    >
                        {role}
                    </button>
                ))}
            </div>
            <Toaster position="bottom-center" />
        </div>
    );
};

export default Login;
