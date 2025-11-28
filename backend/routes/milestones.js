import express from 'express';
import { randomUUID } from 'crypto';
import {
    getMilestonesByUserId,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    findMilestoneById
} from '../utils/dataStore.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all milestones for the authenticated user
router.get('/', (req, res) => {
    try {
        const milestones = getMilestonesByUserId(req.user.id);
        res.json(milestones);
    } catch (error) {
        console.error('Error fetching milestones:', error);
        res.status(500).json({ error: 'Server error fetching milestones' });
    }
});

// Get a specific milestone
router.get('/:id', (req, res) => {
    try {
        const milestone = findMilestoneById(req.params.id);

        if (!milestone) {
            return res.status(404).json({ error: 'Milestone not found' });
        }

        // Ensure user owns this milestone
        if (milestone.userId !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(milestone);
    } catch (error) {
        console.error('Error fetching milestone:', error);
        res.status(500).json({ error: 'Server error fetching milestone' });
    }
});

// Create a new milestone
router.post('/', (req, res) => {
    try {
        const { title, description, status, dueDate, category } = req.body;

        // Validation
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const validStatuses = ['pending', 'in-progress', 'completed'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const milestone = {
            id: randomUUID(),
            userId: req.user.id,
            title,
            description: description || '',
            status: status || 'pending',
            category: category || 'general',
            dueDate: dueDate || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        addMilestone(milestone);
        res.status(201).json(milestone);
    } catch (error) {
        console.error('Error creating milestone:', error);
        res.status(500).json({ error: 'Server error creating milestone' });
    }
});

// Update a milestone
router.put('/:id', (req, res) => {
    try {
        const milestone = findMilestoneById(req.params.id);

        if (!milestone) {
            return res.status(404).json({ error: 'Milestone not found' });
        }

        // Ensure user owns this milestone
        if (milestone.userId !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const { title, description, status, dueDate, category } = req.body;

        // Validation
        const validStatuses = ['pending', 'in-progress', 'completed'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const updatedData = {
            ...(title !== undefined && { title }),
            ...(description !== undefined && { description }),
            ...(status !== undefined && { status }),
            ...(category !== undefined && { category }),
            ...(dueDate !== undefined && { dueDate }),
            updatedAt: new Date().toISOString()
        };

        updateMilestone(req.params.id, updatedData);

        const updatedMilestone = findMilestoneById(req.params.id);
        res.json(updatedMilestone);
    } catch (error) {
        console.error('Error updating milestone:', error);
        res.status(500).json({ error: 'Server error updating milestone' });
    }
});

// Delete a milestone
router.delete('/:id', (req, res) => {
    try {
        const milestone = findMilestoneById(req.params.id);

        if (!milestone) {
            return res.status(404).json({ error: 'Milestone not found' });
        }

        // Ensure user owns this milestone
        if (milestone.userId !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        deleteMilestone(req.params.id);
        res.json({ message: 'Milestone deleted successfully' });
    } catch (error) {
        console.error('Error deleting milestone:', error);
        res.status(500).json({ error: 'Server error deleting milestone' });
    }
});

export default router;
