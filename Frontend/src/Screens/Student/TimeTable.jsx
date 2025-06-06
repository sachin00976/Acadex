import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import Heading from "../../components/Heading";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const Timetable = () => {
  const [timetable, setTimetable] = useState("");
  const userData = useSelector((state) => state.auth.user);

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
          const allTimetables = response.data.data;
          const matched = allTimetables
            .filter(
              (item) =>
                item.semester === userData.semester &&
                item.branch === userData.branch
            )
            .at(-1);

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

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 px-6 mb-16">
      <div className="flex justify-between items-center w-full flex-wrap gap-4">
        <Heading title={`Timetable of Semester ${userData.semester}`} />
        {timetable && (
          <button
            onClick={() => window.open(timetable.url)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-md"
          >
            <FiDownload className="text-lg" />
            Download
          </button>
        )}
      </div>

      {timetable ? (
  <div className="mt-10 mx-auto w-full max-w-3xl bg-white shadow-xl rounded-xl p-4">
    <img
      className="rounded-lg w-full object-contain"
      src={timetable?.url}
      alt="timetable"
    />
  </div>
) : (
  <p className="mt-12 text-gray-600 text-lg font-medium text-center">
    No Timetable Available At The Moment!
  </p>
)}
    </div>
  );
};

export default Timetable;
