import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useForm } from "react-hook-form";
import { FiUpload } from "react-icons/fi";

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

  useEffect(() => {
    const getBranchData = () => {
      axios
        .get("/api/v1/branch/getBranch")
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
    getBranchData();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const imageUrl = URL.createObjectURL(selectedFile);
    setPreviewImage(imageUrl);
  };

  const addFacultyProfile = (formData) => {
    if (!file) {
      toast.error("Profile picture is required");
      return;
    }

    toast.loading("Adding Faculty...");

    const headers = {
      "Content-Type": "multipart/form-data",
    };

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    data.append("type", "profile");
    data.append("profile", file);

    axios
      .post("/api/v1/faculty/register", data, { headers })
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
        <label>Enter First Name</label>
        <input
          {...register("firstName", { required: "First name is required" })}
          className="input-style"
        />
        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
      </div>

      <div className="w-[40%]">
        <label>Enter Middle Name</label>
        <input {...register("middleName")} className="input-style" />
      </div>

      <div className="w-[40%]">
        <label>Enter Last Name</label>
        <input
          {...register("lastName", { required: "Last name is required" })}
          className="input-style"
        />
        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
      </div>

      <div className="w-[40%]">
        <label>Enter Employee Id</label>
        <input
          {...register("employeeId", { required: "Employee ID is required" })}
          className="input-style"
        />
        {errors.employeeId && <p className="text-red-500 text-sm">{errors.employeeId.message}</p>}
      </div>

      <div className="w-[40%]">
        <label>Enter Email Address</label>
        <input
          type="email"
          {...register("email", { required: "Email is required" })}
          className="input-style"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div className="w-[40%]">
        <label>Enter Phone Number</label>
        <input
          type="text"
          maxLength={10}
          {...register("phoneNumber", {
            required: "Phone number is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Enter a valid 10-digit number",
            },
          })}
          className="input-style"
        />
        {errors.phoneNumber && (
          <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
        )}
      </div>

      <div className="w-[40%]">
        <label>Select Department</label>
        <select
          {...register("department", { required: "Department is required" })}
          className="select-style"
        >
          <option value="">-- Select --</option>
          {branch?.map((b) => (
            <option key={b.name} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>
        {errors.department && (
          <p className="text-red-500 text-sm">{errors.department.message}</p>
        )}
      </div>

      <div className="w-[40%]">
        <label>Select Post</label>
        <select
          {...register("post", { required: "Post is required" })}
          className="select-style"
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
        {errors.post && <p className="text-red-500 text-sm">{errors.post.message}</p>}
      </div>

      <div className="w-[95%] flex justify-evenly items-center">
        <div className="w-[25%]">
          <label>Select Gender</label>
          <select
            {...register("gender", { required: "Gender is required" })}
            className="select-style"
          >
            <option value="">-- Select --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
        </div>

        <div className="w-[25%]">
          <label>Enter Experience</label>
          <input
            type="number"
            min="0"
            {...register("experience", { required: "Experience is required" })}
            className="input-style"
          />
          {errors.experience && (
            <p className="text-red-500 text-sm">{errors.experience.message}</p>
          )}
        </div>

        <div className="w-[25%]">
          <label>Select Profile</label>
          <label htmlFor="file" className="select-style flex justify-center items-center cursor-pointer">
            Upload <span className="ml-2"><FiUpload /></span>
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

      <button type="submit" className="bg-blue-500 px-6 py-3 rounded-sm my-6 text-white">
        Add New Faculty
      </button>
    </form>
  );
};

export default AddFaculty;
