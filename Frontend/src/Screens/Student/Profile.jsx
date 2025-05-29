import axios from "axios";
<<<<<<< HEAD
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const Profile = () => {
  const data = useSelector((state) => state.auth.user);
//   console.log(data.enrollmentNo);
  const router = useLocation();
  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState({
    current: "",
    new: "",
  });

  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (!password.current || !password.new) {
      toast.error("Please fill both current and new passwords");
      return;
    }

    // Verify current password
    axios
      .post(
        `/api/v1/student/passwordAuth`,
        { enrollmentNo: data.enrollmentNo, password: password.current },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        if (response.data.success) {
          // Update password if verified
          axios
            .patch(
              `/api/v1/student/update-password`,
              { oldPassword: password.current, newPassword: password.new },
              { headers: { "Content-Type": "application/json" } }
            )
            .then((res) => {
              if (res.data.success) {
                toast.success(res.data.message);
                setPassword({ current: "", new: "" });
                setShowPass(false);
              } else {
                toast.error(res.data.message);
              }
            })
            .catch((err) => {
              toast.error(
                err.response?.data?.message || "Password update failed"
              );
              console.error(err);
            });
=======
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
// import { setUserData } from "../../redux/actions";
// import { baseApiURL } from "../../baseUrl";
import toast from "react-hot-toast";
const Profile = () => {
  const [showPass, setShowPass] = useState(false);
  const router = useLocation();
  const [data, setData] = useState();
  const dispatch = useDispatch();
  const [password, setPassword] = useState({
    new: "",
    current: "",
  });
  useEffect(() => {
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .post(
        `${baseApiURL()}/${router.state.type}/details/getDetails`,
        { enrollmentNo: router.state.loginid },
        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response.data.success) {
          setData(response.data.user[0]);
          dispatch(
            setUserData({
              fullname: `${response.data.user[0].firstName} ${response.data.user[0].middleName} ${response.data.user[0].lastName}`,
              semester: response.data.user[0].semester,
              enrollmentNo: response.data.user[0].enrollmentNo,
              branch: response.data.user[0].branch,
            })
          );
>>>>>>> e91f0b5b6a564d61fbe61f31bdb0df8d8ebb4831
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
<<<<<<< HEAD
        toast.error(
          error.response?.data?.message || "Password verification failed"
        );
=======
        console.error(error);
      });
  }, [dispatch, router.state.loginid, router.state.type]);

  const checkPasswordHandler = (e) => {
    e.preventDefault();
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .post(
        `${baseApiURL()}/student/auth/login`,
        { loginid: router.state.loginid, password: password.current },
        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response.data.success) {
          changePasswordHandler(response.data.id);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
>>>>>>> e91f0b5b6a564d61fbe61f31bdb0df8d8ebb4831
        console.error(error);
      });
  };

<<<<<<< HEAD
  return (
    <div className="max-w-5xl mx-auto my-12 p-8 bg-white rounded-xl shadow-lg flex flex-col md:flex-row gap-8">
      {data && (
        <>
          <div className="flex-1">
            <p className="text-3xl font-bold text-gray-800">
              Hello {data.firstName} {data.middleName} {data.lastName} 👋
            </p>

            <div className="mt-4 space-y-3 text-gray-600 text-lg">
              <p>
                <span className="font-medium text-gray-700">Enrollment No:</span>{" "}
                {data.enrollmentNo}
              </p>
              <p>
                <span className="font-medium text-gray-700">Branch:</span>{" "}
                {data.branch}
              </p>
              <p>
                <span className="font-medium text-gray-700">Semester:</span>{" "}
                {data.semester}
              </p>
              <p>
                <span className="font-medium text-gray-700">Phone Number:</span>{" "}
                +91 {data.phoneNumber}
              </p>
              <p>
                <span className="font-medium text-gray-700">Email Address:</span>{" "}
                {data.email}
              </p>
            </div>

            <button
              className={`mt-6 px-4 py-2 rounded transition-all duration-200 font-medium ${
                showPass
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "Close Change Password" : "Change Password"}
            </button>

            {showPass && (
              <form
                className="mt-6 border-t pt-6 border-blue-400 flex flex-col gap-4"
                onSubmit={handlePasswordChange}
=======
  const changePasswordHandler = (id) => {
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .put(
        `${baseApiURL()}/student/auth/update/${id}`,
        { loginid: router.state.loginid, password: password.new },
        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
          setPassword({ new: "", current: "" });
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.error(error);
      });
  };
  return (
    <div className="w-full mx-auto my-8 flex justify-between items-start">
      {data && (
        <>
          <div>
            <p className="text-2xl font-semibold">
              Hello {data.firstName} {data.middleName} {data.lastName}👋
            </p>
            <div className="mt-3">
              <p className="text-lg font-normal mb-2">
                Enrollment No: {data.enrollmentNo}
              </p>
              <p className="text-lg font-normal mb-2">Branch: {data.branch}</p>
              <p className="text-lg font-normal mb-2">
                Semester: {data.semester}
              </p>
              <p className="text-lg font-normal mb-2">
                Phone Number: +91 {data.phoneNumber}
              </p>
              <p className="text-lg font-normal mb-2">
                Email Address: {data.email}
              </p>
            </div>
            <button
              className={`${
                showPass ? "bg-red-100 text-red-600" : "bg-blue-600 text-white"
              }  px-3 py-1 rounded mt-4`}
              onClick={() => setShowPass(!showPass)}
            >
              {!showPass ? "Change Password" : "Close Change Password"}
            </button>
            {showPass && (
              <form
                className="mt-4 border-t-2 border-blue-500 flex flex-col justify-center items-start"
                onSubmit={checkPasswordHandler}
>>>>>>> e91f0b5b6a564d61fbe61f31bdb0df8d8ebb4831
              >
                <input
                  type="password"
                  value={password.current}
                  onChange={(e) =>
                    setPassword({ ...password, current: e.target.value })
                  }
                  placeholder="Current Password"
<<<<<<< HEAD
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
=======
                  className="px-3 py-1 border-2 border-blue-500 outline-none rounded mt-4"
>>>>>>> e91f0b5b6a564d61fbe61f31bdb0df8d8ebb4831
                />
                <input
                  type="password"
                  value={password.new}
                  onChange={(e) =>
                    setPassword({ ...password, new: e.target.value })
                  }
                  placeholder="New Password"
<<<<<<< HEAD
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  className="self-start px-5 py-2 mt-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all"
=======
                  className="px-3 py-1 border-2 border-blue-500 outline-none rounded mt-4"
                />
                <button
                  className="mt-4 hover:border-b-2 hover:border-blue-500"
                  onClick={checkPasswordHandler}
>>>>>>> e91f0b5b6a564d61fbe61f31bdb0df8d8ebb4831
                  type="submit"
                >
                  Change Password
                </button>
              </form>
            )}
          </div>
<<<<<<< HEAD

          <div className="flex-shrink-0">
            <img
              src={
                data.profile?.url ||
                "https://tse4.mm.bing.net/th?id=OIP.ELd1EcTycQvs-HNlEcPqpgHaHa&pid=Api&P=0&h=220"
              }
              alt="faculty profile"
              className="h-52 w-52 rounded-xl object-cover shadow-md border-4 border-white"
            />
          </div>
=======
          <img
            src={process.env.REACT_APP_MEDIA_LINK + "/" + data.profile}
            alt="student profile"
            className="h-[240px] w-[240px] object-cover rounded-lg shadow-md"
          />
>>>>>>> e91f0b5b6a564d61fbe61f31bdb0df8d8ebb4831
        </>
      )}
    </div>
  );
};

<<<<<<< HEAD
export default Profile;
=======
export default Profile
>>>>>>> e91f0b5b6a564d61fbe61f31bdb0df8d8ebb4831
