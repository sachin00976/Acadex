import "./App.css";
import Router from "./Router.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";


function App() {
  return (
    <RouterProvider router={Router} />
  );
}

export default App;
