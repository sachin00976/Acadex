import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import Login from './components/Login.jsx'
import AdminHome from './Screens/Admin/Home.jsx';
import FacultyHome from './Screens/Faculty/Home.jsx';
// import StudentHome from './Screens/Student/Home.jsx';


const Router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<AdminHome />} />
      
      <Route path="/faculty" element={<FacultyHome />} />

   </>
  )
)

export default Router
