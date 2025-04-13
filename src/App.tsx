import './App.css';
import React from 'react';
import HomePage from './components/HomePage.tsx';
import Login from './components/Login.tsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute.tsx';
import { IncomeReport } from './components/Report.tsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/login" element={<Login />} />

        {/* Защищенные маршруты */}
        <Route element={<PrivateRoute />}>
          <Route path="/opty" element={<HomePage/>} />
          <Route path="/incomereport" element={<IncomeReport/>} />
        </Route>

        {/* Перенаправление на страницу логина по умолчанию */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;