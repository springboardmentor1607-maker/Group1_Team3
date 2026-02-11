import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, User } from 'lucide-react';

const Home = () => {
    return (
        <div className="landing-body">
            <div className="selection-card">
                <div className="app-logo" style={{ fontSize: '3rem', color: 'var(--color-primary)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                    <Building2 size={64} />
                </div>
                <h1 style={{ color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>Welcome to CleanStreet</h1>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem' }}>Select a dashboard to proceed</p>

                <div className="btn-group" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Link to="/admin" className="btn-link admin" style={{
                        display: 'flex',
                        padding: '1rem',
                        borderRadius: '12px',
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        fontWeight: '600',
                        textDecoration: 'none',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        transition: 'all 0.3s'
                    }}>
                        <ShieldCheck size={20} />
                        Admin Dashboard
                    </Link>
                    <Link to="/user" className="btn-link" style={{
                        display: 'flex',
                        padding: '1rem',
                        borderRadius: '12px',
                        backgroundColor: '#f8fafc',
                        color: 'var(--color-text-main)',
                        fontWeight: '600',
                        border: '2px solid transparent',
                        textDecoration: 'none',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        transition: 'all 0.3s'
                    }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-primary)';
                            e.currentTarget.style.color = 'var(--color-primary)';
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = 'transparent';
                            e.currentTarget.style.color = 'var(--color-text-main)';
                            e.currentTarget.style.backgroundColor = '#f8fafc';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <User size={20} />
                        User Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
