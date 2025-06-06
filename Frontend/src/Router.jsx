import { createBrowserRouter,createRoutesFromElements,Route } from 'react-router-dom';
import AdminHome from './Screens/Admin/Home.jsx';
import FacultyHome from './Screens/Faculty/Home.jsx';


import Notice from './components/Notice.jsx'
import Login from "./components/Login.jsx"

import { ChatBox } from './chat/component/ChatBox.jsx';

import Dashboard from './Screens/Student/Dashboard.jsx';
import StudentMarks from './Screens/Student/Marks.jsx'
import StudentMaterial from './Screens/Student/Material.jsx'
import StudentProfile from './Screens/Student/Profile.jsx'
import StudentTimeTable from './Screens/Student/TimeTable.jsx'

import AdminDashboard from './Screens/Admin/AdminDashboard.jsx';
import AddAdmin from "./Screens/Admin/Admin.jsx"
import AddStudent from "./Screens/Admin/Student.jsx"
import AddFaculty from "./Screens/Admin/Faculty.jsx"
import AdminSubject from "./Screens/Admin/Subject.jsx"
import AdminBranch from "./Screens/Admin/Branch.jsx"
import AdminProfile from "./Screens/Admin/Profile.jsx"


import FacultyDashboard from './Screens/Faculty/FAcultyDashboard.jsx';
import FacultyMarks from './Screens/Faculty/Marks.jsx';
import FacultyMaterial from './Screens/Faculty/Material.jsx';
import FacultyProfile from './Screens/Faculty/Profile.jsx';
import FacultyStudent from './Screens/Faculty/Student.jsx';
import FacultyTimetable from './Screens/Faculty/Timetable.jsx';



const Router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Login />} />
      {/* <Route path="/admin/profile" element={<AdminHome />} /> */}
      
      {/* <Route path="/faculty/profile" element={<FacultyHome />} /> */}
      {/* <Route path="/student" element={<StudentHome />} /> */}
      {/* <Route path='/chat' element={<ChatBox/>}/> */}


      
      
      {/* <Route path="/faculty_marks" element={<FacultyMarks/>} />
      <Route path="/faculty_material" element={<FacultyMaterial/>} />
      <Route path="/faculty_profile" element={<FacultyProfile/>} />
      <Route path="/faculty_student" element={<FacultyStudent/>} />
      <Route path="/faculty_timetable" element={<FacultyTimetable/>} />
      <Route path="/faculty_notice" element={<Notice/>} /> */}
    
      
      <Route element={<Dashboard/>}>
        <Route path="student/marks/:enrollment_no" element={<StudentMarks/>}/>
        <Route path="student/material/:enrollment_no" element={<StudentMaterial/>}/>
        <Route path="student/profile/:enrollment_no" element={<StudentProfile/>}/>
        <Route path="student/timetable/:enrollment_no" element={<StudentTimeTable/>}/>
        <Route path='student/chat/:enrollment_no' element={<ChatBox/>}/>
        <Route path='student/notice/:enrollment_no' element={<Notice/>}/>
      </Route>


      <Route element={<AdminDashboard/>}>
        <Route path="admin/addstudent/:id" element={<AddStudent/>}/>
        <Route path="admin/addfaculty/:id" element={<AddFaculty/>}/>
        <Route path="admin/profile/:id" element={<AdminProfile/>}/>
        <Route path="admin/branch/:id" element={<AdminBranch/>}/>
        <Route path='admin/subject/:id' element={<AdminSubject/>}/>
        <Route path='admin/notice/:id' element={<Notice/>}/>
        <Route path='admin/addadmin/:id' element={<AddAdmin/>}/>
        <Route path='admin/chat/:id' element={<ChatBox/>}/>
      </Route>


      <Route element={<FacultyDashboard/>}>
        <Route path="faculty/profile/:id" element={<FacultyProfile/>}/>
        <Route path="faculty/uploadmarks/:id" element={<FacultyMarks/>}/>
        <Route path="faculty/studentinfo/:id" element={<FacultyStudent/>}/>
        <Route path="faculty/timetable/:id" element={<FacultyTimetable/>}/>
        <Route path='faculty/notice/:id' element={<Notice/>}/>
        <Route path='faculty/material/:id' element={<FacultyMaterial/>}/>
        <Route path='faculty/chat/:id' element={<ChatBox/>}/>
      </Route>



   </>

  )
)

export default Router
