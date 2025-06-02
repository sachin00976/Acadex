import "./App.css";
import Router from "./Router.jsx";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

function App() {
  return (
    <>
    {/* <Navbar/> */}
    <Outlet/>
    </>
  );
}

export default App;
