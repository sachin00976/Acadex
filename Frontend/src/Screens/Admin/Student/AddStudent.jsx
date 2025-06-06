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
      className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-3xl shadow-lg shadow-gray-300 flex flex-wrap gap-8 justify-center"
    >
      {/* Input Field Template */}
      {[
        {
          label: "Enter First Name",
          name: "firstName",
          type: "text",
          required: "First Name is required",
        },
        {
          label: "Enter Middle Name",
          name: "middleName",
          type: "text",
          required: false,
        },
        {
          label: "Enter Last Name",
          name: "lastName",
          type: "text",
          required: "Last Name is required",
        },
        {
          label: "Enter Enrollment No",
          name: "enrollmentNo",
          type: "number",
          required: "Enrollment No is required",
        },
        {
          label: "Enter Email Address",
          name: "email",
          type: "email",
          required: "Email is required",
        },
        {
          label: "Enter Phone Number",
          name: "phoneNumber",
          type: "number",
          required: "Phone Number is required",
        },
      ].map(({ label, name, type, required }) => (
        <div key={name} className="w-[45%]">
          <label
            htmlFor={name}
            className="block mb-1 font-semibold text-gray-700 text-sm"
          >
            {label}
          </label>
          <input
            id={name}
            type={type}
            {...register(name, required ? { required } : {})}
            className={`w-full bg-blue-50 rounded-lg border border-gray-300 py-2 px-4 text-gray-800 outline-none shadow-sm focus:ring-2 focus:ring-blue-500 transition`}
          />
          {errors[name] && (
            <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>
          )}
        </div>
      ))}

      {/* Semester */}
      <div className="w-[45%]">
        <label
          htmlFor="semester"
          className="block mb-1 font-semibold text-gray-700 text-sm"
        >
          Select Semester
        </label>
        <select
          id="semester"
          {...register("semester", { required: "Semester is required" })}
          className="w-full bg-blue-50 rounded-lg border border-gray-300 py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
        >
          <option value="">-- Select --</option>
          {[...Array(8)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} Semester
            </option>
          ))}
        </select>
        {errors.semester && (
          <p className="text-red-500 text-xs mt-1">{errors.semester.message}</p>
        )}
      </div>

      {/* Branch */}
      <div className="w-[45%]">
        <label
          htmlFor="branch"
          className="block mb-1 font-semibold text-gray-700 text-sm"
        >
          Select Branch
        </label>
        <select
          id="branch"
          {...register("branch", { required: "Branch is required" })}
          className="w-full bg-blue-50 rounded-lg border border-gray-300 py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
        >
          <option value="">-- Select --</option>
          {branch?.map((b) => (
            <option key={b.name} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>
        {errors.branch && (
          <p className="text-red-500 text-xs mt-1">{errors.branch.message}</p>
        )}
      </div>

      {/* Gender */}
      <div className="w-[45%]">
        <label
          htmlFor="gender"
          className="block mb-1 font-semibold text-gray-700 text-sm"
        >
          Select Gender
        </label>
        <select
          id="gender"
          {...register("gender", { required: "Gender is required" })}
          className="w-full bg-blue-50 rounded-lg border border-gray-300 py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
        >
          <option value="">-- Select --</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        {errors.gender && (
          <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>
        )}
      </div>

      {/* File Upload */}
      <div className="w-[45%]">
        <label
          htmlFor="file"
          className="block mb-1 font-semibold text-gray-700 text-sm"
        >
          Select Profile
        </label>
        <label
          htmlFor="file"
          className="flex justify-center items-center gap-2 w-full px-4 py-3 bg-blue-50 border border-gray-300 rounded-lg text-blue-600 cursor-pointer hover:bg-blue-100 transition-shadow shadow-sm"
        >
          Upload
          <FiUpload className="text-lg" />
        </label>
        <input
          type="file"
          hidden
          id="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      {/* Preview Image */}
      {previewImage && (
        <div className="w-full flex justify-center">
          <img
            src={previewImage}
            alt="student"
            className="h-36 rounded-lg shadow-md border border-gray-200"
          />
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition"
      >
        Add New Student
      </button>
    </form>
  );
};

export default AddStudent;
