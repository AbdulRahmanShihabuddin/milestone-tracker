import React from 'react';
import './MilestoneList.css';

function MilestoneList({ milestones, onMilestoneClick, onDelete }) {
    const getUrgencyStatus = (dueDate) => {
        if (!dueDate) return 'normal';

        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 1) return 'critical';
        if (diffDays <= 3) return 'warning';
        return 'normal';
    };

    return (
        <div className="milestone-list">
            {milestones.map((milestone) => (
                <div
                    key={milestone.id}
                    className="milestone-item"
                    onClick={() => onMilestoneClick(milestone)}
                >
                    <div className="milestone-item-content">
                        <h3 className="milestone-item-title">{milestone.title}</h3>
                        <span className={`badge badge-${milestone.status}`}>
                            {milestone.status}
                        </span>
                        {milestone.status !== 'completed' && (
                            <span
                                className={`urgency-dot urgency-${getUrgencyStatus(milestone.dueDate)}`}
                                title={`Due: ${new Date(milestone.dueDate).toLocaleDateString()}`}
                            ></span>
                        )}
                        {milestone.status === 'completed' && (
                            <button
                                className="delete-icon-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(milestone.id);
                                }}
                                title="Delete Milestone"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MilestoneList;
