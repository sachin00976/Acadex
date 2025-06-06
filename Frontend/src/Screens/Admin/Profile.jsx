import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const Profile = () => {
  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState({ new: "", current: "" });

  useEffect(() => {
    console.log(password);
  }, [password]);

  const user = useSelector((state) => state.auth.user);

  const checkPasswordHandler = (e) => {
    e.preventDefault();
    const headers = { "Content-Type": "application/json" };

    axios
      .post(
        `/api/v1/admin/passwordAuth`,
        { employeeId: user.employeeId, password: password.current },
        { headers }
      )
      .then((response) => {
        if (response.data.success) {
          changePasswordHandler();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Login failed");
        console.error(error);
      });
  };

  const changePasswordHandler = () => {
    const headers = { "Content-Type": "application/json" };

    axios
      .patch(
        `/api/v1/admin/passwordChange`,
        { employeeId: user.employeeId, newPassword: password.new },
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
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-5xl mx-auto p-10 bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row gap-10 transition-all duration-300">
        {user && (
          <>
            <div className="flex-1 text-gray-800">
              <p className="text-4xl font-extrabold text-blue-800 mb-4">
                Hello {user.firstName} {user.middleName} {user.lastName} 👋
              </p>

              <div className="space-y-3 text-gray-700 text-lg">
                <p>
                  <span className="font-semibold text-gray-800">Employee Id:</span> {user.employeeId}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Phone Number:</span> +91 {user.phoneNumber}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Email Address:</span> {user.email}
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

              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  showPass ? "max-h-[500px] mt-6" : "max-h-0"
                }`}
              >
                <form
                  className="border-t pt-6 border-blue-300 flex flex-col gap-5"
                  onSubmit={checkPasswordHandler}
                >
                  <input
                    type="password"
                    value={password.current}
                    onChange={(e) =>
                      setPassword({ ...password, current: e.target.value })
                    }
                    placeholder="Current Password"
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  />
                  <input
                    type="password"
                    value={password.new}
                    onChange={(e) =>
                      setPassword({ ...password, new: e.target.value })
                    }
                    placeholder="New Password"
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  />
                  <button
                    className="self-start px-6 py-3 mt-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all shadow-lg"
                    type="submit"
                  >
                    Change Password
                  </button>
                </form>
              </div>
            </div>

            <div className="flex-shrink-0">
              <img
                src={
                  user.profile?.url ||
                  "https://tse4.mm.bing.net/th?id=OIP.ELd1EcTycQvs-HNlEcPqpgHaHa&pid=Api&P=0&h=220"
                }
                alt="Admin profile"
                className="h-52 w-52 rounded-2xl object-cover shadow-lg border-4 border-white"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
