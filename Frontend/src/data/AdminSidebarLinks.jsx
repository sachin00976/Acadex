import React from "react";
import { useSelector } from "react-redux";

const AdminSidebarLinks = () => {
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.role);

  const uniqueId = role === "admin" ? user?.employeeId : null;

  const links = [
    {
      id: 1,
      name: "My Profile",
      path: `/admin/profile/${uniqueId}`,
      type: "admin",
    },
    {
      id: 2,
      name: "Student",
      path: `/admin/addstudent/${uniqueId}`,
      type: "admin",
    },
    {
      id: 3,
      name: "Faculty",
      path: `/admin/addfaculty/${uniqueId}`,
      type: "admin",
    },
    {
      id: 4,
      name: "Branch",
      path: `/admin/branch/${uniqueId}`,
      type: "admin",
    },
    {
      id: 5,
      name: "Notice",
      path: `/admin/notice/${uniqueId}`,
      type: "admin",
    },
    {
      id: 6,
      name: "Chat",
      path: `/admin/chat/${uniqueId}`,
      type: "admin",
    },
    {
      id: 7,
      name: "Subject",
      path: `/admin/subject/${uniqueId}`,
      type: "admin",
    },
    {
      id: 8,
      name: "Admin",
      path: `/admin/addadmin/${uniqueId}`,
      type: "admin",
    },
  ];

  return links;
};

export default AdminSidebarLinks;
