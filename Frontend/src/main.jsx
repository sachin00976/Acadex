import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { Provider } from "react-redux";
import {store,persistor} from "./features/store.js"; // adjust the path if different
import { Toaster } from "react-hot-toast";
import { PersistGate } from "redux-persist/integration/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
       <PersistGate loading={null} persistor={persistor}>
    <App />
    <Toaster/>
  </PersistGate>
    </Provider>
  
);
