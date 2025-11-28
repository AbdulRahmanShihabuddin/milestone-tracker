import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import './ProgressChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function ProgressChart({ milestones, completionRate, onStatusClick, selectedStatus }) {
    // Status distribution data
    const statusCounts = {
        pending: milestones.filter(m => m.status === 'pending').length,
        inProgress: milestones.filter(m => m.status === 'in-progress').length,
        completed: milestones.filter(m => m.status === 'completed').length
    };

    const statusLabels = ['completed', 'in-progress', 'pending'];

    const doughnutData = {
        labels: ['Completed', 'In Progress', 'Pending'],
        datasets: [
            {
                data: [statusCounts.completed, statusCounts.inProgress, statusCounts.pending],
                backgroundColor: [
                    '#7FFF6B',
                    '#B19EEF',
                    '#5227FF'
                ],
                borderColor: [
                    '#7FFF6B',
                    '#B19EEF',
                    '#5227FF'
                ],
                borderWidth: 2
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const clickedIndex = elements[0].index;
                const clickedStatus = statusLabels[clickedIndex];
                onStatusClick(clickedStatus);
            } else {
                // Clicked on center or empty space - clear filter
                onStatusClick(null);
            }
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: 'hsl(0, 0%, 70%)',
                    padding: 16,
                    font: {
                        size: 12,
                        family: 'Oswald, sans-serif'
                    }
                },
                onClick: (event, legendItem, legend) => {
                    const index = legendItem.index;
                    const clickedStatus = statusLabels[index];
                    onStatusClick(clickedStatus);
                }
            },
            tooltip: {
                backgroundColor: 'hsla(0, 0%, 8%, 0.95)',
                titleColor: 'hsl(0, 0%, 95%)',
                bodyColor: 'hsl(0, 0%, 70%)',
                borderColor: 'hsla(0, 0%, 100%, 0.1)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                titleFont: {
                    size: 14,
                    family: 'Oswald, sans-serif'
                },
                bodyFont: {
                    size: 13,
                    family: 'Oswald, sans-serif'
                }
            }
        }
    };

    return (
        <div className="progress-chart-container">
            <div className="chart-card card">
                <div className="chart-header">
                    <h3 className="chart-title">Status Distribution</h3>
                    <div className="completion-badge">
                        <span className="completion-rate">{completionRate}%</span>
                        <span className="completion-label">Complete</span>
                    </div>
                </div>
                <div className="chart-wrapper">
                    <Doughnut
                        data={doughnutData}
                        options={chartOptions}
                    />
                </div>
            </div>
        </div>
    );
}

export default ProgressChart;
