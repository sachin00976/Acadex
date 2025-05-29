import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import App from './App.jsx'
import Login from './components/Login.jsx'
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
  )
)

export default Router
