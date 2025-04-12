import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { FiSearch, FiUpload, FiX } from "react-icons/fi";

const EditAdmin = () => {
  const [search, setSearch] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [id, setId] = useState("");
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
   
  } = useForm();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setPreviewImage(imageUrl);
    }
  };

  const updateAdminProfile = (formDataValues) => {
    toast.loading("Updating Admin");

    const headers = {
      "Content-Type": "multipart/form-data",
    };

    const formData = new FormData();
    for (const key in formDataValues) {
      formData.append(key, formDataValues[key] || "");
    }

    if (file) {
      formData.append("type", "profile");
      formData.append("profile", file);
    }

    axios
      .put(``, formData, { headers })
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
        toast.error(error?.response?.data?.message || "Update failed");
      });
  };

  const searchAdminHandler = (e) => {
    e.preventDefault();
    setSearchActive(true);
    toast.loading();

    axios
      .post(``, { employeeId: search })
      .then((response) => {
        toast.dismiss();
        if (response.data.success && response.data.user.length > 0) {
          const user = response.data.user[0];
          toast.success(response.data.message);
          setId(user._id);

          setValue("employeeId", user.employeeId);
          setValue("firstName", user.firstName);
          setValue("middleName", user.middleName);
          setValue("lastName", user.lastName);
          setValue("email", user.email);
          setValue("phoneNumber", user.phoneNumber);
          setValue("gender", user.gender);
          setPreviewImage(user.profile || "");
        } else {
          toast.error("No Admin Found With ID");
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error?.response?.data?.message || "Search failed");
      });
  };

  const clearSearchHandler = () => {
    setSearch("");
    setSearchActive(false);
    setId("");
    setFile(null);
    setPreviewImage("");
    reset();
  };

  return (
    <div className="my-6 mx-auto w-full">
    
      <form
        onSubmit={searchAdminHandler}
        className="flex justify-center items-center border-2 border-blue-500 rounded w-[40%] mx-auto"
      >
        <input
          type="text"
          className="px-6 py-3 w-full outline-none"
          placeholder="Employee Id."
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
            type="button"
            onClick={clearSearchHandler}
          >
            <FiX />
          </button>
        )}
      </form>

      {search && id && (
        <form
          onSubmit={handleSubmit(updateAdminProfile)}
          className="w-[70%] flex justify-center items-center flex-wrap gap-6 mx-auto mt-10"
        >
          <div className="w-[40%]">
            <label className="leading-7 text-sm">Enter First Name</label>
            <input
              type="text"
              {...register("firstName")}
              className="w-full bg-blue-50 rounded border py-1 px-3"
            />
          </div>

          <div className="w-[40%]">
            <label className="leading-7 text-sm">Enter Middle Name</label>
            <input
              type="text"
              {...register("middleName")}
              className="w-full bg-blue-50 rounded border py-1 px-3"
            />
          </div>

          <div className="w-[40%]">
            <label className="leading-7 text-sm">Enter Last Name</label>
            <input
              type="text"
              {...register("lastName")}
              className="w-full bg-blue-50 rounded border py-1 px-3"
            />
          </div>

          <div className="w-[40%]">
            <label className="leading-7 text-sm">Enter Employee Id</label>
            <input
              type="text"
              {...register("employeeId")}
              className="w-full bg-blue-50 rounded border py-1 px-3"
            />
          </div>

          <div className="w-[40%]">
            <label className="leading-7 text-sm">Enter Email Address</label>
            <input
              type="email"
              {...register("email")}
              className="w-full bg-blue-50 rounded border py-1 px-3"
            />
          </div>

          <div className="w-[40%]">
            <label className="leading-7 text-sm">Enter Phone Number</label>
            <input
              type="text"
              {...register("phoneNumber")}
              className="w-full bg-blue-50 rounded border py-1 px-3"
            />
          </div>

          <div className="w-[40%]">
            <label className="leading-7 text-sm">Select Gender</label>
            <select
              {...register("gender")}
              className="w-full bg-blue-50 py-3 rounded-sm"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="w-[40%]">
            <label className="leading-7 text-sm">Select Profile</label>
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
              <img
                src={ previewImage}
                alt="admin"
                className="h-36"
              />
            </div>
          )}

          <button
            type="submit"
            className="bg-blue-500 px-6 py-3 rounded-sm mb-6 text-white"
          >
            Update Admin
          </button>
        </form>
      )}
    </div>
  );
};

export default EditAdmin;

