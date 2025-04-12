import "./App.css";
import Router from "./Router.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
<<<<<<< HEAD
=======
//import MainLayout from "./Screens/layout/MainLayout.jsx";
>>>>>>> 6bb6ce198d984179721fe33152d15c2af40464b9
import Login from "./components/Login.jsx";
import Admin from "./Screens/Admin/Admin.jsx";

function App() {
  return (

    <RouterProvider  router={Router}/>
  );
}

export default App;
