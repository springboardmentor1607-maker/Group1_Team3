import React from 'react';

const StatCard = ({ value, label, icon, iconBgColor, iconColor }) => {
    return (
        <div className="stat-card">
            <div
                className="stat-icon"
                style={{ backgroundColor: iconBgColor, color: iconColor }}
            >
                {icon}
            </div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
        </div>
    );
};

export default StatCard;
