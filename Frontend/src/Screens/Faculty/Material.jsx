import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";
import Heading from "../../components/Heading";
import { AiOutlineClose, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Material = () => {
  const user = useSelector((state) => state.auth.user);
  const fullname = `${user.firstName} ${user.middleName ? user.middleName + ' ' : ''}${user.lastName}`;

  const [subject, setSubject] = useState([]);
  const [file, setFile] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [selected, setSelected] = useState({
    title: "",
    subject: "",
    faculty:
      fullname.split(" ")[0] +
      " " +
      (fullname.split(" ")[2] ? fullname.split(" ")[2] : ""),
  });

  const fetchSubjects = async () => {
    toast.loading("Loading Subjects");
    try {
      const res = await axios.get(`/api/v1/subject/getSubject`);
      toast.dismiss();
      if (res.data.success) {
        setSubject(res.data.data);
      } else toast.error(res.data.message);
    } catch (err) {
      toast.dismiss();
      toast.error(err.message);
    }
  };

  const fetchMaterials = async () => {
    try {
      const res = await axios.post(`/api/v1/material/getMaterial`);
      console.log("from material: ",res.data.data)
      if (res.data.success) setMaterials(res.data.data);
      else toast.error("Failed to fetch materials");
    } catch (err) {
      toast.error("Failed to fetch materials");
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchMaterials();
  }, []);

  const resetForm = () => {
    setSelected({
      title: "",
      subject: "",
      faculty:
        fullname.split(" ")[0] +
        " " +
        (fullname.split(" ")[2] ? fullname.split(" ")[2] : ""),
    });
    setFile(null);
    setEditingId(null);
  };

  const addOrUpdateMaterial = async () => {
    if (!selected.title || !selected.subject || (!file && !editingId)) {
      toast.error("Please fill all fields and upload a file");
      return;
    }

    toast.loading(editingId ? "Updating Material" : "Adding Material");

    const formData = new FormData();
    formData.append("title", selected.title);
    formData.append("subject", selected.subject);
    formData.append("faculty", selected.faculty);
    formData.append("type", "material");
    if (file) formData.append("material", file);

    const url = editingId
      ? `http://localhost:8000/api/v1/material/updateMaterial/${editingId}`
      : `/api/v1/material/addMaterial`;

    try {
      const res = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.dismiss();
      if (res.data.success) {
        toast.success(res.data.message);
        resetForm();
        fetchMaterials();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.dismiss();
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;

    try {
      const res = await axios.delete(`/api/v1/material/deleteMaterial/${id}`);
      if (res.data.success) {
        toast.success("Deleted successfully");
        fetchMaterials();
      } else toast.error("Failed to delete");
    } catch (err) {
      toast.error("Error deleting material");
    }
  };

  const handleEdit = (material) => {
    setEditingId(material._id);
    setSelected({
      title: material.title,
      subject: material.subject,
      faculty: material.faculty,
    });
    setFile(null); // clear old file (will upload new one if needed)
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <Heading title={editingId ? "Update Material" : "Upload Material"} />
      </div>

      <div className="space-y-6">
        {/* Title Input */}
        <div>
          <label className="block mb-2 text-lg font-semibold text-gray-700">
            Material Title
          </label>
          <input
            type="text"
            placeholder="Enter material title"
            className="w-full px-4 py-3 border border-gray-300 rounded-md"
            value={selected.title}
            onChange={(e) =>
              setSelected({ ...selected, title: e.target.value })
            }
          />
        </div>

        {/* Subject Select */}
        <div>
          <label className="block mb-2 text-lg font-semibold text-gray-700">
            Material Subject
          </label>
          <select
            value={selected.subject}
            onChange={(e) =>
              setSelected({ ...selected, subject: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-md"
          >
            <option value="">-- Select Subject --</option>
            {subject.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* File Upload */}
        <div>
          <label
            htmlFor="upload"
            className="inline-flex items-center justify-center cursor-pointer rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 text-white text-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition shadow-md"
            title="Upload Material"
          >
            {editingId ? "Change File (optional)" : "Upload Material"}
            <FiUpload className="ml-3 text-xl" />
          </label>

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
          onClick={addOrUpdateMaterial}
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold py-3 rounded-md hover:from-indigo-700 hover:to-blue-700 transition-shadow shadow-lg"
        >
          {editingId ? "Update Material" : "Add Material"}
        </button>

        {editingId && (
          <button
            onClick={resetForm}
            className="w-full mt-2 bg-gray-300 text-black font-bold py-2 rounded-md hover:bg-gray-400"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {/* Material List */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">All Uploaded Materials</h2>
        {materials.length === 0 ? (
          <p>No materials uploaded yet.</p>
        ) : (
          <ul className="space-y-4">
            {materials.map((mat) => (
              <li
                key={mat._id}
                className="border p-4 rounded-md flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{mat.title}</p>
                  <p className="text-sm text-gray-500">
                    Subject: {mat.subject} | Faculty: {mat.faculty}
                  </p>
                  <a
                    href={`http://localhost:8000/media/${mat.link}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    View Material
                  </a>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleEdit(mat)}
                    className="text-yellow-600 hover:text-yellow-800"
                    title="Edit"
                  >
                    <AiOutlineEdit size={22} />
                  </button>
                  <button
                    onClick={() => handleDelete(mat._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <AiOutlineDelete size={22} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Material;
