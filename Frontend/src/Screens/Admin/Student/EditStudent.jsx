import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { FiSearch, FiUpload, FiX } from "react-icons/fi";
import { useForm } from "react-hook-form";

const EditStudent = () => {
  const [file, setFile] = useState(null);
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState([]);
  const [searchActive, setSearchActive] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [branchLoading, setBranchLoading] = useState(true);

  const { register, handleSubmit, reset, setValue } = useForm();

  const getBranchData = () => {
    setBranchLoading(true);
    axios
      .get(`/api/v1/branch/getBranch`, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        if (response.data?.success) {
          setBranch(response.data.data || []);
        } else {
          toast.error(response.data?.message || "Failed to fetch branches");
          setBranch([]);
        }
      })
      .catch(() => {
        toast.error("Failed to fetch branches");
        setBranch([]);
      })
      .finally(() => setBranchLoading(false));
  };

  useEffect(() => {
    getBranchData();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewImage(URL.createObjectURL(selectedFile));
    }
  };

  const updateStudentProfile = (formDataInput) => {
    if (!id) {
      toast.error("No student selected");
      return;
    }

    toast.loading("Updating Student");
    const formData = new FormData();

    Object.entries(formDataInput).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    if (file) {
      formData.append("type", "profile");
      formData.append("profile", file);
    }

    axios
      .patch(`/api/v1/student/updateDetail`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
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
        toast.error(error.response?.data?.message || "Update failed");
      });
  };

  const clearSearchHandler = (e) => {
    if (e) e.preventDefault();
    setSearchActive(false);
    setSearch("");
    setId(null);
    setPreviewImage("");
    setFile(null);
    reset();
  };

  const searchStudentHandler = (e) => {
    e.preventDefault();

    const isClearAction = e.nativeEvent?.submitter?.ariaLabel === "clear-search";

    if (!search.trim() && !isClearAction) {
      toast.error("Please enter enrollment number");
      return;
    }

    if (isClearAction) {
      clearSearchHandler();
      return;
    }

    setLoading(true);
    toast.loading("Getting Student");

    axios
      .post(
        `/api/v1/student/getdetails`,
        { enrollmentNo: search },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        toast.dismiss();
        setLoading(false);
        if (response.data.success) {
          if (!response.data.data) {
            toast.error("No Student Found");
          } else {
            toast.success(response.data.message);
            const student = response.data.data;
            reset(student);
            setId(student._id);
            setPreviewImage(student.profile?.url || "");
            setSearchActive(true);
          }
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        setLoading(false);
        toast.error(error?.response?.data?.message || "Error fetching student");
      });
  };

  return (
    <div className="my-6 mx-auto w-full max-w-5xl px-4">
      <form
        onSubmit={searchStudentHandler}
        className="flex justify-center items-center border-2 border-blue-500 rounded-md w-full max-w-md mx-auto shadow-md"
      >
        <input
          type="text"
          className="px-6 py-3 w-full outline-none rounded-l-md"
          placeholder="Enrollment No."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={loading}
        />
        {!searchActive ? (
          <button
            className="px-4 text-2xl text-blue-600 hover:text-blue-800 rounded-r-md"
            type="submit"
            disabled={loading}
          >
            <FiSearch />
          </button>
        ) : (
          <button
            className="px-4 text-2xl text-red-600 hover:text-red-800 rounded-r-md"
            type="submit"
            disabled={loading}
            aria-label="clear-search"
          >
            <FiX />
          </button>
        )}
      </form>

      {searchActive && id && (
        <form
          onSubmit={handleSubmit(updateStudentProfile)}
          className="mt-10 bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl mx-auto flex flex-wrap gap-6"
        >
          {/* Each input block */}
          <div className="w-full md:w-[45%]">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              Enter First Name
            </label>
            <input
              {...register("firstName", { required: true })}
              type="text"
              id="firstName"
              className="w-full bg-blue-50 rounded-md border border-gray-300 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-full md:w-[45%]">
            <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-1">
              Enter Middle Name
            </label>
            <input
              {...register("middleName")}
              type="text"
              id="middleName"
              className="w-full bg-blue-50 rounded-md border border-gray-300 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-full md:w-[45%]">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Enter Last Name
            </label>
            <input
              {...register("lastName", { required: true })}
              type="text"
              id="lastName"
              className="w-full bg-blue-50 rounded-md border border-gray-300 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-full md:w-[45%]">
            <label htmlFor="enrollmentNo" className="block text-sm font-medium text-gray-700 mb-1">
              Enrollment No
            </label>
            <input
              {...register("enrollmentNo")}
              disabled
              type="number"
              id="enrollmentNo"
              className="w-full bg-blue-50 rounded-md border border-gray-300 px-3 py-2 text-base outline-none"
            />
          </div>

          <div className="w-full md:w-[45%]">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Enter Email
            </label>
            <input
              {...register("email", { required: true })}
              type="email"
              id="email"
              className="w-full bg-blue-50 rounded-md border border-gray-300 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-full md:w-[45%]">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Enter Phone Number
            </label>
            <input
              {...register("phoneNumber", { required: true })}
              type="number"
              id="phoneNumber"
              className="w-full bg-blue-50 rounded-md border border-gray-300 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-full md:w-[45%]">
            <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
              Semester
            </label>
            <select
              {...register("semester", { required: true })}
              id="semester"
              disabled
              className="w-full bg-blue-50 rounded-md border border-gray-300 px-3 py-2 text-base outline-none"
            >
              <option value="">-- Select --</option>
              {[...Array(8)].map((_, i) => (
                <option value={i + 1} key={i + 1}>
                  {i + 1} Semester
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-[45%]">
            <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
              Branch
            </label>
            <select
              {...register("branch", { required: true })}
              id="branch"
              disabled={branchLoading || loading}
              className="w-full bg-blue-50 rounded-md border border-gray-300 px-3 py-2 text-base outline-none"
            >
              <option value="">-- Select --</option>
              {branch?.length > 0 ? (
                branch.map((b) => (
                  <option key={b.name} value={b.name}>
                    {b.name}
                  </option>
                ))
              ) : (
                <option disabled>No branches available</option>
              )}
            </select>
          </div>

          <div className="w-full md:w-[45%]">
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              {...register("gender", { required: true })}
              id="gender"
              className="w-full bg-blue-50 rounded-md border border-gray-300 px-3 py-2 text-base outline-none"
            >
              <option value="">-- Select --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="w-full md:w-[45%]">
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
              Select New Profile
            </label>
            <label
              htmlFor="file"
              className="w-full bg-blue-50 rounded-md border border-gray-300 px-3 py-2 text-base flex justify-center items-center cursor-pointer hover:bg-blue-100"
            >
              Upload <FiUpload className="ml-2" />
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
            <div className="w-full flex justify-center items-center mt-4">
              <img
                src={previewImage}
                alt="student"
                className="h-36 rounded-md object-cover"
              />
            </div>
          )}

          <div className="w-full flex justify-center mt-6">
            <button
              type="submit"
              className="bg-blue-600 px-8 py-3 rounded-md text-white font-semibold hover:bg-blue-700 transition-colors"
              disabled={loading}
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
