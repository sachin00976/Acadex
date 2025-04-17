import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import Heading from "../../components/Heading";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { baseApiURL } from "../../baseUrl";
const Timetable = () => {
  const [timetable, setTimetable] = useState("");
  const userData = useSelector((state) => state.userData);

  useEffect(() => {
    const getTimetable = () => {
      const headers = {
        "Content-Type": "application/json",
      };
      axios
        .get(
          `${baseApiURL()}/timetable/getTimetable`,
          { semester: userData.semester, branch: userData.branch },
          {
            headers: headers,
          }
        )
        .then((response) => {
          if (response.data.length !== 0) {
            setTimetable(response.data[0].link);
          }
        })
        .catch((error) => {
          toast.dismiss();
          console.log(error);
        });
    };
    userData && getTimetable();
  }, [userData, userData.branch, userData.semester]);
}
export default TimeTable
