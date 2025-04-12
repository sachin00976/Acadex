import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const Profile = () => {
  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState({ new: "", current: "" });
  useEffect(()=>{
    console.log(password);
    
  },[password])
  const user = useSelector((state) => state.auth.user);
  // console.log(user)

  // this is to check that current password is true or not
  const checkPasswordHandler = (e) => {
    e.preventDefault();
    const headers = {
      "Content-Type": "application/json",
    };

    axios
      .post(
        `/api/v1/admin/auth/login`,
        { loginid: user.employeeId, password: password.current },
        { headers }
      )
      .then((response) => {
        if (response.data.success) {
          changePasswordHandler(response.data.id);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Login failed");
        console.error(error);
      });
  };

  // if current password is true then change old password with new one.
  const changePasswordHandler = (id) => {
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .put(
        `/api/v1/admin/auth/update/${id}`,
        { loginid: user.employeeId, password: password.new },
        { headers }
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
        toast.error(error?.response?.data?.message || "Update failed");
        console.error(error);
      });
  };

  return (
    <div className="max-w-5xl mx-auto my-12 p-8 bg-white rounded-xl shadow-lg flex flex-col md:flex-row gap-8">
      {user && (
        <>
          <div className="flex-1">
            <p className="text-3xl font-bold text-gray-800">
              Hello {user.firstName} {user.middleName} {user.lastName} 👋
            </p>
            <div className="mt-4 space-y-3 text-gray-600 text-lg">
              <p>
                <span className="font-medium text-gray-700">Employee Id:</span>{" "}
                {user.employeeId}
              </p>
              <p>
                <span className="font-medium text-gray-700">Phone Number:</span>{" "}
                +91 {user.phoneNumber}
              </p>
              <p>
                <span className="font-medium text-gray-700">Email Address:</span>{" "}
                {user.email}
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
                onSubmit={checkPasswordHandler}
              >
                <input
                  type="password"
                  value={password.current}
                  onChange={(e) =>
                    setPassword({ ...password, current: e.target.value })
                  }
                  placeholder="Current Password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  value={password.new}
                  onChange={(e) =>
                    setPassword({ ...password, new: e.target.value })
                  }
                  placeholder="New Password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  className="self-start px-5 py-2 mt-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all"
                  type="submit"
                >
                  Change Password
                </button>
              </form>
            )}
          </div>

          <div className="flex-shrink-0">
            <img
              src={
                user.Profile ||
                "https://tse4.mm.bing.net/th?id=OIP.ELd1EcTycQvs-HNlEcPqpgHaHa&pid=Api&P=0&h=220"
              }
              alt="Admin profile"
              className="h-52 w-52 rounded-xl object-cover shadow-md border-4 border-white"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;