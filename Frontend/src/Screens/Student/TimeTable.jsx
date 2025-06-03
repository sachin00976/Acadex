import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import Heading from "../../components/Heading";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
// import { baseApiURL } from "../../baseUrl";
const Timetable = () => {
  const [timetable, setTimetable] = useState("");
  const userData = useSelector((state) => state.auth.user);
  //   console.log(userData)

  useEffect(() => {
    const getTimetable = () => {
      const headers = {
        "Content-Type": "application/json",
      };
      axios
        .get(
          `/api/v1/timetable/getTimetable`,
          { semester: userData.semester, branch: userData.branch },
          {
            headers: headers,
          }
        )
        .then((response) => {
        //   console.log(response.data.data);
          const allTimetables = response.data.data; // assuming API returns { data: [...] }
          const matched = allTimetables
            .filter(
              (item) =>
                item.semester === userData.semester &&
                item.branch === userData.branch
            )
            .at(-1); // get the last matching one

          if (matched) {
            setTimetable(matched.link);
          }
        })
        .catch((error) => {
          toast.dismiss();
          console.log(error);
        });
    };
    userData && getTimetable();
  }, [userData, userData.branch, userData.semester]);
//   console.log(timetable)
  return (
    <div className="w-full max-w-6xl mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <div className="flex justify-between items-center w-full">
        <Heading title={`Timetable of Semester ${userData.semester}`} />
        {timetable && (
          <p
            className="flex justify-center items-center text-lg font-medium cursor-pointer hover:text-red-500 hover:scale-110 ease-linear transition-all duration-200 hover:duration-200 hover:ease-linear hover:transition-all"
            onClick={() =>
              window.open(timetable.url)
            }
          >
            Download
            <span className="ml-2">
              <FiDownload />
            </span>
          </p>
        )}
      </div>
      {timetable && (
        <img
          className="mt-8 rounded-lg shadow-md w-[70%] mx-auto"
          src={timetable?.url}
          alt="timetable"
        />
      )}
      {!timetable && (
        <p className="mt-10">No Timetable Available At The Moment!</p>
      )}
    </div>
  );
};
export default Timetable;