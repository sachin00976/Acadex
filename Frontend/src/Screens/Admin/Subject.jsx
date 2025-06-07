import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Heading from "../../components/Heading";
import { MdOutlineDelete } from "react-icons/md";

const Subjects = () => {
  const [data, setData] = useState({
    name: "",
    code: "",
  });
  const [selected, setSelected] = useState("add");
  const [subject, setSubject] = useState();

  useEffect(() => {
    getSubjectHandler();
  }, []);

  const getSubjectHandler = () => {
    axios
      .get(`/api/v1/subject/getSubject`)
      .then((response) => {
        if (response.data.success) {
          setSubject(response.data.data);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const addSubjectHandler = () => {
    toast.loading("Adding Subject");
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .post(`/api/v1/subject/addSubject`, data, {
        headers: headers,
      })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          setData({ name: "", code: "" });
          getSubjectHandler();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response.data.message);
      });
  };

  const deleteSubjectHandler = (id) => {
    toast.loading("Deleting Subject");
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .delete(`/api/v1/subject/deleteSubject/${id}`, {
        headers: headers,
      })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          getSubjectHandler();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="max-w-6xl w-full mx-auto mt-10 mb-10 flex flex-col items-center">
      <div className="flex justify-between items-center w-full mb-8">
        <Heading title="Manage Subjects" />
        <div className="flex space-x-6">
          <button
            className={`${
              selected === "add"
                ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
                : "text-gray-700 hover:text-blue-500"
            } px-4 py-2 rounded-sm transition-colors duration-200`}
            onClick={() => setSelected("add")}
          >
            Add Subject
          </button>
          <button
            className={`${
              selected === "view"
                ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
                : "text-gray-700 hover:text-blue-500"
            } px-4 py-2 rounded-sm transition-colors duration-200`}
            onClick={() => setSelected("view")}
          >
            View Subjects
          </button>
        </div>
      </div>

      {selected === "add" && (
        <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter Subject Code
            </label>
            <input
              type="number"
              id="code"
              value={data.code}
              onChange={(e) => setData({ ...data, code: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="e.g. 101"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter Subject Name
            </label>
            <input
              type="text"
              id="name"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="e.g. Mathematics"
            />
          </div>
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-colors"
            onClick={addSubjectHandler}
          >
            Add Subject
          </button>
        </div>
      )}

      {selected === "view" && (
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
          {subject && subject.length === 0 ? (
            <p className="text-gray-600 text-center text-lg font-medium">
              No subjects found.
            </p>
          ) : (
            <ul className="space-y-4">
              {subject &&
                subject.map((item) => (
                  <li
                    key={item.code}
                    className="flex justify-between items-center bg-blue-50 rounded-md px-6 py-3 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span className="text-gray-800 font-medium">
                      {item.code} - {item.name}
                    </span>
                    <button
                      className="text-red-600 hover:text-red-800 text-2xl"
                      onClick={() => deleteSubjectHandler(item._id)}
                      aria-label={`Delete subject ${item.name}`}
                    >
                      <MdOutlineDelete />
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Subjects;
