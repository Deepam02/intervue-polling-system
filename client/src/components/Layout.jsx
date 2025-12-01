import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import '../styles/Layout.css';

const Layout = () => {
    const location = useLocation();
    const isTeacher = location.pathname.includes('teacher');

    return (
        <div className="app-container">
            {/* <header className="app-header">
                <h1>Intervue Polls</h1>
                <div className="role-badge">{isTeacher ? 'Teacher' : 'Student'}</div>
            </header> */}
            <main className="app-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
