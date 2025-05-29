import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import App from './App.jsx'
import Login from './components/Login.jsx'
<<<<<<< HEAD
import Home from './Screens/Admin/Home.jsx'
import Home1 from './Screens/Faculty/Home.jsx'
import StudentHome from './Screens/Student/Home.jsx'
import { AuthenticatedUser, ProtectedRoute } from './components/ProtectedRoutes.jsx'


const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Login/>} />
      <Route path="faculty" element={<ProtectedRoute><Home1/></ProtectedRoute>} />
      <Route path="admin" element={<Home />} />
      <Route path="admin" element={<Home />} />
      <Route path="student" element={<StudentHome />} />
    </Route>
=======
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
>>>>>>> e91f0b5b6a564d61fbe61f31bdb0df8d8ebb4831
  )
)

export default Router
