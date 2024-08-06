import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Dashboard from './components/dashboard/Dashboard';
import ControlNodos from './components/ControlNodos/Nodos';
import Historico from './components/Historico/Reportes';
import Login from './components/Login/Loginn';

ReactDOM.createRoot(document.getElementById('root')).render(
    <Router>
        <Routes>
            <Route path="/" element={<App />}>
                <Route index element={<Navigate to="/login" />} />
                <Route path="login" element={<Login />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="control-nodos" element={<ControlNodos />} />
                <Route path="historico" element={<Historico />} />
            </Route>
        </Routes>
    </Router>
);
