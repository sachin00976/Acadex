import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { FiSearch, FiUpload, FiX } from "react-icons/fi";
import { useForm } from "react-hook-form";

const EditStudent = () => {
  const [file, setFile] = useState();
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState([]);
  const [searchActive, setSearchActive] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [id, setId] = useState();

  const { register, handleSubmit, reset, setValue } = useForm();

  const getBranchData = () => {
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .get(``, { headers })
      .then((response) => {
        if (response.data.success) {
          setBranch(response.data.branches);
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

  const updateStudentProfile = (formDataInput) => {
    toast.loading("Updating Student");
    const formData = new FormData();

    Object.entries(formDataInput).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (file) {
      formData.append("type", "profile");
      formData.append("profile", file);
    }

    const headers = {
      "Content-Type": "multipart/form-data",
    };

    axios
      .put(``, formData, {
        headers,
      })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          clearSearchHandler();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response.data.message);
      });
  };

  const clearSearchHandler = () => {
    setSearchActive(false);
    setSearch("");
    setId("");
    setPreviewImage("");
    reset();
  };

  const searchStudentHandler = (e) => {
    setSearchActive(true);
    e.preventDefault();
    toast.loading("Getting Student");
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .post(``, { enrollmentNo: search }, { headers })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          if (response.data.user.length === 0) {
            toast.error("No Student Found");
          } else {
            toast.success(response.data.message);
            const student = response.data.user[0];
            reset(student);
            setId(student._id);
            setPreviewImage(student.profile);
          }
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error?.response?.data?.message || "Error");
      });
  };

  return (
    <div className="my-6 mx-auto w-full">
      <form
        onSubmit={searchStudentHandler}
        className="flex justify-center items-center border-2 border-blue-500 rounded w-[40%] mx-auto"
      >
        <input
          type="text"
          className="px-6 py-3 w-full outline-none"
          placeholder="Enrollment No."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {!searchActive ? (
          <button className="px-4 text-2xl hover:text-blue-500" type="submit">
            <FiSearch />
          </button>
        ) : (
          <button
            className="px-4 text-2xl hover:text-blue-500"
            onClick={clearSearchHandler}
            type="button"
          >
            <FiX />
          </button>
        )}
      </form>

      {search && id && (
        <form
          onSubmit={handleSubmit(updateStudentProfile)}
          className="w-[70%] flex justify-center items-center flex-wrap gap-6 mx-auto mt-10"
        >
          <div className="w-[40%]">
            <label htmlFor="firstName" className="leading-7 text-sm">
              Enter First Name
            </label>
            <input
              {...register("firstName")}
              type="text"
              id="firstName"
              className="w-full bg-blue-50 rounded border text-base outline-none py-1 px-3 leading-8"
            />
          </div>

          <div className="w-[40%]">
            <label htmlFor="middleName" className="leading-7 text-sm">
              Enter Middle Name
            </label>
            <input
              {...register("middleName")}
              type="text"
              id="middleName"
              className="w-full bg-blue-50 rounded border text-base outline-none py-1 px-3 leading-8"
            />
          </div>

          <div className="w-[40%]">
            <label htmlFor="lastName" className="leading-7 text-sm">
              Enter Last Name
            </label>
            <input
              {...register("lastName")}
              type="text"
              id="lastName"
              className="w-full bg-blue-50 rounded border text-base outline-none py-1 px-3 leading-8"
            />
          </div>

          <div className="w-[40%]">
            <label htmlFor="enrollmentNo" className="leading-7 text-sm">
              Enrollment No
            </label>
            <input
              {...register("enrollmentNo")}
              disabled
              type="number"
              id="enrollmentNo"
              className="w-full bg-blue-50 rounded border text-base outline-none py-1 px-3 leading-8"
            />
          </div>

          <div className="w-[40%]">
            <label htmlFor="email" className="leading-7 text-sm">
              Enter Email
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              className="w-full bg-blue-50 rounded border text-base outline-none py-1 px-3 leading-8"
            />
          </div>

          <div className="w-[40%]">
            <label htmlFor="phoneNumber" className="leading-7 text-sm">
              Enter Phone Number
            </label>
            <input
              {...register("phoneNumber")}
              type="number"
              id="phoneNumber"
              className="w-full bg-blue-50 rounded border text-base outline-none py-1 px-3 leading-8"
            />
          </div>

          <div className="w-[40%]">
            <label htmlFor="semester" className="leading-7 text-sm">
              Semester
            </label>
            <select
              {...register("semester")}
              id="semester"
              disabled
              className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full"
            >
              <option value="">-- Select --</option>
              {[...Array(8)].map((_, i) => (
                <option value={i + 1} key={i + 1}>
                  {i + 1} Semester
                </option>
              ))}
            </select>
          </div>

          <div className="w-[40%]">
            <label htmlFor="branch" className="leading-7 text-sm">
              Branch
            </label>
            <select
              {...register("branch")}
              id="branch"
              disabled
              className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full"
            >
              <option value="">-- Select --</option>
              {branch.map((b) => (
                <option key={b.name} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-[40%]">
            <label htmlFor="gender" className="leading-7 text-sm">
              Gender
            </label>
            <select
              {...register("gender")}
              id="gender"
              className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full"
            >
              <option value="">-- Select --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="w-[40%]">
            <label htmlFor="file" className="leading-7 text-sm">
              Select New Profile
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

          {previewImage && (
            <div className="w-full flex justify-center items-center">
              <img src={previewImage} alt="student" className="h-36" />
            </div>
          )}

          <div className="w-full flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 px-6 py-3 rounded-sm mt-6 text-white"
            >
              Update Student
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditStudent;