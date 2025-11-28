import React, { useState, useEffect } from 'react';
import './MilestoneForm.css';

function MilestoneForm({ milestone, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending',
        category: 'general',
        dueDate: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (milestone) {
            setFormData({
                title: milestone.title || '',
                description: milestone.description || '',
                status: milestone.status || 'pending',
                category: milestone.category || 'general',
                dueDate: milestone.dueDate ? milestone.dueDate.split('T')[0] : ''
            });
        }
    }, [milestone]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const submitData = {
                ...formData,
                dueDate: formData.dueDate || null
            };

            if (milestone) {
                await onSubmit(milestone.id, submitData);
            } else {
                await onSubmit(submitData);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="milestone-form card">
            <h3 className="form-title">
                {milestone ? 'Edit Milestone' : 'Create New Milestone'}
            </h3>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title" className="form-label">Title *</label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        className="form-input"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Enter milestone title"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        className="form-textarea"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Add details about this milestone..."
                        rows="4"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="status" className="form-label">Status *</label>
                        <select
                            id="status"
                            name="status"
                            className="form-select"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="category" className="form-label">Category</label>
                        <select
                            id="category"
                            name="category"
                            className="form-select"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="general">General</option>
                            <option value="compliance">Compliance</option>
                            <option value="security">Security</option>
                            <option value="development">Development</option>
                            <option value="documentation">Documentation</option>
                            <option value="testing">Testing</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="dueDate" className="form-label">Due Date</label>
                    <input
                        id="dueDate"
                        type="date"
                        name="dueDate"
                        className="form-input"
                        value={formData.dueDate}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn btn-secondary"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center gap-sm">
                                <span className="spinner-small"></span>
                                {milestone ? 'Updating...' : 'Creating...'}
                            </span>
                        ) : (
                            milestone ? 'Update Milestone' : 'Create Milestone'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default MilestoneForm;
