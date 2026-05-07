import express from 'express';
import Milestone from '../models/Milestone.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all milestones for the authenticated user
router.get('/', async (req, res) => {
    try {
        const milestones = await Milestone.find({ userId: req.user.id });
        // Map _id to id for frontend compatibility
        const formattedMilestones = milestones.map(m => ({
            id: m._id,
            userId: m.userId,
            title: m.title,
            description: m.description,
            status: m.status,
            category: m.category,
            dueDate: m.dueDate,
            createdAt: m.createdAt,
            updatedAt: m.updatedAt
        }));
        res.json(formattedMilestones);
    } catch (error) {
        console.error('Error fetching milestones:', error);
        res.status(500).json({ error: 'Server error fetching milestones' });
    }
});

// Get a specific milestone
router.get('/:id', async (req, res) => {
    try {
        const milestone = await Milestone.findById(req.params.id);

        if (!milestone) {
            return res.status(404).json({ error: 'Milestone not found' });
        }

        // Ensure user owns this milestone
        if (milestone.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json({
            id: milestone._id,
            userId: milestone.userId,
            title: milestone.title,
            description: milestone.description,
            status: milestone.status,
            category: milestone.category,
            dueDate: milestone.dueDate,
            createdAt: milestone.createdAt,
            updatedAt: milestone.updatedAt
        });
    } catch (error) {
        console.error('Error fetching milestone:', error);
        res.status(500).json({ error: 'Server error fetching milestone' });
    }
});

// Create a new milestone
router.post('/', async (req, res) => {
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

        const milestone = new Milestone({
            userId: req.user.id,
            title,
            description: description || '',
            status: status || 'pending',
            category: category || 'general',
            dueDate: dueDate || null
        });

        await milestone.save();

        res.status(201).json({
            id: milestone._id,
            userId: milestone.userId,
            title: milestone.title,
            description: milestone.description,
            status: milestone.status,
            category: milestone.category,
            dueDate: milestone.dueDate,
            createdAt: milestone.createdAt,
            updatedAt: milestone.updatedAt
        });
    } catch (error) {
        console.error('Error creating milestone:', error);
        res.status(500).json({ error: 'Server error creating milestone' });
    }
});

// Update a milestone
router.put('/:id', async (req, res) => {
    try {
        const milestone = await Milestone.findById(req.params.id);

        if (!milestone) {
            return res.status(404).json({ error: 'Milestone not found' });
        }

        // Ensure user owns this milestone
        if (milestone.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const { title, description, status, dueDate, category } = req.body;

        // Validation
        const validStatuses = ['pending', 'in-progress', 'completed'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        if (title !== undefined) milestone.title = title;
        if (description !== undefined) milestone.description = description;
        if (status !== undefined) milestone.status = status;
        if (category !== undefined) milestone.category = category;
        if (dueDate !== undefined) milestone.dueDate = dueDate;

        await milestone.save();

        res.json({
            id: milestone._id,
            userId: milestone.userId,
            title: milestone.title,
            description: milestone.description,
            status: milestone.status,
            category: milestone.category,
            dueDate: milestone.dueDate,
            createdAt: milestone.createdAt,
            updatedAt: milestone.updatedAt
        });
    } catch (error) {
        console.error('Error updating milestone:', error);
        res.status(500).json({ error: 'Server error updating milestone' });
    }
});

// Delete a milestone
router.delete('/:id', async (req, res) => {
    try {
        const milestone = await Milestone.findById(req.params.id);

        if (!milestone) {
            return res.status(404).json({ error: 'Milestone not found' });
        }

        // Ensure user owns this milestone
        if (milestone.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        await Milestone.findByIdAndDelete(req.params.id);
        res.json({ message: 'Milestone deleted successfully' });
    } catch (error) {
        console.error('Error deleting milestone:', error);
        res.status(500).json({ error: 'Server error deleting milestone' });
    }
});

export default router;
