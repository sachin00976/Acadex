import axios from "axios";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const Profile = () => {
  const data = useSelector((state) => state.auth.user);
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

    axios
      .post(
        `/api/v1/student/passwordAuth`,
        { enrollmentNo: data.enrollmentNo, password: password.current },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        if (response.data.success) {
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
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || "Password verification failed"
        );
        console.error(error);
      });
  };

  return (
    <div className="max-w-5xl mx-auto my-12 px-6 py-10 bg-white rounded-2xl shadow-xl flex flex-col md:flex-row gap-10 transition-all duration-300">
      {data && (
        <>
          <div className="flex-1 text-gray-800">
            <p className="text-4xl font-bold mb-4 text-blue-800">
              Hello {data.firstName} {data.middleName ? data.middleName : ""} {data.lastName} 👋
            </p>

            <div className="space-y-4 text-lg text-gray-700">
              <p>
                <span className="font-semibold text-gray-800">Enrollment No:</span> {data.enrollmentNo}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Branch:</span> {data.branch}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Semester:</span> {data.semester}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Phone Number:</span> +91 {data.phoneNumber}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Email Address:</span> {data.email}
              </p>
            </div>

            <button
              className={`mt-8 px-6 py-3 rounded-full shadow-md font-semibold transition-all duration-200 ${
                showPass
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600"
              }`}
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "Close Change Password" : "Change Password"}
            </button>

            {showPass && (
              <form
                className="mt-6 border-t pt-6 border-blue-300 flex flex-col gap-5"
                onSubmit={handlePasswordChange}
              >
                <input
                  type="password"
                  value={password.current}
                  onChange={(e) =>
                    setPassword({ ...password, current: e.target.value })
                  }
                  placeholder="Current Password"
                  className="w-full px-6 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  required
                />
                <input
                  type="password"
                  value={password.new}
                  onChange={(e) =>
                    setPassword({ ...password, new: e.target.value })
                  }
                  placeholder="New Password"
                  className="w-full px-6 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  required
                />
                <button
                  className="self-start px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all shadow-md"
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
                data.profile?.url ||
                "https://tse4.mm.bing.net/th?id=OIP.ELd1EcTycQvs-HNlEcPqpgHaHa&pid=Api&P=0&h=220"
              }
              alt="student profile"
              className="h-52 w-52 rounded-2xl object-cover shadow-lg border-4 border-white"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
