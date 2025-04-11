import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { FiSearch, FiUpload, FiX } from "react-icons/fi";

const EditAdmin = () => {
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [search, setSearch] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [id, setId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues: {
      employeeId: '',
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      gender: '',
      profile: ''
    }
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;

   
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Only JPEG, JPG, and PNG files are allowed");
      return;
    }


    const maxSize = 2 * 1024 * 1024;
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
    document.getElementById("file").value = "";
  };

  const updateAdminProfile = async (data) => {
    if (!id) {
      toast.error("Please search for an admin first");
      return;
    }

    setIsSubmitting(true);
    toast.loading('Updating Admin...');

    const formData = new FormData();
    formData.append('employeeId', data.employeeId);
    formData.append('firstName', data.firstName);
    formData.append('middleName', data.middleName || "");
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('phoneNumber', data.phoneNumber);
    formData.append('gender', data.gender);

    if (file) {
      formData.append('type', 'profile');
      formData.append('profile', file);
    }

    try {
      const response = await axios.patch(`/api/v1/admin/updateProfile`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.dismiss();
      if (response.data.success) {
        toast.success(response.data.message);
        clearSearchHandler();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error?.response?.data?.message || 'Update failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const searchAdminHandler = async (e) => {
    e.preventDefault();
    if (!search.trim()) {
      toast.error("Please enter an employee ID");
      return;
    }

    setSearchActive(true);
    toast.loading('Searching Admin...');

    try {
      const response = await axios.post(
        `/api/v1/admin/getDetail`, 
        { employeeId: search }, 
        { headers: { 'Content-Type': 'application/json' } }
      );

      toast.dismiss();
      const admin = response.data?.data;
      if (!admin || Object.keys(admin).length === 0) {
        toast.error('No Admin Found!');
      } else {
        toast.success(response.data.message);
        setId(admin._id);
        setPreviewImage(admin.profile?.url || '');
        reset({
          employeeId: admin.employeeId || '',
          firstName: admin.firstName || '',
          middleName: admin.middleName || '',
          lastName: admin.lastName || '',
          email: admin.email || '',
          phoneNumber: admin.phoneNumber || '',
          gender: admin.gender || '',
          profile: admin.profile?.url || '',
        });
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error?.response?.data?.message || 'Search failed');
    }
  };

  const clearSearchHandler = () => {
    setSearchActive(false);
    setSearch('');
    setId('');
    setFile(null);
    setPreviewImage('');
    reset();
    document.getElementById("file").value = "";
  };

  return (
    <div className="my-10 mx-auto w-full px-4">
      <form
        onSubmit={searchAdminHandler}
        className="flex justify-center items-center border border-blue-500 rounded-xl w-full sm:w-[60%] mx-auto overflow-hidden shadow-md"
      >
        <input
          type="text"
          className="px-4 py-3 w-full outline-none text-sm"
          placeholder="Enter Employee ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {search ? (
          <button
            type="button"
            className="px-5 py-3 bg-red-500 text-white hover:bg-red-600 transition duration-200"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              clearSearchHandler();
            }}
          >
            <FiX className="text-xl pointer-events-none" />
          </button>
        ) : (
          <button
            className="px-5 py-3 bg-blue-500 text-white hover:bg-blue-600 transition duration-200"
            type="submit"
          >
            <FiSearch className="text-xl" />
          </button>
        )}
      </form>

      {searchActive && id && (
        <form
          onSubmit={handleSubmit(updateAdminProfile)}
          className="w-full md:w-[70%] flex flex-wrap gap-6 mx-auto mt-10 p-6 bg-white shadow-md rounded-2xl"
        >
          {["firstName", "middleName", "lastName", "employeeId", "phoneNumber", "email"].map((name) => (
            <div key={name} className="w-full md:w-[45%]">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                {name === "employeeId" ? "Employee ID" :
                 name === "phoneNumber" ? "Phone Number" :
                 name === "email" ? "Email" :
                 `${name.charAt(0).toUpperCase() + name.slice(1)}`}
                {["firstName", "lastName", "employeeId", "phoneNumber", "email"].includes(name) && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              <input
                {...register(name, {
                  required: ["firstName", "lastName", "employeeId", "phoneNumber", "email"].includes(name) 
                    ? `${name === "employeeId" ? "Employee ID" :
                       name === "phoneNumber" ? "Phone number" :
                       name === "email" ? "Email" :
                       name} is required`
                    : false,
                  pattern: name === "email" ? {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address"
                  } : name === "phoneNumber" ? {
                    value: /^\d{10}$/,
                    message: "Must be 10 digits"
                  } : undefined
                })}
                type={name === "employeeId" || name === "phoneNumber" ? "number" : "text"}
                id={name}
                disabled={name === "employeeId" }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              {errors[name] && (
                <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
              )}
            </div>
          ))}

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
              Profile Picture
            </label>
            <label
              htmlFor="file"
              className="cursor-pointer flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 border border-dashed rounded-lg px-4 py-3 text-blue-500"
            >
              <FiUpload /> {file ? "Change Image" : "Upload Image"}
            </label>
            <input
              hidden
              type="file"
              id="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {!previewImage && !getValues('profile') && (
              <p className="text-gray-500 text-xs mt-1">Max 2MB (JPEG, PNG)</p>
            )}
          </div>

          {/* Preview Image */}
          {(previewImage || getValues('profile')) && (
            <div className="w-full flex flex-col justify-center items-center mt-4">
              <div className="relative">
                <img
                  src={previewImage || getValues('profile')}
                  alt="Profile Preview"
                  className="h-36 w-36 object-cover rounded-full border-2 border-blue-400"
                />
                {(previewImage || file) && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <FiX size={16} />
                  </button>
                )}
              </div>
              {file && (
                <p className="text-green-600 text-sm mt-2">New image selected</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="w-full flex justify-center gap-4 mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-600 hover:bg-blue-700 transition-all text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 ${
                isSubmitting ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                "Update Admin"
              )}
            </button>
            <button
              type="button"
              onClick={clearSearchHandler}
              className="bg-red-500 hover:bg-red-600 transition-all text-white px-8 py-3 rounded-xl font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditAdmin;