import { createBrowserRouter,createRoutesFromElements,Route } from 'react-router-dom';
import AdminHome from './Screens/Admin/Home.jsx';
import FacultyHome from './Screens/Faculty/Home.jsx';

import FacultyMarks from './Screens/Faculty/Marks.jsx';
import FacultyMaterial from './Screens/Faculty/Material.jsx';
import FacultyProfile from './Screens/Faculty/Profile.jsx';
import FacultyStudent from './Screens/Faculty/Student.jsx';
import FacultyTimetable from './Screens/Faculty/Timetable.jsx';
import Notice from './components/Notice.jsx'
import Login from "./components/Login.jsx"

import { ChatBox } from './chat/component/ChatBox.jsx';

import Dashboard from './Screens/Student/Dashboard.jsx';
import StudentHome from './Screens/Student/Home.jsx'
import StudentMarks from './Screens/Student/Marks.jsx'
import StudentMaterial from './Screens/Student/Material.jsx'
import StudentProfile from './Screens/Student/Profile.jsx'
import StudentTimeTable from './Screens/Student/TimeTable.jsx'


const Router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Login />} />
      <Route path="/admin/profile" element={<AdminHome />} />
      
      <Route path="/faculty/profile" element={<FacultyHome />} />
      {/* <Route path="/student" element={<StudentHome />} /> */}
      {/* <Route path='/chat' element={<ChatBox/>}/> */}


      
      
      {/* <Route path="/faculty_marks" element={<FacultyMarks/>} />
      <Route path="/faculty_material" element={<FacultyMaterial/>} />
      <Route path="/faculty_profile" element={<FacultyProfile/>} />
      <Route path="/faculty_student" element={<FacultyStudent/>} />
      <Route path="/faculty_timetable" element={<FacultyTimetable/>} />
      <Route path="/faculty_notice" element={<Notice/>} /> */}

      <Route element={<Dashboard/>}>
        <Route path="student/marks" element={<StudentMarks/>}/>
        <Route path="student/material" element={<StudentMaterial/>}/>
        <Route path="student/profile" element={<StudentProfile/>}/>
        <Route path="student/timetable" element={<StudentTimeTable/>}/>
        <Route path='student/chat' element={<ChatBox/>}/>
        <Route path='student/notice' element={<Notice/>}/>
      </Route>
   </>

  )
)

export default Router
