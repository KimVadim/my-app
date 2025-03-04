import './App.css';
import React from 'react';
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import Login from './components/Login.tsx';
import HomePage from './components/HomePage.tsx';
//import PrivateRoute from './components/PrivateRoute.tsx';

function App() {
  return (
    //<Router>
      //<Routes>
        //<Route path="/login" element={<Login />} />
        //<Route path="/homepage" element={<PrivateRoute><HomePage/></PrivateRoute>} />
        //<Route path="/my-app" element={<Login />} />
      //</Routes>
    //</Router>
    <><HomePage/></>
  );
}

export default App;
