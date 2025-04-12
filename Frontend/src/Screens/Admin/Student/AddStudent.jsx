import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiUpload } from "react-icons/fi";
import toast from "react-hot-toast";
import axios from "axios";

const AddStudent = () => {
  const [previewImage, setPreviewImage] = useState("");
  const [file, setFile] = useState(null);
  const [branch, setBranch] = useState([]);

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

  const addStudentProfile = (data) => {
    if (!file) {
      toast.error("Please upload a profile image");
      return;
    }

    toast.loading("Adding Student");

    const headers = {
      "Content-Type": "multipart/form-data",
    };

    const formData = new FormData();
    formData.append("enrollmentNo", data.enrollmentNo);
    formData.append("firstName", data.firstName);
    formData.append("middleName", data.middleName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("semester", data.semester);
    formData.append("branch", data.branch);
    formData.append("gender", data.gender);
    formData.append("type", "profile");
    formData.append("profile", file);

    axios
    .post("/api/v1/student/register", formData, { headers })
    .then((response) => {
      toast.dismiss();
      if (response.data.success) {
        toast.success(response.data.message || "Student added successfully");
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
      onSubmit={handleSubmit(addStudentProfile)}
      className="w-[70%] flex justify-center items-center flex-wrap gap-6 mx-auto mt-10"
    >
      <div className="w-[40%]">
        <label htmlFor="firstName" className="leading-7 text-sm">
          Enter First Name
        </label>
        <input
          type="text"
          {...register("firstName", { required: "First Name is required" })}
          className="w-full bg-blue-50 rounded border py-1 px-3 outline-none"
        />
        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
      </div>

      <div className="w-[40%]">
        <label htmlFor="middleName" className="leading-7 text-sm">
          Enter Middle Name
        </label>
        <input
          type="text"
          {...register("middleName", { required: "Middle Name is required" })}
          className="w-full bg-blue-50 rounded border py-1 px-3 outline-none"
        />

      </div>

      <div className="w-[40%]">
        <label htmlFor="lastName" className="leading-7 text-sm">
          Enter Last Name
        </label>
        <input
          type="text"
          {...register("lastName", { required: "Last Name is required" })}
          className="w-full bg-blue-50 rounded border py-1 px-3 outline-none"
        />
        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
      </div>

      <div className="w-[40%]">
        <label htmlFor="enrollmentNo" className="leading-7 text-sm">
          Enter Enrollment No
        </label>
        <input
          type="number"
          {...register("enrollmentNo", { required: "Enrollment No is required" })}
          className="w-full bg-blue-50 rounded border py-1 px-3 outline-none"
        />
        {errors.enrollmentNo && <p className="text-red-500 text-sm">{errors.enrollmentNo.message}</p>}
      </div>

      <div className="w-[40%]">
        <label htmlFor="email" className="leading-7 text-sm">
          Enter Email Address
        </label>
        <input
          type="email"
          {...register("email", { required: "Email is required" })}
          className="w-full bg-blue-50 rounded border py-1 px-3 outline-none"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div className="w-[40%]">
        <label htmlFor="phoneNumber" className="leading-7 text-sm">
          Enter Phone Number
        </label>
        <input
          type="number"
          {...register("phoneNumber", { required: "Phone Number is required" })}
          className="w-full bg-blue-50 rounded border py-1 px-3 outline-none"
        />
        {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
      </div>

      <div className="w-[40%]">
        <label htmlFor="semester" className="leading-7 text-sm">
          Select Semester
        </label>
        <select
          {...register("semester", { required: "Semester is required" })}
          className="w-full bg-blue-50 rounded border py-3 px-2"
        >
          <option value="">-- Select --</option>
          {[...Array(8)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} Semester
            </option>
          ))}
        </select>
        {errors.semester && <p className="text-red-500 text-sm">{errors.semester.message}</p>}
      </div>

      <div className="w-[40%]">
        <label htmlFor="branch" className="leading-7 text-sm">
          Select Branch
        </label>
        <select
          {...register("branch", { required: "Branch is required" })}
          className="w-full bg-blue-50 rounded border py-3 px-2"
        >
          <option value="">-- Select --</option>
          {branch?.map((b) => (
            <option key={b.name} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>
        {errors.branch && <p className="text-red-500 text-sm">{errors.branch.message}</p>}
      </div>

      <div className="w-[40%]">
        <label htmlFor="gender" className="leading-7 text-sm">
          Select Gender
        </label>
        <select
          {...register("gender", { required: "Gender is required" })}
          className="w-full bg-blue-50 rounded border py-3 px-2"
        >
          <option value="">-- Select --</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
      </div>

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
        <input type="file" hidden id="file" accept="image/*" onChange={handleFileChange} />
      </div>

      {previewImage && (
        <div className="w-full flex justify-center items-center">
          <img src={previewImage} alt="student" className="h-36" />
        </div>
      )}

      <button type="submit" className="bg-blue-500 px-6 py-3 rounded-sm mb-6 text-white">
        Add New Student
      </button>
    </form>
  );
};

export default AddStudent;
