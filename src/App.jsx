import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
//import SiderCustom from './componentes/SiderCustom'; // Ajusta la ruta si es necesario
//import HeaderCustom from './componentes/HeaderCustomm'; // Ajusta la ruta si es necesario
//import './style/index.less'; // Asegúrate de que esta ruta es correcta para tus estilos

const { Content, Footer } = Layout;

const App = () => {
    const [collapsed, setCollapsed] = useState(false);

    const toggle = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Layout className="ant-layout-has-sider">
            
            <Layout>
                
                <Content style={{ margin: '0 16px', overflow: 'initial' }}>
                    <Outlet /> {/* Esto renderiza las vistas anidadas */}
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold' }}>
                        INSTITUTO TECNOLÓGICO DE COLIMA
                    </div>
                    <div>MAESTRÍA EN SISTEMAS COMPUTACIONALES</div>
                    <div>Ing. Luis Manuel Saltos Pineda</div>
                </Footer>
            </Layout>
        </Layout>
    );
};

export default App;



/*
// src/App.jsx
import React from 'react';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import HeaderCustom from './components/HeaderCustomm';
import SiderCustom from './components/SiderCustom';
import Dashboard from './components/dashboard/Dashboard';
import ControlNodos from './components/Controlodos/Nodos';
import Historico from './components/historico/Historico';
import Login from './components/Login/Loginn'; */