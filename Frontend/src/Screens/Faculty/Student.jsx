import React, { useState } from 'react'
import { FiSearch } from "react-icons/fi";
import Heading from "../../components/Heading"
import axios from "axios";
import toast from "react-hot-toast";

const Student = () => {
  const [search,setSearch] = useState();
  const [data,setData] = useState({
    enrollmentNo: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    semester: "",
    branch: "",
    gender: "",
    profile: "",
  });

  const [id,setId] = useState();

  const searchStudentHandler = (e)=>{
    setId("");
    setData({
      enrollmentNo: "",
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      semester: "",
      branch: "",
      gender: "",
      profile: "",
    });
    e.preventDefault();
    toast.loading("Getting Student");
    const headers = {
      "Content-Type": "application/json",
    };
    axios.post(`/api/v1/student/getdetail`,{enrollmentNo:search},{headers})
    .then((response)=>{
      console.log(response);
      toast.dismiss();
      if(response.data.success){
        if(response.data.data.length===0){
          toast.dismiss();
          toast.error("No Student Found");
        }else{
          
          toast.success(response.data.message);
          
          setData({
            enrollmentNo: response.data.data.enrollmentNo,
            firstName: response.data.data.firstName,
            middleName: response.data.data.middleName,
            lastName: response.data.data.lastName,
            email: response.data.data.email,
            phoneNumber: response.data.data.phoneNumber,
            semester: response.data.data.semester,
            branch: response.data.data.branch,
            gender: response.data.data.gender,
            profile: response.data.data.profile.url,
          });
          
          setId(response.data.data._id);
        }
      }else{
        toast.dismiss();
        toast.error(response.data.message);
      }
    })
    .catch((error)=>{
        toast.dismiss();
        toast.error(error.response.data.message);
        console.error(error);
    });
  }
  return (
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10">
        <div className="flex justify-between items-center w-full">
          <Heading title="Student Details"/>
        </div>
        <div className="my-6 mx-auto w-full">
            <form className="flex justify-center items-center border-2 border-blue-500 rounded w-[40%] mx-auto"
            onSubmit={searchStudentHandler}
            >
              <input type="text" className="px-6 py-3 w-full outline-none" placeholder='Enrollement No.' value={search} onChange={(e)=>setSearch(e.target.value)} />
              <button className="px-4 text-2xl hover:text-blue-500" type="submit">
                <FiSearch />
              </button>
            </form>

            {id && (
              <div className="mx-auto w-full bg-blue-50 mt-10 flex justify-between items-center p-10 rounded-md shadow-md">
                <div>
                  <p className="text-2xl font-semibold">
                      {data.firstName} {data.middleName} {data.lastName}
                  </p>
                  <div className="mt-3">
                    <p className="text-lg font-normal mb-2">
                      Enrollment No: {data.enrollmentNo}
                  </p>
                  <p className="text-lg font-normal mb-2">
                  Phone Number: +91 {data.phoneNumber}
                </p>
                <p className="text-lg font-normal mb-2">
                  Email Address: {data.email}
                </p>
                <p className="text-lg font-normal mb-2">
                  Branch: {data.branch}
                </p>
                <p className="text-lg font-normal mb-2">
                  Semester: {data.semester}
                </p>
                  </div>
                </div>

                <img src={data.profile} alt="student profile" className="h-[200px] w-[200px] object-cover rounded-lg shadow-md" />
              </div>
            )}
        </div>
    </div>
  )
}

export default Student
