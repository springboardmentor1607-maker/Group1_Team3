import React from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ role, title, children }) => {
    return (
        <div className="app-container">
            <Sidebar role={role} />
            <main className="main-content">
                <header className="top-header">
                    <div className="page-title">
                        <h1>{title}</h1>
                    </div>
                    <div className="header-actions">
                        <button className="action-btn btn-text">Dashboard</button>
                        <button className="action-btn btn-text">Report Issue</button>
                        <button className="action-btn btn-text">View Complaints</button>
                        {role === 'admin' ? (
                            <button className="action-btn btn-primary" style={{ backgroundColor: 'white', color: 'var(--color-primary)', border: '1px solid var(--color-border)' }}>Login</button>
                        ) : null}
                        <button className="action-btn btn-primary">{role === 'admin' ? 'Register' : 'Logout'}</button>
                    </div>
                </header>
                <div className="dashboard-container">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
