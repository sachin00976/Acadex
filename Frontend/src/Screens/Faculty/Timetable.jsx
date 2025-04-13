import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FiUpload } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import toast from "react-hot-toast";
import Heading from "../../components/Heading";

const Timetable = () => {
  const [branches, setBranches] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [file, setFile] = useState(null);
  const [fileSizeError, setFileSizeError] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    axios
      .get(`/api/v1/branch/getBranch`)
      .then((response) => {
        if (response.data.success) {
          setBranches(response.data.data);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(() => {
        toast.error("Error fetching branches");
      });
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > 2 * 1024 * 1024) {
      setFileSizeError(true);
      toast.error("File size should be less than 2MB");
      return;
    } else {
      setFileSizeError(false);
    }

    setFile(selectedFile);
    setValue("timetable", selectedFile);

    if (selectedFile.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl("");
    }
  };

  const onRemoveImage = () => {
    setFile(null);
    setPreviewUrl("");
  };

  const onSubmit = async (data) => {
    if (!file) {
      toast.error("Please select a timetable file.");
      return;
    }

    const formData = new FormData();
    formData.append("branch", data.branch);
    formData.append("semester", data.semester);
    formData.append("timetable", file);

    toast.loading("Uploading timetable...");
    try {
      const response = await axios.post(`/api/v1/timetable/addTimetable`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.dismiss();
      if (response.data.success) {
        toast.success(response.data.message);
        reset();
        setFile(null);
        setPreviewUrl("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 mb-14 px-4">
      <Heading title="Upload Timetable" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md mt-6"
      >
        <div className="flex flex-col items-center gap-4">
          <select
            className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md bg-gray-50"
            {...register("branch", { required: "Branch is required" })}
          >
            <option value="">-- Select Branch --</option>
            {branches.map((b) => (
              <option key={b.name} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
          {errors.branch && <p className="text-red-500 text-sm">{errors.branch.message}</p>}

          <select
            className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md bg-gray-50"
            {...register("semester", { required: "Semester is required" })}
          >
            <option value="">-- Select Semester --</option>
            {[...Array(8)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} Semester
              </option>
            ))}
          </select>
          {errors.semester && <p className="text-red-500 text-sm">{errors.semester.message}</p>}

          {!previewUrl && (
            <label
              htmlFor="upload"
              className="w-full text-sm flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-700 cursor-pointer"
            >
              <FiUpload className="text-base" />
              Select Timetable File
            </label>
          )}

          <input
            id="upload"
            type="file"
            accept=".pdf, .xlsx, .xls, image/*"
            hidden
            onChange={handleFileChange}
          />

          {errors.timetable && (
            <p className="text-red-500 text-sm">{errors.timetable.message}</p>
          )}

        {file && (
          <div className="relative w-full flex flex-col items-center gap-2">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="timetable preview"
                className="w-full max-w-sm rounded-md border shadow"
              />
            ) : (
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md w-full max-w-sm border shadow">
                <FiUpload className="text-blue-500" />
                <span className="text-sm text-gray-800 truncate">{file.name}</span>
              </div>
            )}
            <button
              type="button"
              onClick={onRemoveImage}
              className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100"
            >
              <AiOutlineClose className="text-red-600 text-sm" />
            </button>
          </div>
        )}

          <p className="text-xs text-gray-500 -mt-2">
            * Max file size: 2MB. Accepted formats: .pdf, .xlsx, .xls, images.
          </p>
          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-md transition"
          >
            Upload
          </button>

          {fileSizeError && (
            <p className="text-sm text-red-500 mt-2">File size should be less than 2MB</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Timetable;
