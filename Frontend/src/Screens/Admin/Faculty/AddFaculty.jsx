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
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .get("/api/v1/branch/getBranch", { headers })
      .then((response) => {
        if (response.data.data) {
          setBranch(response.data.data);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getBranchData();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const imageUrl = URL.createObjectURL(selectedFile);
    setPreviewImage(imageUrl);
  };

  const addFacultyProfile = (formDataInput) => {
    if (!file) {
      toast.error("Please upload a profile picture");
      return;
    }

    toast.loading("Adding Faculty...");

    const formData = new FormData();
    Object.entries(formDataInput).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("type", "profile");
    formData.append("profile", file);

    const headers = {
      "Content-Type": "multipart/form-data",
    };

    axios
      .post("/api/v1/faculty/register", formData, { headers })
      .then((response) => {
        toast.dismiss();

        if (response.data.success) {
          toast.success(response.data.message || "Faculty added successfully");
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

  return (
    <form
      onSubmit={handleSubmit(addFacultyProfile)}
      className="w-[70%] flex justify-center items-center flex-wrap gap-6 mx-auto mt-10"
    >
      <div className="w-[40%]">
        <label htmlFor="firstName" className="leading-7 text-sm">
          Enter First Name
        </label>
        <input
          type="text"
          id="firstName"
          {...register("firstName", { required: true })}
          className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
        {errors.firstName && <span className="text-red-500 text-xs">First name is required</span>}
      </div>

      <div className="w-[40%]">
        <label htmlFor="middleName" className="leading-7 text-sm">
          Enter Middle Name
        </label>
        <input
          type="text"
          id="middleName"
          {...register("middleName")}
          className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
      </div>

      <div className="w-[40%]">
        <label htmlFor="lastName" className="leading-7 text-sm">
          Enter Last Name
        </label>
        <input
          type="text"
          id="lastName"
          {...register("lastName", { required: true })}
          className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
        {errors.lastName && <span className="text-red-500 text-xs">Last name is required</span>}
      </div>

      <div className="w-[40%]">
        <label htmlFor="employeeId" className="leading-7 text-sm">
          Enter Employee Id
        </label>
        <input
          type="text"
          id="employeeId"
          {...register("employeeId", { required: true })}
          className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
        {errors.employeeId && <span className="text-red-500 text-xs">Employee ID is required</span>}
      </div>

      <div className="w-[40%]">
        <label htmlFor="email" className="leading-7 text-sm">
          Enter Email Address
        </label>
        <input
          type="email"
          id="email"
          {...register("email", { required: true })}
          placeholder="e.g. example@domain.com"
          className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
        {errors.email && <span className="text-red-500 text-xs">Email is required</span>}
      </div>

      <div className="w-[40%]">
        <label htmlFor="phoneNumber" className="leading-7 text-sm">
          Enter Phone Number
        </label>
        <input
          type="text"
          id="phoneNumber"
          {...register("phoneNumber", {
            required: true,
            pattern: /^\d{10}$/,
          })}
          maxLength={10}
          placeholder="e.g. 9876543210"
          className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
        {errors.phoneNumber && <span className="text-red-500 text-xs">Enter a valid 10-digit phone number</span>}
      </div>

      <div className="w-[40%]">
        <label htmlFor="department" className="leading-7 text-sm">
          Select Department
        </label>
        <select
          id="department"
          {...register("department", { required: true })}
          className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full accent-blue-700 mt-1"
        >
          <option value="">-- Select --</option>
          {branch?.map((branch) => (
            <option value={branch.name} key={branch.name}>
              {branch.name}
            </option>
          ))}
        </select>
        {errors.department && <span className="text-red-500 text-xs">Department is required</span>}
      </div>

      <div className="w-[40%]">
        <label htmlFor="post" className="leading-7 text-sm">
          Select Post
        </label>
        <select
          id="post"
          {...register("post", { required: true })}
          className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full accent-blue-700 mt-1"
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
        {errors.post && <span className="text-red-500 text-xs">Post is required</span>}
      </div>

      <div className="w-[95%] flex justify-evenly items-center">
        <div className="w-[25%]">
          <label htmlFor="gender" className="leading-7 text-sm">
            Select Gender
          </label>
          <select
            id="gender"
            {...register("gender", { required: true })}
            className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full accent-blue-700 mt-1"
          >
            <option value="">-- Select --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <span className="text-red-500 text-xs">Gender is required</span>}
        </div>

        <div className="w-[25%]">
          <label htmlFor="experience" className="leading-7 text-sm">
            Enter Experience
          </label>
          <input
            type="number"
            id="experience"
            min={0}
            {...register("experience", { required: true })}
            className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
          {errors.experience && <span className="text-red-500 text-xs">Experience is required</span>}
        </div>

        <div className="w-[25%]">
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
          />
        </div>
      </div>

      {previewImage && (
        <div className="w-full flex justify-center items-center">
          <img src={previewImage} alt="faculty" className="h-36" />
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-500 px-6 py-3 rounded-sm my-6 text-white"
      >
        Add New Faculty
      </button>
    </form>
  );
};

export default AddFaculty;
