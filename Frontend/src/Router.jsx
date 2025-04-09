import React from 'react'
import { createBrowserRouter,createRoutesFromElements,Route } from 'react-router-dom'
import Login from './components/Login.jsx'
import AddFaculty from "./Screens/Faculty/AddFaculty.jsx"
const Router = createBrowserRouter(
    createRoutesFromElements(
         <Route path="/" element={<Login/>}/>,
        // <Route path="/" element={<AddFaculty/>}/>
        
    )
)

export default Router;
