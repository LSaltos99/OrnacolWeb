import React from 'react';
import { Outlet } from 'react-router-dom';

const Page = () => {
    return (
        <div>
            <h1>Mi Aplicación</h1>
            <Outlet />
        </div>
    );
};

export default Page;
