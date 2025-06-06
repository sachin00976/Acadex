// import { useSelector } from "react-redux";

// const user = useSelector((state) => state.auth.user);
// const uniqueId = role === "student" ? user.enrollmentNumber : role === "faculty" ? user.employeeId : role === "admin" ? user.employeeId:null;

// export const student_sidebarLinks = [
//     {
//       id: 1,
//       name: "My Profile",
//       path: `/student/profile/${uniqueId}`,
//       type: "student",
//     },
//     {
//       id: 2,
//       name: "Timetable",
//       path: `/student/timetable/${uniqueId}`,
//       type: "student",
//     },
//     {
//       id: 3,
//       name: "Marks",
//       path: `/student/marks/${uniqueId}`,
//       type: "student",
//     },
//     {
//       id: 4,
//       name: "Material",
//       path: `/student/material/${uniqueId}`,
//       type: "student",
//     },
//     {
//       id: 5,
//       name: "Notice",
//       path: `/student/notice/${uniqueId}`,
//       type: "student",
//     },
//     {
//       id: 6,
//       name: "Chat",
//       path: `/student/chat/${uniqueId}`,
//       type: "student",
//     }

//   ];



//   export const admin_sidebarLinks = [
//     {
//       id: 1,
//       name: "My Profile",
//       path: "/admin/profile",
//       type: "admin",
//     },
//     {
//       id: 2,
//       name: "Student",
//       path: "/admin/addstudent",
//       type: "admin",
//     },
//     {
//       id: 3,
//       name: "Faculty",
//       path: "/admin/addfaculty",
//       type: "admin",
//     },
//     {
//       id: 4,
//       name: "Branch",
//       path: "/admin/branch",
//       type: "admin",
//     },
//     {
//       id: 5,
//       name: "Notice",
//       path: "/admin/notice",
//       type: "admin",
//     },
//     {
//       id: 6,
//       name: "Chat",
//       path: "/admin/chat",
//       type: "admin",
//     },
//     {
//         id: 7,
//         name: "Subject",
//         path: "/admin/subject",
//         type: "admin",
//       },
//       {
//         id: 8,
//         name: "Admin",
//         path: "/admin/addadmin",
//         type: "admin",
//       }

//   ];








import React from "react";
import { useSelector } from "react-redux";

const Student_link = () => {
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.role);

  // console.log("user:  ____",user.enrollmentNo);
  // console.log("role____",role);

  const uniqueId =
    role === "student"
      ? user.enrollmentNo
      : role === "faculty" || role === "admin"
      ? user.employeeId
      : null;

  // console.log("uniqueId____",uniqueId);

  const student_sidebarLinks = [
    {
      id: 1,
      name: "My Profile",
      path: `/student/profile/${uniqueId}`,
      type: "student",
    },
    {
      id: 2,
      name: "Timetable",
      path: `/student/timetable/${uniqueId}`,
      type: "student",
    },
    {
      id: 3,
      name: "Marks",
      path: `/student/marks/${uniqueId}`,
      type: "student",
    },
    {
      id: 4,
      name: "Material",
      path: `/student/material/${uniqueId}`,
      type: "student",
    },
    {
      id: 5,
      name: "Notice",
      path: `/student/notice/${uniqueId}`,
      type: "student",
    },
    {
      id: 6,
      name: "Chat",
      path: `/student/chat/${uniqueId}`,
      type: "student",
    },
  ];

  return student_sidebarLinks;
};

export default Student_link;
