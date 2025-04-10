import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import Login from './components/Login.jsx'
import AddAdmin from './Screens/Admin/Admin/AddAdmin.jsx'
import EditAdmin from './Screens/Admin/Admin/EditAdmin.jsx'
import AddStudent from './Screens/Admin/Student/AddStudent.jsx'
import EditStudent from './Screens/Admin/Student/EditStudent.jsx'
import AddFaculty from './Screens/Admin/Faculty/AddFaculty.jsx'
import EditFaculty from './Screens/Admin/Faculty/EditFaculty.jsx'
import Home from './Screens/Admin/Home.jsx'
import Admin from './Screens/Admin/Admin.jsx'
import Profile from './Screens/Admin/Profile.jsx'
import Notice from './components/Notice.jsx'

const Router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<Profile />} />
      <Route path="/ed" element={<EditAdmin />} />
      <Route path="/as" element={<AddStudent />} />
      <Route path="/es" element={<EditStudent />} />
      <Route path="/af" element={<AddFaculty />} />
      <Route path="/ef" element={<EditFaculty />} />
      <Route path="/ho" element={<Home />} />
      <Route path="/no" element={<Notice />} />
    </>
  )
)

export default Router