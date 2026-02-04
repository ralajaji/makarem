import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Welcome from './pages/Welcome';
import Cars from './pages/Cars';
import Gifts from './pages/Gifts';
import Activities from './pages/Activities';
import Restaurants from './pages/Restaurants';
import Admin from './pages/Admin';
import Confirmation from './components/Confirmation';

function App() {
  return (
    <Routes>
      {/* Admin Route */}
      <Route path="/admin" element={<Admin />} />

      {/* Guest Routes with Layout */}
      <Route path="/:roomNumber" element={<MainLayout />}>
        <Route index element={<Welcome />} />
        <Route path="cars" element={<Cars />} />
        <Route path="gifts" element={<Gifts />} />
        <Route path="activities" element={<Activities />} />
        <Route path="restaurants" element={<Restaurants />} />
        <Route path="confirmation" element={<Confirmation />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

export default App;
