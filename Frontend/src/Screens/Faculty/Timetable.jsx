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
      .then((res) => {
        if (res.data.success) setBranches(res.data.data);
        else toast.error(res.data.message);
      })
      .catch(() => toast.error("Error fetching branches"));
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.size > 2 * 1024 * 1024) {
      setFileSizeError(true);
      toast.error("File size should be less than 2MB");
      return;
    }

    setFileSizeError(false);
    setFile(selected);
    setValue("timetable", selected);

    if (selected.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(selected));
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
      const res = await axios.post(`/api/v1/timetable/addTimetable`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.dismiss();
      if (res.data.success) {
        toast.success(res.data.message);
        reset();
        setFile(null);
        setPreviewUrl("");
      } else toast.error(res.data.message);
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-10 px-4">
      <Heading title="Upload Timetable" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 bg-white p-6 rounded-xl shadow-xl border border-gray-200 animate-fade-in transition-all duration-200 hover:shadow-2xl"
      >
        <div className="flex flex-col gap-5">

          {/* Branch Selection */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 ml-1">Branch</label>
            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              {...register("branch", { required: "Branch is required" })}
            >
              <option value="">-- Select Branch --</option>
              {branches.map((b) => (
                <option key={b.name} value={b.name}>{b.name}</option>
              ))}
            </select>
            {errors.branch && (
              <p className="text-sm text-red-600 mt-1 ml-1">{errors.branch.message}</p>
            )}
          </div>

          {/* Semester Selection */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 ml-1">Semester</label>
            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              {...register("semester", { required: "Semester is required" })}
            >
              <option value="">-- Select Semester --</option>
              {[...Array(8)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1} Semester</option>
              ))}
            </select>
            {errors.semester && (
              <p className="text-sm text-red-600 mt-1 ml-1">{errors.semester.message}</p>
            )}
          </div>

          {/* Upload Section */}
          <div className="space-y-2">
            {!file && (
              <label
                htmlFor="upload"
                className="flex items-center justify-center w-full gap-2 px-4 py-3 text-blue-600 font-medium bg-blue-50 border-2 border-dashed border-blue-200 hover:bg-blue-100 rounded-lg cursor-pointer transition-all duration-200 hover:border-blue-300"
              >
                <FiUpload className="text-lg" />
                <span>Select Timetable File</span>
              </label>
            )}
            <input
              id="upload"
              type="file"
              accept=".pdf, .xlsx, .xls, image/*"
              hidden
              onChange={handleFileChange}
            />

            {/* File Preview */}
            {file && (
              <div className="relative w-full flex flex-col items-center gap-3">
                {previewUrl ? (
                  <div className="relative w-full max-w-sm">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full rounded-lg border-2 border-gray-200 shadow-md"
                    />
                    <button
                      type="button"
                      onClick={onRemoveImage}
                      className="absolute -top-2 -right-2 bg-white p-1.5 rounded-full shadow-lg hover:bg-gray-100 transition-all"
                      aria-label="Remove file"
                    >
                      <AiOutlineClose className="text-red-600 text-base" />
                    </button>
                  </div>
                ) : (
                  <div className="relative w-full max-w-sm">
                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg w-full border-2 border-gray-200 shadow-sm">
                      <FiUpload className="text-blue-500 text-lg" />
                      <span className="text-sm text-gray-800 font-medium truncate flex-1">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={onRemoveImage}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        aria-label="Remove file"
                      >
                        <AiOutlineClose className="text-base" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* File Instructions */}
            <p className="text-xs text-gray-500 mt-1 ml-1">
              * Max file size: 2MB. Accepted: .pdf, .xls, .xlsx, images.
            </p>
            {errors.timetable && (
              <p className="text-red-600 text-sm mt-1 ml-1">{errors.timetable.message}</p>
            )}
            {fileSizeError && (
              <p className="text-sm text-red-600 mt-1 ml-1">File size should be less than 2MB</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 w-full rounded-lg font-medium hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            Upload Timetable
          </button>
        </div>
      </form>
    </div>
  );
};

export default Timetable;
