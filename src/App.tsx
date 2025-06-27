import './App.css';
import React from 'react';
import HomePage from './components/HomePage.tsx';
import Login from './components/Login.tsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute.tsx';
import { IncomeReport } from './components/Report.tsx';
import { Expenses } from './components/Expenses.tsx';
import { Contacts } from './components/Contacts.tsx';
import { Payments } from './components/Payments.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/opportunities" element={<HomePage/>} />
          <Route path="/incomereport" element={<IncomeReport/>} />
          <Route path='/expenses' element={<Expenses/>} />
          <Route path='/contacts' element={<Contacts/>} />
          <Route path='/payments' element={<Payments/>} />
        </Route>
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;