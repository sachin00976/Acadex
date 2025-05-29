import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Router from "./Router.jsx";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./features/store.js";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={Router} />
      <Toaster />
    </Provider>
  </React.StrictMode>
);
