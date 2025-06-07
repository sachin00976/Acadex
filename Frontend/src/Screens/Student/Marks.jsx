import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import Heading from "../../components/Heading";
// import { baseApiURL } from "../../baseUrl";

const Marks = () => {
  const userData = useSelector((state) => state.auth.user);
  const [internal, setInternal] = useState();
  const [external, setExternal] = useState();
  // console.log(userData.enrollmentNo);
  useEffect(() => {
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .post(
        `/api/v1//marks/getMarks`,
        { enrollmentNo: userData.enrollmentNo },
        {
          headers: headers,
        }
      )
      .then((response) => {
        console.log(response.data)
        if (response.data.data.length !== 0) {
          setInternal(response.data.data[0].internal);
          setExternal(response.data.data[0].external);
        }
      })
      .catch((error) => {
        toast.dismiss();
        console.log(error);
      });
  }, [userData.enrollmentNo]);
  return (
    <div className="w-full max-w-6xl mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <Heading title={`Marks of Semester ${userData.semester}`} />
      <div className="mt-14 w-full flex gap-20">
        {internal && (
          <div className="w-1/2 shadow-md p-4">
            <p className="border-b-2 border-red-500 text-2xl font-semibold pb-2">
              Internal Marks (Out of 40)
            </p>
            <div className="mt-5">
              {Object.keys(internal).map((item, index) => {
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center w-full text-lg mt-2"
                  >
                    <p className="w-full">{item}</p>
                    <span>{internal[item]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {external && (
          <div className="w-1/2 shadow-md p-4">
            <p className="border-b-2 border-red-500 text-2xl font-semibold pb-2">
              External Marks (Out of 60)
            </p>
            <div className="mt-5">
              {Object.keys(external).map((item, index) => {
                console.log(external);
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center w-full text-lg mt-2"
                  >
                    <p className="w-full">{item}</p>
                    <span>{external[item]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {!internal && !external && <p>No Marks Available At The Moment!</p>}
      </div>
    </div>
  );
};
export default Marks
