import React from 'react';
import {
    ClipboardList,
    UserPlus,
    Users,
    CheckCircle,
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';

const AdminDashboard = () => {
    return (
        <DashboardLayout role="admin" title="Admin Dashboard">
            {/* System Overview */}
            <section className="section-card" style={{ background: 'transparent', boxShadow: 'none', border: 'none', padding: '0' }}>
                <div className="section-header">
                    <h2 className="section-title" style={{ borderLeft: 'none', padding: '0', fontSize: '1.5rem' }}>System Overview</h2>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ backgroundColor: 'rgba(26, 35, 126, 0.1)', color: 'var(--color-primary)' }}>
                            <ClipboardList size={32} />
                        </div>
                        <div className="stat-value">4</div>
                        <div className="stat-label">Total Complaints</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 127, 23, 0.1)', color: 'var(--color-warning)' }}>
                            <UserPlus size={32} />
                        </div>
                        <div className="stat-value">4</div>
                        <div className="stat-label">Pending Review</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ backgroundColor: 'rgba(46, 125, 50, 0.1)', color: 'var(--color-success)' }}>
                            <Users size={32} />
                        </div>
                        <div className="stat-value">1,234</div>
                        <div className="stat-label">Active Users</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ backgroundColor: 'rgba(2, 119, 189, 0.1)', color: 'var(--color-info)' }}>
                            <CheckCircle size={32} />
                        </div>
                        <div className="stat-value">0</div>
                        <div className="stat-label">Resolved Today</div>
                    </div>
                </div>
            </section>

            {/* Community Impact */}
            <section className="section-card">
                <div className="section-header">
                    <h2 className="section-title">Community Impact</h2>
                </div>
                <div className="content-block">
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', lineHeight: '1.8' }}>
                        Thanks to citizen reports and community engagement, we've resolved <strong style={{ color: 'var(--color-primary)' }}>0 issues</strong> this month, making our city cleaner and safer for everyone.
                    </p>
                </div>
            </section>
        </DashboardLayout>
    );
};

export default AdminDashboard;
