import React from 'react';

const Header = ({ title }) => {
    return (
        <header className="top-header">
            <div className="page-title">
                <h1>{title}</h1>
            </div>
            <div className="header-actions">
                <button className="action-btn btn-text">Dashboard</button>
                <button className="action-btn btn-text">Report Issue</button>
                <button className="action-btn btn-text">View Complaints</button>
                {/* Placeholder Login/Logout based on context eventually */}
                <button className="action-btn btn-primary" style={{ backgroundColor: 'white', color: 'var(--color-primary)', border: '1px solid var(--color-border)' }}>Login</button>
                <button className="action-btn btn-primary">Register</button>
            </div>
        </header>
    );
};

export default Header;
