import React, { useState } from 'react';
import MilestoneForm from './MilestoneForm';
import './MilestoneModal.css';

function MilestoneModal({ milestone, onClose, onUpdate, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleUpdate = async (id, data) => {
        await onUpdate(id, data);
        setIsEditing(false);
        onClose();
    };

    const handleDelete = async () => {
        await onDelete(milestone.id);
        onClose();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'var(--color-success)';
            case 'in-progress':
                return 'var(--color-primary)';
            case 'pending':
                return 'var(--color-warning)';
            default:
                return 'var(--color-text-secondary)';
        }
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">
                        {isEditing ? 'Edit Milestone' : 'Milestone Details'}
                    </h2>
                    <button onClick={onClose} className="modal-close" aria-label="Close">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="modal-body">
                    {isEditing ? (
                        <MilestoneForm
                            milestone={milestone}
                            onSubmit={handleUpdate}
                            onCancel={() => setIsEditing(false)}
                        />
                    ) : (
                        <>
                            <div className="milestone-detail">
                                <div className="milestone-detail-label">Title</div>
                                <div className="milestone-detail-value">{milestone.title}</div>
                            </div>

                            <div className="milestone-detail">
                                <div className="milestone-detail-label">Status</div>
                                <div className="milestone-detail-value">
                                    <span className={`badge badge-${milestone.status}`}>
                                        {milestone.status}
                                    </span>
                                </div>
                            </div>

                            <div className="milestone-detail">
                                <div className="milestone-detail-label">Category</div>
                                <div className="milestone-detail-value">{milestone.category}</div>
                            </div>

                            <div className="milestone-detail">
                                <div className="milestone-detail-label">Due Date</div>
                                <div className="milestone-detail-value">{formatDate(milestone.dueDate)}</div>
                            </div>

                            {milestone.description && (
                                <div className="milestone-detail">
                                    <div className="milestone-detail-label">Description</div>
                                    <div className="milestone-detail-description">{milestone.description}</div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {!isEditing && (
                    <div className="modal-footer">
                        <button onClick={handleDelete} className="btn btn-danger btn-sm">
                            Delete
                        </button>
                        <button onClick={() => setIsEditing(true)} className="btn btn-primary btn-sm">
                            Edit
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MilestoneModal;
