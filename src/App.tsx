import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute.tsx';
import HomePage from './pages/HomePage.tsx';
import { Payments } from './pages/Payments.tsx';
import { Contacts } from './pages/Contacts.tsx';
import Login from './pages/Login.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/opportunities" element={<HomePage view='Opportunity'/>} />
          <Route path='/contacts' element={<Contacts/>} />
          <Route path='/payments' element={<Payments/>} />
          <Route path='/storage' element={<HomePage view='Storage'/>} />
        </Route>
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;