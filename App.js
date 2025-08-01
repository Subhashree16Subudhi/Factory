import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './login';
import Register from './Register';
import EquipmentMonitor from './EquipmentMonitor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/equipment-monitoring" element={<EquipmentMonitor />} />
      </Routes>
    </Router>
  );
}

export default App;

 