import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from "react-hot-toast";
import axios from "axios";
import { FiUpload } from "react-icons/fi";

const AddAdmin = () => {
  const [previewImage, setPreviewImage] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    toast.loading("Adding Admin");

    const formData = new FormData();
    formData.append("employeeId", data.employeeId);
    formData.append("firstName", data.firstName);
    formData.append("middleName", data.middleName || "");
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("gender", data.gender);
    formData.append("type", "profile");
    formData.append("profile", data.profile[0]);

    axios
    .post("/api/v1/admin/register", formData, { headers })
    .then((response) => {
      toast.dismiss();
      if (response.data.success) {
        toast.success(response.data.message || "Admin added successfully");
        setFile(null);
        setPreviewImage("");
        reset();
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    })
    .catch((error) => {
      toast.dismiss();
      toast.error(error?.response?.data?.message || "Server error occurred");
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setPreviewImage(URL.createObjectURL(file));
      setValue("profile", e.target.files); // manually set file
    } else {
      toast.error("Please select a valid image file.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[70%] flex justify-center items-center flex-wrap gap-6 mx-auto mt-10"
    >
      {/* First Name */}
      <div className="w-[40%]">
        <label htmlFor="firstName" className="leading-7 text-sm">
          Enter First Name
        </label>
        <input
          type="text"
          id="firstName"
          {...register("firstName", { required: "First Name is required" })}
          className="w-full bg-blue-50 rounded border px-3 py-1"
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
        )}
      </div>

      {/* Middle Name */}
      <div className="w-[40%]">
        <label htmlFor="middleName" className="leading-7 text-sm">
          Enter Middle Name
        </label>
        <input
          type="text"
          id="middleName"
          {...register("middleName")}
          className="w-full bg-blue-50 rounded border px-3 py-1"
        />
      </div>

      {/* Last Name */}
      <div className="w-[40%]">
        <label htmlFor="lastName" className="leading-7 text-sm">
          Enter Last Name
        </label>
        <input
          type="text"
          id="lastName"
          {...register("lastName", { required: "Last Name is required" })}
          className="w-full bg-blue-50 rounded border px-3 py-1"
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
        )}
      </div>

      {/* Employee ID */}
      <div className="w-[40%]">
        <label htmlFor="employeeId" className="leading-7 text-sm">
          Enter Employee ID
        </label>
        <input
          type="text"
          id="employeeId"
          {...register("employeeId", { required: "Employee ID is required" })}
          className="w-full bg-blue-50 rounded border px-3 py-1"
        />
        {errors.employeeId && (
          <p className="text-red-500 text-sm mt-1">{errors.employeeId.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="w-[40%]">
        <label htmlFor="email" className="leading-7 text-sm">
          Enter Email Address
        </label>
        <input
          type="email"
          id="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
          className="w-full bg-blue-50 rounded border px-3 py-1"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Phone Number */}
      <div className="w-[40%]">
        <label htmlFor="phoneNumber" className="leading-7 text-sm">
          Enter Phone Number
        </label>
        <input
          type="text"
          id="phoneNumber"
          {...register("phoneNumber", { required: "Phone number is required" })}
          className="w-full bg-blue-50 rounded border px-3 py-1"
        />
        {errors.phoneNumber && (
          <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
        )}
      </div>

      {/* Gender */}
      <div className="w-[40%]">
        <label htmlFor="gender" className="leading-7 text-sm">
          Select Gender
        </label>
        <select
          id="gender"
          {...register("gender", { required: "Gender is required" })}
          className="w-full bg-blue-50 rounded border px-3 py-3"
        >
          <option value="">-- Select --</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        {errors.gender && (
          <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
        )}
      </div>

      {/* File Upload */}
      <div className="w-[40%]">
        <label htmlFor="file" className="leading-7 text-sm">
          Select Profile
        </label>
        <label
          htmlFor="file"
          className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full flex justify-center items-center cursor-pointer"
        >
          Upload
          <span className="ml-2">
            <FiUpload />
          </span>
        </label>
        <input
          hidden
          type="file"
          id="file"
          accept="image/*"
          onChange={handleFileChange}
          {...register("profile", {
            required: "Profile image is required",
          })}
        />
        {errors.profile && (
          <p className="text-red-500 text-sm mt-1">{errors.profile.message}</p>
        )}
      </div>

      {/* Preview Image */}
      {previewImage && (
        <div className="w-full flex justify-center items-center">
          <img src={previewImage} alt="admin" className="h-36" />
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="bg-blue-500 px-6 py-3 rounded-sm mt-1 text-white"
      >
        Add New Admin
      </button>
    </form>
  );
};

export default AddAdmin;
