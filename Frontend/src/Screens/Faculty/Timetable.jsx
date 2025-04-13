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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    axios
      .get(`${baseApiURL()}/branch/getBranch`)
      .then((response) => {
        if (response.data.success) {
          setBranches(response.data.branches);
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
    setFile(selectedFile);
    setValue("timetable", selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
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
      const response = await axios.post(
        `${baseApiURL()}/timetable/addTimetable`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
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
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <Heading title="Upload Timetable" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex justify-evenly items-center mt-12"
      >
        <div className="w-1/2 flex flex-col justify-center items-center">
          <p className="mb-4 text-xl font-medium">Add Timetable</p>

          <select
            className="px-2 bg-blue-50 py-3 rounded-sm text-base w-[80%] mt-4"
            {...register("branch", { required: "Branch is required" })}
          >
            <option value="">-- Select Branch --</option>
            {branches.map((b) => (
              <option key={b.name} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
          {errors.branch && (
            <span className="text-red-500 mt-1">{errors.branch.message}</span>
          )}

          <select
            className="px-2 bg-blue-50 py-3 rounded-sm text-base w-[80%] mt-4"
            {...register("semester", { required: "Semester is required" })}
          >
            <option value="">-- Select Semester --</option>
            {[...Array(8)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} Semester
              </option>
            ))}
          </select>
          {errors.semester && (
            <span className="text-red-500 mt-1">
              {errors.semester.message}
            </span>
          )}

          {!previewUrl && (
            <label
              htmlFor="upload"
              className="px-2 bg-blue-50 py-3 rounded-sm text-base w-[80%] mt-4 flex justify-center items-center cursor-pointer"
            >
              Select Timetable
              <FiUpload className="ml-2" />
            </label>
          )}

          <input
            id="upload"
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
          {errors.timetable && (
            <span className="text-red-500 mt-1">
              {errors.timetable.message}
            </span>
          )}

          {previewUrl && (
            <p
              className="px-2 border-2 border-blue-500 py-2 rounded text-base w-[80%] mt-4 flex justify-center items-center cursor-pointer"
              onClick={() => {
                setFile(null);
                setPreviewUrl("");
              }}
            >
              Remove Selected Timetable
              <AiOutlineClose className="ml-2" />
            </p>
          )}

          <button
            type="submit"
            className="bg-blue-500 text-white mt-8 px-4 py-2 rounded-sm"
          >
            Add Timetable
          </button>

          {previewUrl && (
            <img
              src={previewUrl}
              alt="timetable preview"
              className="mt-6 w-[80%] rounded border"
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default Timetable;
