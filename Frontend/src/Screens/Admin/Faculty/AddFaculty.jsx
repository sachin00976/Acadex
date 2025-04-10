import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { FiUpload } from "react-icons/fi";
import { useForm } from "react-hook-form";

const AddFaculty = () => {
  const [file, setFile] = useState();
  const [branch, setBranch] = useState([]);
  const [previewImage, setPreviewImage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const getBranchData = () => {
    axios
      .get("/api/v1/branch/getBranch", { headers: { "Content-Type": "application/json" } })
      .then((res) => {
        if (res.data.data) setBranch(res.data.data);
        else toast.error(res.data.message);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getBranchData();
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreviewImage(URL.createObjectURL(selected));
  };

  const addFacultyProfile = (data) => {
    if (!file) {
      toast.error("Please upload a profile picture");
      return;
    }

    toast.loading("Adding Faculty...");

    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => formData.append(k, v));
    formData.append("type", "profile");
    formData.append("profile", file);

    axios
      .post("/api/v1/faculty/register", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((res) => {
        toast.dismiss();
        if (res.data.success) {
          toast.success(res.data.message || "Faculty added successfully");
          setFile(null);
          setPreviewImage("");
          reset();
        } else toast.error(res.data.message || "Something went wrong");
      })
      .catch((err) => {
        toast.dismiss();
        toast.error(err?.response?.data?.message || "Server error occurred");
      });
  };

  return (
    <form
      onSubmit={handleSubmit(addFacultyProfile)}
      className="w-full max-w-6xl mx-auto p-8 mt-10 bg-white rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
        <input
          type="text"
          {...register("firstName", { required: true })}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {errors.firstName && <p className="text-red-500 text-sm mt-1">First name is required</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
        <input
          type="text"
          {...register("middleName")}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
        <input
          type="text"
          {...register("lastName", { required: true })}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {errors.lastName && <p className="text-red-500 text-sm mt-1">Last name is required</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
        <input
          type="text"
          {...register("employeeId", { required: true })}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {errors.employeeId && <p className="text-red-500 text-sm mt-1">Employee ID is required</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input
          type="email"
          placeholder="example@domain.com"
          {...register("email", { required: true })}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">Email is required</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <input
          type="text"
          maxLength={10}
          placeholder="9876543210"
          {...register("phoneNumber", {
            required: true,
            pattern: /^\d{10}$/,
          })}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">Valid 10-digit number required</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
        <select
          {...register("department", { required: true })}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="">-- Select --</option>
          {branch.map((b) => (
            <option value={b.name} key={b.name}>
              {b.name}
            </option>
          ))}
        </select>
        {errors.department && <p className="text-red-500 text-sm mt-1">Department is required</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Post</label>
        <select
          {...register("post", { required: true })}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="">-- Select --</option>
          <option value="Professor">Professor</option>
          <option value="Associate Professor">Associate Professor</option>
          <option value="Assistant Professor">Assistant Professor</option>
          <option value="HOD">HOD</option>
          <option value="Lecturer">Lecturer</option>
          <option value="Visiting Faculty">Visiting Faculty</option>
          <option value="Lab Assistant">Lab Assistant</option>
          <option value="Technical Assistant">Technical Assistant</option>
        </select>
        {errors.post && <p className="text-red-500 text-sm mt-1">Post is required</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
        <select
          {...register("gender", { required: true })}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="">-- Select --</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && <p className="text-red-500 text-sm mt-1">Gender is required</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
        <input
          type="number"
          min={0}
          {...register("experience", { required: true })}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {errors.experience && <p className="text-red-500 text-sm mt-1">Experience is required</p>}
      </div>

      <div className="flex flex-col justify-center items-center">
        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
        <label
          htmlFor="file"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-100 text-blue-800 font-medium rounded-xl cursor-pointer hover:bg-blue-200 transition"
        >
          Upload <FiUpload className="text-lg" />
        </label>
        <input hidden type="file" id="file" accept="image/*" onChange={handleFileChange} />
      </div>

      {previewImage && (
        <div className="col-span-full flex justify-center mt-4">
          <img src={previewImage} alt="Preview" className="h-36 rounded-xl border border-gray-200 shadow-md object-cover" />
        </div>
      )}

      <div className="col-span-full flex justify-center mt-6">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg transition"
        >
          Add New Faculty
        </button>
      </div>
    </form>
  );
};

export default AddFaculty;
