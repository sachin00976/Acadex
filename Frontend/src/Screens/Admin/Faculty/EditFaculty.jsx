import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FiSearch, FiUpload, FiX } from 'react-icons/fi';
import { useForm } from 'react-hook-form';

const EditFaculty = () => {
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [search, setSearch] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  const [id, setId] = useState('');
  const [branch, setBranch] = useState(null);
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
      department: '',
      gender: '',
      experience: '',
      post: '',
      profile: ''
    }
  });

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

  const updateFacultyProfile = async (data) => {
    if (!id) {
      toast.error("Please search for a faculty first");
      return;
    }

    setIsSubmitting(true);
    toast.loading('Updating Profile...');

    const formData = new FormData();
    formData.append('employeeId', data.employeeId);
    formData.append('firstName', data.firstName);
    formData.append('middleName', data.middleName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('phoneNumber', data.phoneNumber);
    formData.append('department', data.department);
    formData.append('experience', data.experience);
    formData.append('gender', data.gender);
    formData.append('post', data.post);

    if (file) {
      formData.append('type', 'profile');
      formData.append('profile', file);
    }

    try {
      const response = await axios.patch(`/api/v1/faculty/updateDetail`, formData, {
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

  const searchFacultyHandler = async (e) => {
    e.preventDefault();
    if (!search.trim()) {
      toast.error("Please enter an employee ID");
      return;
    }

    setSearchActive(true);
    toast.loading('Searching Faculty...');

    try {
      // Get branch data
      const branchResponse = await axios.get("/api/v1/branch/getBranch", {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (branchResponse.data.data) {
        setBranch(branchResponse.data.data);
      } else {
        toast.error(branchResponse.data.message);
      }

      // Get faculty data
      const facultyResponse = await axios.post(
        `/api/v1/faculty/getDetail`, 
        { employeeId: search }, 
        { headers: { 'Content-Type': 'application/json' } }
      );

      toast.dismiss();
      const faculty = facultyResponse.data?.data;
      if (!faculty || Object.keys(faculty).length === 0) {
        toast.error('No Faculty Found!');
      } else {
        toast.success(facultyResponse.data.message);
        setId(faculty._id);
        setPreviewImage(faculty.profile?.url || '');
        reset({
          employeeId: faculty.employeeId || '',
          firstName: faculty.firstName || '',
          middleName: faculty.middleName || '',
          lastName: faculty.lastName || '',
          email: faculty.email || '',
          phoneNumber: faculty.phoneNumber || '',
          department: faculty.department || '',
          gender: faculty.gender || '',
          experience: faculty.experience || '',
          post: faculty.post || '',
          profile: faculty.profile?.url || '',
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
        onSubmit={searchFacultyHandler}
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
          onSubmit={handleSubmit(updateFacultyProfile)}
          className="w-full sm:w-[80%] flex flex-wrap justify-center gap-6 mx-auto mt-10"
        >
          {["firstName", "middleName", "lastName", "employeeId", "phoneNumber", "email", "experience"].map((name) => (
            <div key={name} className="w-full sm:w-[45%]">
              <label htmlFor={name} className="block mb-1 text-sm font-medium text-gray-700">
                {name === "employeeId" ? "Employee ID" :
                 name === "phoneNumber" ? "Phone Number" :
                 name === "email" ? "Email" :
                 name === "experience" ? "Experience (years)" :
                 `${name.charAt(0).toUpperCase() + name.slice(1)}`}
                {["firstName", "lastName", "employeeId", "phoneNumber", "email", "experience"].includes(name) && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              <input
                {...register(name, {
                  required: ["firstName", "lastName", "employeeId", "phoneNumber", "email", "experience"].includes(name) 
                    ? `${name === "employeeId" ? "Employee ID" :
                       name === "phoneNumber" ? "Phone number" :
                       name === "email" ? "Email" :
                       name === "experience" ? "Experience" :
                       name} is required`
                    : false,
                  pattern: name === "email" ? {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address"
                  } : name === "phoneNumber" ? {
                    value: /^\d{10}$/,
                    message: "Must be 10 digits"
                  } : undefined,
                  min: name === "experience" ? {
                    value: 0,
                    message: "Cannot be negative"
                  } : undefined
                })}
                type={name === "employeeId" || name === "phoneNumber" || name === "experience" ? "number" : "text"}
                id={name}
                disabled={name === "employeeId"}
                min={name === "experience" ? 0 : undefined}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {errors[name] && (
                <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>
              )}
            </div>
          ))}

          <div className="w-full sm:w-[45%]">
            <label htmlFor="department" className="block mb-1 text-sm font-medium text-gray-700">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              id="department"
              {...register("department", { required: "Department is required" })}
              className="px-4 py-2 bg-blue-50 rounded-lg text-base w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1"
            >
              <option value="">-- Select --</option>
              {branch?.map((branch) => (
                <option value={branch.name} key={branch.name}>
                  {branch.name}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>
            )}
          </div>

          <div className="w-full sm:w-[45%]">
            <label htmlFor="gender" className="block mb-1 text-sm font-medium text-gray-700">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              id="gender"
              {...register("gender", { required: "Gender is required" })}
              className="px-4 py-2 bg-blue-50 rounded-lg text-base w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1"
            >
              <option value="">-- Select --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>
            )}
          </div>

          <div className="w-full sm:w-[45%]">
            <label htmlFor="post" className="block mb-1 text-sm font-medium text-gray-700">
              Post <span className="text-red-500">*</span>
            </label>
            <select
              id="post"
              {...register("post", { required: "Post is required" })}
              className="px-4 py-2 bg-blue-50 rounded-lg text-base w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1"
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
            {errors.post && (
              <p className="text-red-500 text-xs mt-1">{errors.post.message}</p>
            )}
          </div>

          <div className="w-full sm:w-[45%]">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Profile Picture
            </label>
            <label
              htmlFor="file"
              className="w-full flex justify-center items-center gap-2 border border-blue-300 rounded-lg px-4 py-2 bg-blue-50 cursor-pointer hover:bg-blue-100 transition"
            >
              {file ? "Change Image" : "Upload Image"} <FiUpload />
            </label>
            <input 
              hidden 
              type="file" 
              id="file" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            <p className="text-gray-500 text-xs mt-1">JPEG, JPG, or PNG (Max 2MB)</p>
          </div>

          {(previewImage || getValues('profile')) && (
            <div className="w-full flex flex-col justify-center items-center">
              <div className="relative">
                <img
                  src={previewImage || getValues('profile')}
                  alt="Faculty"
                  className="h-36 w-36 object-cover rounded-full border-2 border-blue-400 shadow"
                  onError={(e) => { e.target.src = '/default-avatar.png'; }}
                />
                {(previewImage || file) && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
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

          <div className="w-full flex justify-center gap-4 mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-md flex items-center gap-2 ${
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
                "Update Faculty"
              )}
            </button>
            <button
              type="button"
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition shadow-md"
              onClick={clearSearchHandler}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditFaculty;