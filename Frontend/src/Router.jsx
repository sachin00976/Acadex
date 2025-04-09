import React from 'react'
import { createBrowserRouter,createRoutesFromElements,Route } from 'react-router-dom'
import Login from './components/Login.jsx'
const Router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Login/>}/>
    )
)

export default Router;
