import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import Heading from "../../components/Heading";
import axios from "axios";
import toast from "react-hot-toast";

const Student = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState({
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

  const [id, setId] = useState("");

  const searchStudentHandler = (e) => {
    e.preventDefault();
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

    toast.loading("Getting Student...");
    const headers = {
      "Content-Type": "application/json",
    };

    axios
      .post(`/api/v1/student/getdetail`, { enrollmentNo: search }, { headers })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          if (response.data.data.length === 0) {
            toast.error("No Student Found");
          } else {
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
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response?.data?.message || "Something went wrong");
        console.error(error);
      });
  };

  return (
    <div className="min-h-screen  to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Heading title="Student Details" />

        {/* Search Bar */}
        <form
          className="mt-10 flex items-center gap-3 w-full max-w-lg mx-auto bg-white shadow-md rounded-full px-5 py-3 border border-blue-300"
          onSubmit={searchStudentHandler}
        >
          <input
            type="text"
            className="flex-grow bg-transparent outline-none text-lg"
            placeholder="Enter Enrollment No."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="submit"
            className="text-2xl text-blue-600 hover:text-blue-800 transition"
          >
            <FiSearch />
          </button>
        </form>

        {/* Student Card */}
        {id && (
          <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                {data.firstName} {data.middleName} {data.lastName}
              </h2>
              <ul className="space-y-2 text-gray-700 text-lg">
                <li>
                  <span className="font-medium">Enrollment No:</span> {data.enrollmentNo}
                </li>
                <li>
                  <span className="font-medium">Phone:</span> +91 {data.phoneNumber}
                </li>
                <li>
                  <span className="font-medium">Email:</span> {data.email}
                </li>
                <li>
                  <span className="font-medium">Branch:</span> {data.branch}
                </li>
                <li>
                  <span className="font-medium">Semester:</span> {data.semester}
                </li>
              </ul>
            </div>
            <div>
              <img
                src={
                  data.profile ||
                  "https://via.placeholder.com/200?text=No+Image"
                }
                alt="Student Profile"
                className="w-48 h-48 rounded-xl object-cover border-2 border-blue-200 shadow-sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Student;
