import React from 'react';
import './App.css'
import {  Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Project from './components/Project/Project';
import Task from './components/Task/Task';

import Home from './Home';
import PrivateRoute from './components/PrivateRoute';
import ThankYou from './components/Thankyou/ThankYou';
import MainTemp from './components/Dashboard/MainTemp';
import Create from './components/Dashboard/Create';
import SettingSidebar from './components/Dashboard/SettingSidebar';
import CompilerSidebar from './components/Dashboard/CompilerSidebar';
import HomeCompiler from './HomeComponents/HomeCompiler';
import About from './HomeComponents/About';
import Services from './HomeComponents/Services';

function App() {
  return (





    <AuthProvider>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/thank-you" exact element={<ThankYou />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/compiler" element={<HomeCompiler />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<MainTemp />} />
            <Route path="/dashboard/create-project" element={<Create />} />
            <Route path="/dashboard/setting" element={<SettingSidebar />} />
            <Route path="/dashboard/compiler" element={<CompilerSidebar />} />
            <Route path="/project/:projectId" element={<Project />} />
            <Route path="/project/:projectId/task/:taskId" element={<Task />} />
          </Route>
        </Routes>
    </AuthProvider>

    
  );
}

export default App;
