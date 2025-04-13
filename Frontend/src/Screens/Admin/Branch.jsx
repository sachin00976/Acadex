import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Heading from "../../components/Heading";
import { MdOutlineDelete } from "react-icons/md";

const Branch = () => {
  const [data, setData] = useState({ name: "" });
  const [selected, setSelected] = useState("add");
  const [branch, setBranch] = useState();

  useEffect(() => {
    getBranchHandler();
  }, []);

  const getBranchHandler = async () => {
    try {
      const response = await axios.get(`/api/v1/branch/getBranch`);
      if (response.data.success) {
        setBranch(response.data.data);
      } else {
        // setTimeout(()=>{
        //   toast.error(response.data.message);
        // },2000)
      }
    } catch (error) {
      // setTimeout(()=>{
      //   toast.error(response.data.message);
      // },2000)
    }
  };

  const addBranchHandler = async () => {
    const toastId = toast.loading("Adding Branch...");
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await axios.post(`/api/v1/branch/addBranch`, data, { headers });
      toast.dismiss(toastId);
      if (response.data.success) {
        toast.success(response.data.message);
        setData({ name: "", code: "" });
        getBranchHandler();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const deleteBranchHandler = async (id) => {
    const confirm = prompt("Are You Sure? Type CONFIRM to continue");
    if (confirm !== "CONFIRM") return;

    const toastId = toast.loading("Deleting Branch...");
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await axios.delete(`/api/v1/branch/deleteBranch/${id}`, { headers });
      toast.dismiss(toastId);
      if (response.data.success) {
        toast.success(response.data.message);
        
        getBranchHandler();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <div className="flex justify-between items-center w-full">
        <Heading title="Add Branch" />
        <div className="flex justify-end items-center w-full">
          <button
            className={`${
              selected === "add" && "border-b-2"
            } border-blue-500 px-4 py-2 text-black rounded-sm mr-6`}
            onClick={() => setSelected("add")}
          >
            Add Branch
          </button>
          <button
            className={`${
              selected === "view" && "border-b-2"
            } border-blue-500 px-4 py-2 text-black rounded-sm`}
            onClick={() => setSelected("view")}
          >
            View Branch
          </button>
        </div>
      </div>

      {selected === "add" && (
        <div className="flex flex-col justify-center items-center w-full mt-8">
          <div className="w-[40%]">
            <label htmlFor="name" className="leading-7 text-sm">
              Enter Branch Name
            </label>
            <input
              type="text"
              id="name"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <button
            className="mt-6 bg-blue-500 px-6 py-3 text-white"
            onClick={addBranchHandler}
          >
            Add Branch
          </button>
        </div>
      )}

      {selected === "view" && (
        <div className="mt-8 w-full">
          <ul>
            {branch &&
              branch.map((item, index) => (
                <li
                  key={index}
                  className="bg-blue-100 py-3 px-6 mb-3 flex justify-between items-center w-[70%]"
                >
                  <div>{item.name}</div>
                  <button
                    className="text-2xl hover:text-red-500"
                    onClick={() => deleteBranchHandler(item._id)}
                  >
                    <MdOutlineDelete />
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Branch;
