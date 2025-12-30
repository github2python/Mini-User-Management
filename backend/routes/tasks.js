const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');
const { body, validationResult, query } = require('express-validator');
const { enhanceTaskWithAI } = require('../utils/aiSimulator');

// All task routes require authentication
router.use(protect);

// Validation helper
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks with filtering and search
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in-progress, completed, cancelled]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high, urgent]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *       - in: query
 *         name: assignedTo
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 */
router.get('/', [
  query('status').optional().isIn(['pending', 'in-progress', 'completed', 'cancelled']),
  query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  handleValidationErrors
], async (req, res, next) => {
  try {
    const { status, priority, search, tag, assignedTo } = req.query;
    const query = {};

    // Filter by creator (users can only see their own tasks, admins can see all)
    if (req.user.role !== 'admin') {
      query.$or = [
        { createdBy: req.user._id },
        { assignedTo: req.user._id }
      ];
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Priority filter
    if (priority) {
      query.priority = priority;
    }

    // Assigned to filter
    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    // Tag filter
    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Search filter
    if (search) {
      query.$text = { $search: search };
    }

    const tasks = await Task.find(query)
      .populate('createdBy', 'fullName email')
      .populate('assignedTo', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               priority:
 *                 type: string
 *               dueDate:
 *                 type: string
 *               assignedTo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post('/', [
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('status').optional().isIn(['pending', 'in-progress', 'completed', 'cancelled']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  handleValidationErrors
], async (req, res, next) => {
  try {
    const taskData = {
      title: req.body.title,
      description: req.body.description || '',
      status: req.body.status || 'pending',
      priority: req.body.priority || 'medium',
      dueDate: req.body.dueDate || null,
      createdBy: req.user._id,
      assignedTo: req.body.assignedTo || null
    };

    // Enhance with AI-generated summary and tags
    const aiEnhancements = enhanceTaskWithAI(taskData);
    taskData.summary = aiEnhancements.summary;
    taskData.tags = aiEnhancements.tags;

    const task = await Task.create(taskData);
    await task.populate('createdBy', 'fullName email');
    if (task.assignedTo) {
      await task.populate('assignedTo', 'fullName email');
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/tasks/:id:
 *   get:
 *     summary: Get a single task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 */
router.get('/:id', async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('createdBy', 'fullName email')
      .populate('assignedTo', 'fullName email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && 
        task.createdBy._id.toString() !== req.user._id.toString() &&
        (!task.assignedTo || task.assignedTo._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this task'
      });
    }

    res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/tasks/:id:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task updated successfully
 */
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 3 }),
  body('status').optional().isIn(['pending', 'in-progress', 'completed', 'cancelled']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  handleValidationErrors
], async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && 
        task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }

    // Update fields
    if (req.body.title) task.title = req.body.title;
    if (req.body.description !== undefined) task.description = req.body.description;
    if (req.body.status) task.status = req.body.status;
    if (req.body.priority) task.priority = req.body.priority;
    if (req.body.dueDate !== undefined) task.dueDate = req.body.dueDate || null;
    if (req.body.assignedTo !== undefined) task.assignedTo = req.body.assignedTo || null;
    if (req.body.tags) task.tags = req.body.tags;

    // Regenerate AI summary if title or description changed
    if (req.body.title || req.body.description !== undefined) {
      const aiEnhancements = enhanceTaskWithAI({
        title: task.title,
        description: task.description
      });
      task.summary = aiEnhancements.summary;
      if (!req.body.tags) {
        task.tags = aiEnhancements.tags;
      }
    }

    await task.save();
    await task.populate('createdBy', 'fullName email');
    if (task.assignedTo) {
      await task.populate('assignedTo', 'fullName email');
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/tasks/:id:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task deleted successfully
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && 
        task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task'
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/tasks/:id/regenerate-ai:
 *   post:
 *     summary: Regenerate AI summary and tags for a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: AI data regenerated successfully
 */
router.post('/:id/regenerate-ai', async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Regenerate AI summary and tags
    const aiEnhancements = enhanceTaskWithAI({
      title: task.title,
      description: task.description
    });

    task.summary = aiEnhancements.summary;
    task.tags = aiEnhancements.tags;

    await task.save();
    await task.populate('createdBy', 'fullName email');
    if (task.assignedTo) {
      await task.populate('assignedTo', 'fullName email');
    }

    res.status(200).json({
      success: true,
      message: 'AI summary and tags regenerated successfully',
      task
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

