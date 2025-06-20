import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar';
import Branch from './Branch';
import Profile from './Profile';
import Admin from './Admin';
import Subject from './Subject';
import Faculty from './Faculty';
import Notice from '../../components/Notice';
import { Toaster } from 'react-hot-toast';
import Student from './Student'
import axios from 'axios';
import toast from 'react-hot-toast';
import {ChatBox}  from "../../chat/component/ChatBox.jsx"

const Home = () => {
    const router = useLocation();
    const navigate = useNavigate();
    const [load,setLoad] = useState(true);
    const [selectedMenu,setSelectedMenu] = useState("Profile");
    const [dashboardData, setDashboardData] = useState({
        studentCount:"",
        facultyCount:"",
    });

    // useEffect(()=>{
    //     if(router.state===null){
    //         navigate("/");
    //     }
    //     setLoad(true);
    // },[navigate,router.state]);

    // useEffect(() => {
    //     getStudentCount();
    //     getFacultyCount();
    // }, []);

    const getStudentCount = ()=>{
        const headers = {
            "Content-Type": "application/json",
        };
        axios.get(``,{
            headers:headers,
        })
        .then((response)=>{
            if(response.data.success){
                setDashboardData({...dashboardData,studentCount:response.data.user});
            }else{
                toast.error(response.data.message);
            }
        })
        .catch((error)=>{
            console.error(error);
        });
    };

    const getFacultyCount=()=>{
        const headers = {
            "Content-Type": "application/json",
        };
        axios.get(``,{
            headers:headers,
        })
        .then((response)=>{
            if(response.data.success){
                setDashboardData({...dashboardData,facultyCount: response.data.user});
            }else{
                toast.error(response.data.message);
            }
        })
        .catch((error)=>{
            console.error(error);
        });
    };

    

  return (
    <>
        {load && (
            <>
                <Navbar/>
                <div className=' mx-auto'>
                    <ul className=" max-w-6xl flex justify-evenly items-center gap-10 w-full mx-auto my-8">
                        <li className={`text-center rounded-sm px-4 py-2 w-1/5 cursor-pointer ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
                  selectedMenu === "Profile"
                    ? "border-b-2 pb-2 border-blue-500 bg-blue-100 rounded-sm"
                    : "bg-blue-500 text-white hover:bg-blue-600 border-b-2 border-blue-500"
                }`}
                onClick={()=>setSelectedMenu("Profile")}
                >
                    Profile
                </li>
                        <li  className={`text-center rounded-sm px-4 py-2 w-1/5 cursor-pointer ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
                  selectedMenu === "Student"
                    ? "border-b-2 pb-2 border-blue-500 bg-blue-100 rounded-sm"
                    : "bg-blue-500 text-white hover:bg-blue-600 border-b-2 border-blue-500"
                }`}
                onClick={() => setSelectedMenu("Student")}> Student</li>
                        <li  className={`text-center rounded-sm px-4 py-2 w-1/5 cursor-pointer ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
                  selectedMenu === "Faculty"
                    ? "border-b-2 pb-2 border-blue-500 bg-blue-100 rounded-sm"
                    : "bg-blue-500 text-white hover:bg-blue-600 border-b-2 border-blue-500"
                }`}
                onClick={() => setSelectedMenu("Faculty")}>Faculty</li>
                        <li className={`text-center rounded-sm px-4 py-2 w-1/5 cursor-pointer ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
                  selectedMenu === "Branch"
                    ? "border-b-2 pb-2 border-blue-500 bg-blue-100 rounded-sm"
                    : "bg-blue-500 text-white hover:bg-blue-600 border-b-2 border-blue-500"
                }`}
                onClick={() => setSelectedMenu("Branch")}> Branch </li>
                        <li className={`text-center rounded-sm px-4 py-2 w-1/5 cursor-pointer ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
                  selectedMenu === "Notice"
                    ? "border-b-2 pb-2 border-blue-500 bg-blue-100 rounded-sm"
                    : "bg-blue-500 text-white hover:bg-blue-600 border-b-2 border-blue-500"
                }`}
                onClick={() => setSelectedMenu("Notice")}>Notice</li>
                        <li className={`text-center rounded-sm px-4 py-2 w-1/5 cursor-pointer ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
                  selectedMenu === "Subjects"
                    ? "border-b-2 pb-2 border-blue-500 bg-blue-100 rounded-sm"
                    : "bg-blue-500 text-white hover:bg-blue-600 border-b-2 border-blue-500"
                }`}
                onClick={() => setSelectedMenu("Subjects")}>Subjects</li>
                        <li className={`text-center rounded-sm px-4 py-2 w-1/5 cursor-pointer ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
                  selectedMenu === "Admin"
                    ? "border-b-2 pb-2 border-blue-500 bg-blue-100 rounded-sm"
                    : "bg-blue-500 text-white hover:bg-blue-600 border-b-2 border-blue-500"
                }`}
                onClick={() => setSelectedMenu("Admin")}>Admins</li>
                
                <li  className={`text-center rounded-sm px-4 py-2 w-1/5 cursor-pointer ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
                  selectedMenu === "ChatBox"
                    ? "border-b-2 pb-2 border-blue-500 bg-blue-100 rounded-sm"
                    : "bg-blue-500 text-white hover:bg-blue-600 border-b-2 border-blue-500"
                }`}
                onClick={() => setSelectedMenu("ChatBox")}>Chat</li>
                    </ul>

                    <>
                        {selectedMenu==="Branch" && <Branch/>}
                        {selectedMenu==="Notice" && <Notice/>}
                        {selectedMenu==="Student" && <Student/>}
                        {selectedMenu==="Faculty" && <Faculty/>}
                        {selectedMenu==="Subjects" && <Subject/>}
                        {selectedMenu==="Admin" && <Admin/>}
                        {selectedMenu==="Profile" && <Profile/>}
                        {selectedMenu==="ChatBox" && <ChatBox/>}
                    </>
                </div>
            </>
        )}
        <Toaster position="bottom-center" />
    </>
  )
}

export default Home
