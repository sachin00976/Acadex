import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import toast from 'react-hot-toast';
import axios from 'axios';
import Heading from './Heading'
import { IoAddOutline } from "react-icons/io5";
import { MdDeleteOutline, MdEditNote } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";
import { IoMdLink } from "react-icons/io";
import { HiOutlineCalendar } from "react-icons/hi";
import { useForm } from "react-hook-form";

const Notice = () => {
    const router = useLocation();
    const [notice, setNotice] = useState("");
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [id, setId] = useState("");
    const [data, setData] = useState({
        title: "",
        description: "",
        type: "student",
        link: "",
    });

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

    const onSubmit = (formData) => {
        if (edit) {
            updateNoticehandler(formData);
        } else {
            addNoticehandler(formData);
        }
    };

    const getNoticeHandler = () => {
        let data = {};
        if (router.pathname.replace("/", "") === "student") {
            data = {
                type: ["student", "both"],
            };
        } else {
            data = {
                type: ["student", "both", "faculty"],
            };
        }
        const headers = {
            "Content-Type": "application/json",
        };
        axios.get(`/api/v1/notice/getNotice`, {
            headers: headers,
            params: data,
        })
            .then((response) => {
                if (response.data.success) {
                    setNotice(response.data.data);
                } else {
                    toast.error(response.data.message);
                }
            })
            .catch((error) => {
                toast.dismiss();
                toast.error(error?.response?.data?.message || "Failed to fetch notices");
            });
    };

    useEffect(() => {
        getNoticeHandler();
    }, [router.pathname]);

    const addNoticehandler = (formData) => {
        toast.loading("Adding Notice");
        const headers = {
            "Content-Type": "application/json",
        };
        axios.post(`/api/v1/notice/addNotice`, formData, {
            headers: headers,
        })
            .then((response) => {
                toast.dismiss();
                if (response.data.success) {
                    toast.success(response.data.message);
                    getNoticeHandler();
                    setOpen(false);
                    reset();
                } else {
                    toast.error(response.data.message);
                }
            })
            .catch((error) => {
                toast.dismiss();
                toast.error(error?.response?.data?.message || "Failed to add notice");
            });
    };

    const deleteNoticehandler = (id) => {
        toast.loading("Deleting Notice");
        const headers = {
            "Content-Type": "application/json",
        };
        axios
            .delete(`/api/v1/deleteNotice/${id}`, { headers: headers })
            .then((response) => {
                toast.dismiss();
                if (response.data.success) {
                    toast.success(response.data.message);
                    getNoticeHandler();
                } else {
                    toast.error(response.data.message);
                }
            })
            .catch((error) => {
                toast.dismiss();
                toast.error(error?.response?.data?.message || "Failed to delete notice");
            });
    };

    const updateNoticehandler = (formData) => {
        toast.loading("Updating Notice");
        const headers = {
            "Content-Type": "application/json",
        };
        axios
            .put(`/api/v1/updateNotice/${id}`, formData, {
                headers: headers,
            })
            .then((response) => {
                toast.dismiss();
                if (response.data.success) {
                    toast.success(response.data.message);
                    getNoticeHandler();
                    setOpen(false);
                    setEdit(false);
                    reset();
                } else {
                    toast.error(response.data.message);
                }
            })
            .catch((error) => {
                toast.dismiss();
                toast.error(error?.response?.data?.message || "Failed to update notice");
            });
    };

    const setOpenEditSectionHandler = (index) => {
        setEdit(true);
        setOpen(true);
        const selected = notice[index];
        setId(selected._id);
        reset({
            title: selected.title,
            description: selected.description,
            link: selected.link,
            type: selected.type,
        });
    };

    const openHandler = () => {
        setOpen(!open);
        setEdit(false);
        setData({ title: "", description: "", type: "student", link: "" });
        reset();
    };

    return (
        <div className="w-full mx-auto flex justify-center items-start flex-col my-10">
            <div className="relative flex justify-between items-center w-full">
                <Heading title="Notices" />
                {(router.pathname === "/faculty" || router.pathname === "/admin") &&
                    (open ? (
                        <button className="absolute right-2 flex justify-center items-center border-2 border-red-500 px-3 py-2 rounded text-red-500"
                            onClick={openHandler}>
                            <span className='mr-2'>
                                <BiArrowBack className='text-red-500' />
                            </span>
                            Close
                        </button>
                    ) : (
                        <button className="absolute right-2 flex justify-center items-center border-2 border-red-500 px-3 py-2 rounded text-red-500"
                            onClick={openHandler}>
                            Add Notice
                            <span className="ml-2">
                                <IoAddOutline className="text-red-500 text-xl" />
                            </span>
                        </button>
                    ))
                }
            </div>

            {!open && (
                <div className="mt-8 w-full">
                    {notice && notice.map((item, index) => (
                        <div key={item._id} className="border-blue-500 border-2 w-full rounded-md shadow-sm py-4 px-6 mb-4 relative">
                            {(router.pathname === "/faculty" || router.pathname === "/admin") && (
                                <div className="absolute flex justify-center items-center right-4 bottom-3">
                                    <span className="text-sm bg-blue-500 px-4 py-1 text-white rounded-full">
                                        {item.type}
                                    </span>
                                    <span className="text-2xl group-hover:text-blue-500 ml-2 cursor-pointer hover:text-red-500"
                                        onClick={() => deleteNoticehandler(item._id)}
                                    >
                                        <MdDeleteOutline />
                                    </span>
                                    <span className="text-2xl group-hover:text-blue-500 ml-2 cursor-pointer hover:text-blue-500"
                                        onClick={() => setOpenEditSectionHandler(index)}
                                    >
                                        <MdEditNote />
                                    </span>
                                </div>
                            )}
                            <p className={`text-xl font-medium flex justify-start items-center ${
                                item.link && "cursor-pointer"
                                } group`}
                                onClick={() => item.link && window.open(item.link)}
                            >
                                {item.title}
                                {item.link && (
                                    <span className="text-2xl group-hover:text-blue-500 ml-1">
                                        <IoMdLink />
                                    </span>
                                )}
                            </p>
                            <p className="text-sm absolute top-4 right-4 flex justify-center items-center">
                                <span>
                                    <HiOutlineCalendar />
                                </span>
                                {item.createdAt.split("T")[0].split("-")[2] +
                                    "/" +
                                    item.createdAt.split("T")[0].split("-")[1] +
                                    "/" +
                                    item.createdAt.split("T")[0].split("-")[0] +
                                    " " +
                                    item.createdAt.split("T")[1].split(".")[0]}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {open && (
                <form className="mt-8 w-full" onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-[40%] mt-4">
                        <label htmlFor="title">Notice Title</label>
                        <input
                            type="text"
                            id="title"
                            className="bg-blue-50 py-2 px-4 w-full mt-1"
                            {...register("title", { required: "Title is required" })}
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                        )}
                    </div>

                    <div className="w-[40%] mt-4">
                        <label htmlFor="description">Notice Description</label>
                        <textarea
                            id="description"
                            cols="30"
                            rows="4"
                            className="bg-blue-50 py-2 px-4 w-full mt-1 resize-none"
                            {...register("description")}
                        ></textarea>
                    </div>

                    <div className="w-[40%] mt-4">
                        <label htmlFor="link">Notice Link (If any else leave blank)</label>
                        <input
                            type="text"
                            id="link"
                            className="bg-blue-50 py-2 px-4 w-full mt-1"
                            {...register("link")}
                        />
                    </div>

                    <div className="w-[40%] mt-4">
                        <label htmlFor="type">Type Of Notice</label>
                        <select
                            id="type"
                            className="px-2 bg-blue-50 py-3 rounded-sm text-base w-[80%] accent-blue-700 mt-4"
                            {...register("type")}
                        >
                            <option value="student">Student</option>
                            <option value="faculty">Faculty</option>
                            <option value="both">Both</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white mt-6 px-6 rounded text-lg py-2 hover:bg-blue-600"
                    >
                        {edit ? "Update Notice" : "Add Notice"}
                    </button>
                </form>
            )}
        </div>
    );
};

export default Notice;
