import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";
import Heading from "../../components/Heading";
import { AiOutlineClose } from "react-icons/ai";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Material = () => {
  const userData = useSelector((state) => state.userData);
  const fullname = userData?.fullname || "";

  const [subject, setSubject] = useState([]);
  const [file, setFile] = useState(null);
  const [selected, setSelected] = useState({
    title: "",
    subject: "",
    faculty:
      fullname.split(" ")[0] +
      " " +
      (fullname.split(" ")[2] ? fullname.split(" ")[2] : ""),
  });

  useEffect(() => {
    toast.loading("Loading Subjects");
    axios
      .get(`/api/v1/material/getMaterial`)
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          setSubject(response.data.subject);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.message);
      });
  }, []);

  const addMaterialHandler = () => {
    if (!selected.title || !selected.subject || !file) {
      toast.error("Please fill all fields and upload a file");
      return;
    }

    toast.loading("Adding Material");

    const formData = new FormData();
    formData.append("title", selected.title);
    formData.append("subject", selected.subject);
    formData.append("faculty", selected.faculty);
    formData.append("type", "material");
    formData.append("material", file);

    axios
      .post(`/api/v1/material/addMaterial`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          setSelected({
            title: "",
            subject: "",
            faculty:
              fullname.split(" ")[0] +
              " " +
              (fullname.split(" ")[2] ? fullname.split(" ")[2] : ""),
          });
          setFile(null);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error?.response?.data?.message || error.message);
      });
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <Heading title="Upload Material" />
      </div>

      <div className="space-y-6">
        {/* Title Input */}
        <div>
          <label
            htmlFor="title"
            className="block mb-2 text-lg font-semibold text-gray-700"
          >
            Material Title
          </label>
          <input
            type="text"
            id="title"
            placeholder="Enter material title"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={selected.title}
            onChange={(e) =>
              setSelected({ ...selected, title: e.target.value })
            }
          />
        </div>

        {/* Subject Select */}
        <div>
          <label
            htmlFor="subject"
            className="block mb-2 text-lg font-semibold text-gray-700"
          >
            Material Subject
          </label>
          <select
            value={selected.subject}
            id="subject"
            onChange={(e) =>
              setSelected({ ...selected, subject: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            <option value="">-- Select Subject --</option>
            {subject &&
              subject.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
          </select>
        </div>

        {/* File Upload */}
        <div>
          {!selected.link && (
            <label
              htmlFor="upload"
              className="inline-flex items-center justify-center cursor-pointer rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 text-white text-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition shadow-md"
              title="Upload Material"
            >
              Upload Material
              <FiUpload className="ml-3 text-xl" />
            </label>
          )}

          {selected.link && (
            <p
              className="inline-flex items-center justify-center cursor-pointer rounded-md border-2 border-blue-500 px-6 py-3 text-blue-600 text-lg font-semibold hover:bg-blue-100 transition shadow-sm"
              onClick={() => setSelected({ ...selected, link: "" })}
            >
              Remove Selected Material
              <AiOutlineClose className="ml-3 text-xl" />
            </p>
          )}

          <input
            type="file"
            id="upload"
            hidden
            onChange={(e) => setFile(e.target.files[0])}
          />
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Selected file:{" "}
              <span className="font-medium text-gray-800">{file.name}</span>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={addMaterialHandler}
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold py-3 rounded-md hover:from-indigo-700 hover:to-blue-700 transition-shadow shadow-lg"
        >
          Add Material
        </button>
      </div>
    </div>
  );
};

export default Material;

