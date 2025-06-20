import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { FiUpload, FiX } from "react-icons/fi";

const AddAdmin = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    if (!selectedFile) {
      toast.error("Please select a profile image");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Adding Admin...");

    const formData = new FormData();
    formData.append("employeeId", data.employeeId);
    formData.append("firstName", data.firstName);
    formData.append("middleName", data.middleName || "");
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("gender", data.gender);
    formData.append("password", data.password);
    formData.append("type", "profile");
    formData.append("profile", selectedFile);

    try {
      const response = await axios.post("/api/v1/admin/register", formData);
      toast.dismiss();
      if (response.data.success) {
        toast.success(response.data.message || "Admin added successfully");
        resetForm();
        // Optional: focus first name input after reset
        document.querySelector('input[name="firstName"]')?.focus();
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error?.response?.data?.message || "Server error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    reset();
    setPreviewImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setPreviewImage(null);
      setSelectedFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPEG, PNG, etc.)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
    setSelectedFile(file);
  };

  const removeImage = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[90%] md:w-[70%] flex flex-wrap gap-6 mx-auto mt-10 p-6 bg-white shadow-md rounded-2xl"
    >
      {/* First Name */}
      <div className="w-full md:w-[45%]">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          First Name <span className="text-red-500">*</span>
        </label>
        <input
          name="firstName"
          type="text"
          placeholder="Enter first name"
          {...register("firstName", { required: "First Name is required" })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
        )}
      </div>

      {/* Middle Name */}
      <div className="w-full md:w-[45%]">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Middle Name
        </label>
        <input
          type="text"
          placeholder="Enter middle name (optional)"
          {...register("middleName")}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      {/* Last Name */}
      <div className="w-full md:w-[45%]">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Last Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter last name"
          {...register("lastName", { required: "Last Name is required" })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
        )}
      </div>

      {/* Employee ID */}
      <div className="w-full md:w-[45%]">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Employee ID <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter employee ID"
          {...register("employeeId", { required: "Employee ID is required" })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
        />
        {errors.employeeId && (
          <p className="text-red-500 text-sm mt-1">{errors.employeeId.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="w-full md:w-[45%]">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          placeholder="Enter email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Phone Number */}
      <div className="w-full md:w-[45%]">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter phone number"
          {...register("phoneNumber", { required: "Phone number is required" })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
        />
        {errors.phoneNumber && (
          <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="w-full md:w-[45%]">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Password <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          placeholder="Enter password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Gender */}
      <div className="w-full md:w-[45%]">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Gender <span className="text-red-500">*</span>
        </label>
        <select
          {...register("gender", { required: "Gender is required" })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && (
          <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
        )}
      </div>

      {/* File Upload */}
      <div className="w-full md:w-[45%]">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Profile Image <span className="text-red-500">*</span>
        </label>
        <input
          ref={fileInputRef}
          hidden
          type="file"
          id="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <label
          htmlFor="file"
          aria-label={selectedFile ? "Change profile image" : "Upload profile image"}
          className="flex items-center justify-center cursor-pointer border border-dashed border-gray-400 rounded-lg p-4 hover:border-blue-500 transition-colors"
        >
          {previewImage ? (
            <div className="relative">
              <img
                src={previewImage}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-full"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-0 right-0 bg-white rounded-full p-1 hover:bg-red-500 hover:text-white transition-colors"
                aria-label="Remove image"
              >
                <FiX size={18} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-500">
              <FiUpload size={28} />
              <span className="text-xs mt-1">Upload Image</span>
            </div>
          )}
        </label>
      </div>

      {/* Submit Button */}
      <div className="w-full mt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-60"
        >
          {isSubmitting ? "Adding..." : "Add Admin"}
        </button>
      </div>
    </form>
  );
};

export default AddAdmin;
