import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";
import Heading from "../../components/Heading";
import { AiOutlineClose } from "react-icons/ai";
import toast from "react-hot-toast";
import { baseApiURL } from "../../baseUrl";
const Timetable = () => {
  const [addselected, setAddSelected] = useState({
    branch: "",
    semester: "",
  });
  const [file, setFile] = useState();
  const [branch, setBranch] = useState();
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    getBranchData();
  }, []);

  const getBranchData = () => {
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .get(`${baseApiURL()}/branch/getBranch`, { headers })
      .then((response) => {
        if (response.data.success) {
          setBranch(response.data.branches);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.message);
      });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const imageUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(imageUrl);
  };

  const addTimetableHandler = () => {
    toast.loading("Adding Timetable");
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    const formData = new FormData();
    formData.append("branch", addselected.branch);
    formData.append("semester", addselected.semester);
    formData.append("type", "timetable");
    formData.append("timetable", file);
    axios
      .post(`${baseApiURL()}/timetable/addTimetable`, formData, {
        headers: headers,
      })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          setAddSelected({
            branch: "",
            semester: "",
          });
          setFile("");
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        console.log("FIle error", error);

        toast.error(error.response.data.message);
      });
  };}
export default Timetable
