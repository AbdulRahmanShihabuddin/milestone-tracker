import React, { useState, useEffect } from 'react';
import { milestonesAPI } from '../utils/api';
import MilestoneForm from './MilestoneForm';
import MilestoneList from './MilestoneList';
import Aurora from './Aurora';
import ProgressChart from './ProgressChart';
import MilestoneModal from './MilestoneModal';
import logo from '../assets/logo.png';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
    const [milestones, setMilestones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedMilestone, setSelectedMilestone] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

    useEffect(() => {
        fetchMilestones();
    }, []);

    const fetchMilestones = async () => {
        try {
            const response = await milestonesAPI.getAll();
            setMilestones(response.data);
        } catch (error) {
            console.error('Error fetching milestones:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateMilestone = async (data) => {
        try {
            await milestonesAPI.create(data);
            await fetchMilestones();
            setShowAddModal(false);
        } catch (error) {
            console.error('Error creating milestone:', error);
            throw error;
        }
    };

    const handleUpdateMilestone = async (id, data) => {
        try {
            await milestonesAPI.update(id, data);
            await fetchMilestones();
        } catch (error) {
            console.error('Error updating milestone:', error);
            throw error;
        }
    };

    const handleDeleteMilestone = async (id) => {
        try {
            await milestonesAPI.delete(id);
            await fetchMilestones();
        } catch (error) {
            console.error('Error deleting milestone:', error);
        }
    };

    const handleMilestoneClick = (milestone) => {
        setSelectedMilestone(milestone);
    };

    const handleStatusClick = (status) => {
        // Toggle filter: if clicking same status, clear filter
        setSelectedStatus(selectedStatus === status ? null : status);
    };

    // Calculate statistics
    const stats = {
        total: milestones.length,
        completed: milestones.filter(m => m.status === 'completed').length,
        inProgress: milestones.filter(m => m.status === 'in-progress').length,
        pending: milestones.filter(m => m.status === 'pending').length
    };

    const completionRate = stats.total > 0
        ? Math.round((stats.completed / stats.total) * 100)
        : 0;

    // Filter milestones based on selected status
    const filteredMilestones = selectedStatus
        ? milestones.filter(m => m.status === selectedStatus)
        : milestones;

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="dashboard-background">
                <Aurora
                    colorStops={["#7FFF6B", "#B19EEF", "#5227FF"]}
                    blend={0.3}
                    amplitude={0.6}
                    speed={0.3}
                />
            </div>
            <header className="dashboard-header">
                <div className="container">
                    <div className="header-content">
                        <div className="header-left">
                            <img src={logo} alt="MilestoneTrack Logo" className="dashboard-logo" />
                            <div>
                                <h1 className="dashboard-title">MilestoneTrack</h1>
                                <p className="dashboard-subtitle">Welcome back, {user.name}!</p>
                            </div>
                        </div>
                        <button onClick={onLogout} className="btn btn-secondary">
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <main className="dashboard-main">
                <div className="container">
                    <div className="dashboard-grid">
                        {/* Left Column - Progress Chart */}
                        <div className="chart-column">
                            <div className="acrylic-panel">
                                {milestones.length > 0 && (
                                    <ProgressChart
                                        milestones={milestones}
                                        completionRate={completionRate}
                                        onStatusClick={handleStatusClick}
                                        selectedStatus={selectedStatus}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Right Column - Milestones */}
                        <div className="milestones-column">
                            <div className="acrylic-panel">
                                <div className="section-header">
                                    <h2>Your Milestones</h2>
                                    <button
                                        onClick={() => setShowAddModal(true)}
                                        className="btn btn-primary"
                                    >
                                        + New Milestone
                                    </button>
                                </div>

                                {milestones.length === 0 ? (
                                    <div className="empty-state">
                                        <div className="empty-icon">📊</div>
                                        <h3>No milestones yet</h3>
                                        <p>Create your first milestone to start tracking your progress!</p>
                                        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
                                            Create Milestone
                                        </button>
                                    </div>
                                ) : (
                                    <div className="milestones-container">
                                        <MilestoneList
                                            milestones={filteredMilestones}
                                            onMilestoneClick={handleMilestoneClick}
                                            onDelete={handleDeleteMilestone}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Add Milestone Modal */}
            {showAddModal && (
                <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title">New Milestone</h2>
                            <button onClick={() => setShowAddModal(false)} className="modal-close" aria-label="Close">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <MilestoneForm
                                onSubmit={handleCreateMilestone}
                                onCancel={() => setShowAddModal(false)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* View/Edit Milestone Modal */}
            {selectedMilestone && (
                <MilestoneModal
                    milestone={selectedMilestone}
                    onClose={() => setSelectedMilestone(null)}
                    onUpdate={handleUpdateMilestone}
                    onDelete={handleDeleteMilestone}
                />
            )}
        </div>
    );
}

export default Dashboard;
