import "./App.css";
import Router from "./Router.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//import MainLayout from "./Screens/layout/MainLayout.jsx";
import Login from "./components/Login.jsx";
import Admin from "./Screens/Admin/Admin.jsx";

function App() {
  return (

    <RouterProvider  router={Router}/>
  );
}

export default App;
