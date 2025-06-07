import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import Heading from "./Heading";
import { IoAddOutline } from "react-icons/io5";
import { MdDeleteOutline, MdEditNote } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";
import { IoMdLink } from "react-icons/io";
import { HiOutlineCalendar } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const formatDate = (dateStr) => {
  const [date, time] = dateStr.split("T");
  const [y, m, d] = date.split("-");
  return `${d}/${m}/${y} ${time.split(".")[0]}`;
};

const Notice = () => {
  const userData = useSelector((state) => state.auth.user);
  const router = useLocation();
  const [notice, setNotice] = useState([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      link: "",
      type: "student",
    },
  });

  const isAdminOrFaculty =
    router.pathname.startsWith("/admin") || router.pathname.startsWith("/faculty");

  const onSubmit = (formData) => {
    edit ? updateNoticehandler(formData) : addNoticehandler(formData);
  };

  const getNoticeHandler = () => {
    const typeList =
      router.pathname.replace("/", "") === "student"
        ? ["student", "both"]
        : ["student", "both", "faculty"];

    axios
      .get(`/api/v1/notice/getNotice`, {
        headers: { "Content-Type": "application/json" },
        params: { type: typeList },
      })
      .then((res) => {
        res.data.success
          ? setNotice(res.data.data)
          : toast.error(res.data.message);
      })
      .catch((err) =>
        toast.error(err?.response?.data?.message || "Failed to fetch notices")
      );
  };

  useEffect(() => {
    getNoticeHandler();
  }, [router.pathname]);

  const addNoticehandler = (formData) => {
    toast.loading("Adding Notice...");
    axios
      .post(`/api/v1/notice/addNotice`, formData)
      .then((res) => {
        toast.dismiss();
        res.data.success
          ? (toast.success(res.data.message),
            getNoticeHandler(),
            setOpen(false),
            reset())
          : toast.error(res.data.message);
      })
      .catch((err) =>
        toast.error(err?.response?.data?.message || "Failed to add notice")
      );
  };

  const deleteNoticehandler = (id) => {
    toast.loading("Deleting...");
    axios
      .delete(`/api/v1/notice/deleteNotice/${id}`)
      .then((res) => {
        toast.dismiss();
        res.data.success
          ? (toast.success(res.data.message), getNoticeHandler())
          : toast.error(res.data.message);
      })
      .catch((err) =>
        toast.error(err?.response?.data?.message || "Failed to delete notice")
      );
  };

  const updateNoticehandler = (formData) => {
    toast.loading("Updating...");
    axios
      .put(`/api/v1/notice/updateNotice/${id}`, formData)
      .then((res) => {
        toast.dismiss();
        res.data.success
          ? (toast.success(res.data.message),
            getNoticeHandler(),
            setOpen(false),
            setEdit(false),
            reset())
          : toast.error(res.data.message);
      })
      .catch((err) =>
        toast.error(err?.response?.data?.message || "Failed to update notice")
      );
  };

  const setOpenEditSectionHandler = (index) => {
    setEdit(true);
    setOpen(true);
    const selected = notice[index];
    setId(selected._id);
    reset(selected);
  };

  const openHandler = () => {
    setOpen(!open);
    setEdit(false);
    reset();
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col my-10 px-4">
      <div className="relative flex justify-between items-center mb-6">
        <Heading title="Notices" />
        {isAdminOrFaculty && (
          <button
            className="flex items-center border-2 border-blue-500 text-blue-500 px-4 py-2 rounded-md hover:bg-blue-50 transition"
            onClick={openHandler}
          >
            {open ? (
              <>
                <BiArrowBack className="mr-2 text-xl" />
                Close
              </>
            ) : (
              <>
                Add Notice
                <IoAddOutline className="ml-2 text-xl" />
              </>
            )}
          </button>
        )}
      </div>

      {!open && (
        <div className="space-y-4">
          {notice
            .filter((item) => {
              if (userData?.enrollmentNo) {
                return item.type === "both" || item.type === "student";
              } else if (userData?.employeeId) {
                return true;
              }
              return false;
            })
            .map((item, index) => (
              <div
                key={item._id}
                className="relative p-5 border-2 border-blue-200 rounded-lg bg-white shadow hover:shadow-md transition group"
              >
                {isAdminOrFaculty && (
                  <div className="absolute right-4 bottom-3 flex items-center space-x-3">
                    <span className="text-sm bg-blue-500 text-white px-3 py-1 rounded-full">
                      {item.type}
                    </span>
                    <MdDeleteOutline
                      className="text-xl text-red-500 cursor-pointer hover:scale-110"
                      onClick={() => deleteNoticehandler(item._id)}
                    />
                    <MdEditNote
                      className="text-xl text-blue-500 cursor-pointer hover:scale-110"
                      onClick={() => setOpenEditSectionHandler(index)}
                    />
                  </div>
                )}
                <h3
                  className={`text-lg font-semibold flex items-center ${
                    item.link && "cursor-pointer text-blue-700 hover:underline"
                  }`}
                  onClick={() => item.link && window.open(item.link)}
                >
                  {item.title}
                  {item.link && <IoMdLink className="ml-1 text-xl" />}
                </h3>
                <p className="text-sm mt-2 text-gray-700">{item.description}</p>
                <p className="text-sm text-gray-500 mt-2 flex items-center">
                  <HiOutlineCalendar className="mr-1" />
                  {formatDate(item.createdAt)}
                </p>
              </div>
            ))}
        </div>
      )}

      {open && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white border border-blue-300 p-6 rounded-lg w-full max-w-xl mt-6 shadow-md"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                className="w-full mt-1 px-4 py-2 bg-blue-50 border rounded"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="w-full mt-1 px-4 py-2 bg-blue-50 border rounded resize-none"
                {...register("description")}
              />
            </div>

            <div>
              <label
                htmlFor="link"
                className="block text-sm font-medium text-gray-700"
              >
                Link (optional)
              </label>
              <input
                id="link"
                type="text"
                className="w-full mt-1 px-4 py-2 bg-blue-50 border rounded"
                {...register("link")}
              />
            </div>

            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700"
              >
                Type
              </label>
              <select
                id="type"
                className="w-full mt-1 px-4 py-2 bg-blue-50 border rounded"
                {...register("type")}
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="both">Both</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 mt-4 rounded hover:bg-blue-700 transition"
            >
              {edit ? "Update Notice" : "Add Notice"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Notice;