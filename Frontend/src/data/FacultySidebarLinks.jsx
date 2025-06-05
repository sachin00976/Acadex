import React from "react";
import { useSelector } from "react-redux";

const FacultySidebarLinks = () => {
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.role);
  
  const uniqueId =
    role === "faculty"
      ? user?.employeeId
      : null;

  const links = [
    {
      id: 1,
      name: "My Profile",
      path: `/faculty/profile/${uniqueId}`,
      type: "faculty",
    },
    {
      id: 2,
      name: "Student Info",
      path: `/faculty/studentinfo/${uniqueId}`,
      type: "faculty",
    },
    {
      id: 3,
      name: "Update Marks",
      path: `/faculty/uploadmarks/${uniqueId}`,
      type: "faculty",
    },
    {
      id: 4,
      name: "Time Table",
      path: `/faculty/timetable/${uniqueId}`,
      type: "faculty",
    },
    {
      id: 5,
      name: "Notice",
      path: `/faculty/notice/${uniqueId}`,
      type: "faculty",
    },
    {
      id: 6,
      name: "Material",
      path: `/faculty/material/${uniqueId}`,
      type: "faculty",
    },
    {
      id: 7,
      name: "Chat",
      path: `/faculty/chat/${uniqueId}`,
      type: "faculty",
    },
  ];

  return links;
};

export default FacultySidebarLinks;
