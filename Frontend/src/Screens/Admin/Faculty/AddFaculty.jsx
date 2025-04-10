import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { FiUpload, FiX } from "react-icons/fi";
import { useForm } from "react-hook-form";

const AddFaculty = () => {
  const [file, setFile] = useState(null);
  const [branch, setBranch] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Only JPEG, JPG, and PNG files are allowed");
      return;
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (selectedFile.size > maxSize) {
      toast.error("File size must be less than 2MB");
      return;
    }

    setFile(selectedFile);
    setPreviewImage(URL.createObjectURL(selectedFile));
  };

  const removeImage = () => {
    setFile(null);
    setPreviewImage("");
    // Reset file input
    document.getElementById("file").value = "";
  };

  const addFacultyProfile = (data) => {
    if (!file) {
      toast.error("Please upload a profile picture");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Adding Faculty...");

    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => formData.append(k, v));
    formData.append("type", "profile");
    formData.append("profile", file);

    axios
      .post("/api/v1/faculty/register", formData, { 
        headers: { "Content-Type": "multipart/form-data" } 
      })
      .then((res) => {
        toast.dismiss();
        if (res.data.success) {
          toast.success(res.data.message || "Faculty added successfully");
          resetForm();
        } else {
          toast.error(res.data.message || "Something went wrong");
        }
      })
      .catch((err) => {
        toast.dismiss();
        toast.error(err?.response?.data?.message || "Server error occurred");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const resetForm = () => {
    reset();
    setFile(null);
    setPreviewImage("");
    document.getElementById("file").value = "";
  };

  return (
    <form
      onSubmit={handleSubmit(addFacultyProfile)}
      className="w-full max-w-6xl mx-auto p-8 mt-10 bg-white rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8"
    >
      {/* First Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          First Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("firstName", { required: "First name is required" })}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
      </div>

      {/* Middle Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
        <input
          type="text"
          {...register("middleName")}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Last Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Last Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("lastName", { required: "Last name is required" })}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
      </div>

      {/* Employee ID */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Employee ID <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("employeeId", { required: "Employee ID is required" })}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {errors.employeeId && <p className="text-red-500 text-sm mt-1">{errors.employeeId.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          placeholder="example@domain.com"
          {...register("email", { 
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address"
            }
          })}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          maxLength={10}
          placeholder="9876543210"
          {...register("phoneNumber", {
            required: "Phone number is required",
            pattern: {
              value: /^\d{10}$/,
              message: "Valid 10-digit number required"
            }
          })}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
      </div>

      {/* Department */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Department <span className="text-red-500">*</span>
        </label>
        <select
          {...register("department", { required: "Department is required" })}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="">-- Select --</option>
          {branch.map((b) => (
            <option value={b.name} key={b.name}>
              {b.name}
            </option>
          ))}
        </select>
        {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>}
      </div>

      {/* Post */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Post <span className="text-red-500">*</span>
        </label>
        <select
          {...register("post", { required: "Post is required" })}
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
        {errors.post && <p className="text-red-500 text-sm mt-1">{errors.post.message}</p>}
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gender <span className="text-red-500">*</span>
        </label>
        <select
          {...register("gender", { required: "Gender is required" })}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="">-- Select --</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
      </div>

      {/* Experience */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Experience (years) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          min={0}
          {...register("experience", { 
            required: "Experience is required",
            min: {
              value: 0,
              message: "Experience cannot be negative"
            }
          })}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>}
      </div>

      {/* Profile Picture Upload */}
      <div className="flex flex-col justify-center items-center">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Picture <span className="text-red-500">*</span>
        </label>
        <label
          htmlFor="file"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-100 text-blue-800 font-medium rounded-xl cursor-pointer hover:bg-blue-200 transition"
        >
          {file ? "Change Image" : "Upload Image"} <FiUpload className="text-lg" />
        </label>
        <input 
          hidden 
          type="file" 
          id="file" 
          accept="image/*" 
          onChange={handleFileChange} 
        />
        <p className="text-gray-500 text-xs mt-2">JPEG, JPG, or PNG (Max 2MB)</p>
      </div>

      {/* Image Preview with Cancel Button */}
      {previewImage && (
        <div className="col-span-full flex flex-col justify-center items-center mt-4">
          <div className="relative">
            <img 
              src={previewImage} 
              alt="Preview" 
              className="h-36 rounded-xl border border-gray-200 shadow-md object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
            >
              <FiX size={16} />
            </button>
          </div>
          <p className="text-green-600 text-sm mt-2">Image selected</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="col-span-full flex justify-center mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg transition flex items-center gap-2 ${
            isSubmitting ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            "Add New Faculty"
          )}
        </button>
      </div>
    </form>
  );
};

export default AddFaculty;