import React from 'react';
import {
    AlertTriangle,
    Clock,
    Settings,
    CheckCircle,
    Plus,
    List,
    Map,
    Check,
    Pen
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const UserDashboard = () => {
    return (
        <DashboardLayout role="user" title="User Dashboard">
            {/* Overview Stats */}
            <section className="section-card" style={{ background: 'transparent', boxShadow: 'none', border: 'none', padding: '0' }}>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ backgroundColor: 'rgba(198, 40, 40, 0.1)', color: 'var(--color-danger)' }}>
                            <AlertTriangle size={32} />
                        </div>
                        <div className="stat-value">4</div>
                        <div className="stat-label">Total Issues</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ backgroundColor: 'rgba(2, 119, 189, 0.1)', color: 'var(--color-info)' }}>
                            <Clock size={32} />
                        </div>
                        <div className="stat-value">4</div>
                        <div className="stat-label">Pending</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 127, 23, 0.1)', color: 'var(--color-warning)' }}>
                            <Settings size={32} />
                        </div>
                        <div className="stat-value">0</div>
                        <div className="stat-label">In Progress</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ backgroundColor: 'rgba(46, 125, 50, 0.1)', color: 'var(--color-success)' }}>
                            <CheckCircle size={32} />
                        </div>
                        <div className="stat-value">0</div>
                        <div className="stat-label">Resolved</div>
                    </div>
                </div>
            </section>

            <div className="split-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Recent Activity */}
                <section className="section-card">
                    <div className="section-header">
                        <h2 className="section-title">Recent Activity</h2>
                    </div>
                    <div className="activity-list">
                        <div className="activity-item">
                            <div className="activity-icon" style={{ backgroundColor: 'var(--color-success)' }}>
                                <Check size={20} />
                            </div>
                            <div className="activity-content">
                                <h4>Pothole on Main Street resolved</h4>
                                <div className="activity-time">2 hours ago</div>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon" style={{ backgroundColor: 'var(--color-info)' }}>
                                <Plus size={20} />
                            </div>
                            <div className="activity-content">
                                <h4>New streetlight issue reported</h4>
                                <div className="activity-time">4 hours ago</div>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon" style={{ backgroundColor: 'var(--color-warning)' }}>
                                <Pen size={20} />
                            </div>
                            <div className="activity-content">
                                <h4>Garbage dump complaint updated</h4>
                                <div className="activity-time">6 hours ago</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick Actions */}
                <section className="section-card">
                    <div className="section-header">
                        <h2 className="section-title">Quick Actions</h2>
                    </div>
                    <div className="quick-actions-grid">
                        <button className="action-card-btn primary" onClick={() => alert('Reporting new issue...')}>
                            <Plus size={18} style={{ marginRight: '8px' }} />
                            Report New Issue
                        </button>
                        <button className="action-card-btn" onClick={() => alert('Viewing all requests...')}>
                            <List size={18} style={{ marginRight: '8px' }} />
                            View All Complaints
                        </button>
                        <button className="action-card-btn" onClick={() => alert('Opening map...')}>
                            <Map size={18} style={{ marginRight: '8px' }} />
                            Issue Map
                        </button>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
};

export default UserDashboard;
