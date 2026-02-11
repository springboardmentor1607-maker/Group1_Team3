import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    ClipboardList,
    Users,
    PieChart,
    Building2,
    Home,
    PenSquare,
    Eye,
    MapPinned,
    ChevronRight
} from 'lucide-react';

const Sidebar = ({ role }) => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const adminLinks = [
        { name: 'Overview', path: '/admin', icon: <LayoutDashboard size={20} /> },
        { name: 'Manage Complaints', path: '/admin/complaints', icon: <ClipboardList size={20} /> },
        { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
        { name: 'Reports', path: '/admin/reports', icon: <PieChart size={20} /> },
    ];

    const userLinks = [
        { name: 'Dashboard', path: '/user', icon: <Home size={20} /> },
        { name: 'Report Issue', path: '/user/report', icon: <PenSquare size={20} /> },
        { name: 'View Complaints', path: '/user/complaints', icon: <Eye size={20} /> },
        { name: 'Issue Map', path: '/user/map', icon: <MapPinned size={20} /> },
    ];

    const links = role === 'admin' ? adminLinks : userLinks;
    const userInitials = role === 'admin' ? 'AD' : 'JD';
    const userName = role === 'admin' ? 'Admin User' : 'John Doe';
    const userEmail = role === 'admin' ? 'admin@cleanstreet.gov' : 'john.doe@email.com';
    const avatarColor = role === 'admin' ? 'var(--color-primary)' : 'var(--color-accent)';

    return (
        <aside className="sidebar">
            <div className="logo-container">
                <div className="logo-icon">
                    <Building2 size={24} />
                </div>
                <div className="logo-text">CleanStreet</div>
            </div>

            <div className="section-title" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-muted)', paddingLeft: '1rem', marginBottom: '0.5rem', border: 'none' }}>
                {role === 'admin' ? 'Admin Panel' : 'User Panel'}
            </div>

            <nav className="nav-links">
                {links.map((link) => (
                    <Link
                        key={link.name}
                        to={link.path}
                        className={`nav-item ${isActive(link.path) ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{link.icon}</span>
                        <span>{link.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-mini-profile">
                    <div className="avatar" style={{ backgroundColor: avatarColor }}>
                        {userInitials}
                    </div>
                    <div className="user-info">
                        <h4>{userName}</h4>
                        <p>{userEmail}</p>
                    </div>
                    {role === 'admin' && <ChevronRight size={16} style={{ marginLeft: 'auto', color: 'var(--color-text-muted)' }} />}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
