import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import Login from './components/Login.jsx'
import AdminHome from './Screens/Admin/Home.jsx';
import FacultyHome from './Screens/Faculty/Home.jsx';
import StudentHome from './Screens/Student/Home.jsx';
import FacultyMarks from './Screens/Faculty/Marks.jsx';
import FacultyMaterial from './Screens/Faculty/Material.jsx';
import FacultyProfile from './Screens/Faculty/Profile.jsx';
import FacultyStudent from './Screens/Faculty/Student.jsx';
import FacultyTimetable from './Screens/Faculty/Timetable.jsx';
import Notice from './components/Notice.jsx'

const Router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<AdminHome />} />
      
      <Route path="/faculty" element={<FacultyHome />} />
      {/* <Route path="/faculty_marks" element={<FacultyMarks/>} />
      <Route path="/faculty_material" element={<FacultyMaterial/>} />
      <Route path="/faculty_profile" element={<FacultyProfile/>} />
      <Route path="/faculty_student" element={<FacultyStudent/>} />
      <Route path="/faculty_timetable" element={<FacultyTimetable/>} />
      <Route path="/faculty_notice" element={<Notice/>} /> */}
   </>
  )
)

export default Router
