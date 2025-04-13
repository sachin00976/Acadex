import axios from "axios";
import React, { useEffect, useState } from "react";
import Heading from "../../components/Heading";
import { IoMdLink } from "react-icons/io";
import { HiOutlineCalendar, HiOutlineSearch } from "react-icons/hi";
import toast from "react-hot-toast";
import { baseApiURL } from "../../baseUrl";
const Material = () => {
  const [subject, setSubject] = useState();
  const [selected, setSelected] = useState();
  const [material, setMaterial] = useState([]);
  useEffect(() => {
    toast.loading("Loading Subjects");
    axios
      .get(`${baseApiURL()}/subject/getSubject`)
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

  const getSubjectMaterial = () => {
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .post(
        `${baseApiURL()}/material/getMaterial`,
        { subject: selected },
        { headers }
      )
      .then((response) => {
        if (response.data.success) {
          setMaterial(response.data.material);
        } else {
          // Error
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onSelectChangeHandler = (e) => {
    setMaterial();
    setSelected(e.target.value);
  };
}

export default Material
