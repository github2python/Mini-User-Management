import React, { useState, useEffect, useCallback, useRef } from 'react';
import { taskAPI } from '../utils/api';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import './Tasks.css';

const Tasks = () => {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  // Filter states - separate search from other filters for debouncing
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    tag: ''
  });

  // Debounce timer ref
  const searchTimeoutRef = useRef(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await taskAPI.getAllTasks(filters);
      setTasks(response.data.tasks);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [filters, showError]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Debounce search input
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        search: searchInput
      }));
    }, 500); // 500ms delay

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchInput]);

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskAPI.deleteTask(taskId);
      success('Task deleted successfully');
      fetchTasks();
      setDeleteConfirm(null);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleRegenerateAI = async (taskId) => {
    try {
      await taskAPI.regenerateAI(taskId);
      success('AI summary and tags regenerated');
      fetchTasks();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to regenerate AI data');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setSearchInput('');
    setFilters({
      search: '',
      status: '',
      priority: '',
      tag: ''
    });
  };

  // Get all unique tags from tasks
  const allTags = [...new Set(tasks.flatMap(task => task.tags || []))];

  if (loading) {
    return (
      <div className="tasks-container">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <div>
          <h1>Task Management</h1>
          <p className="tasks-subtitle">Manage your tasks efficiently</p>
        </div>
        <Button variant="primary" onClick={handleCreateTask}>
          + Create Task
        </Button>
      </div>

      {/* Filters */}
      <div className="tasks-filters">
        <Input
          placeholder="Search tasks..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="filter-input"
        />
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={filters.priority}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
          className="filter-select"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <select
          value={filters.tag}
          onChange={(e) => handleFilterChange('tag', e.target.value)}
          className="filter-select"
        >
          <option value="">All Tags</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
        {(searchInput || filters.status || filters.priority || filters.tag) && (
          <Button variant="outline" size="small" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      {/* Tasks List */}
      <div className="tasks-list">
        {tasks.length === 0 ? (
          <div className="tasks-empty">
            <p>No tasks found. Create your first task!</p>
          </div>
        ) : (
          tasks.map(task => (
            <div key={task._id} className="task-card">
              <div className="task-header">
                <div className="task-title-section">
                  <h3>{task.title}</h3>
                  <div className="task-badges">
                    <span className={`status-badge status-${task.status}`}>
                      {task.status}
                    </span>
                    <span className={`priority-badge priority-${task.priority}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
                <div className="task-actions">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => handleRegenerateAI(task._id)}
                    title="Regenerate AI Summary & Tags"
                  >
                    🤖 AI
                  </Button>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => handleEditTask(task)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => setDeleteConfirm(task)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              
              {task.description && (
                <p className="task-description">{task.description}</p>
              )}
              
              {task.summary && (
                <div className="task-summary">
                  <strong>AI Summary:</strong> {task.summary}
                </div>
              )}
              
              {task.tags && task.tags.length > 0 && (
                <div className="task-tags">
                  {task.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              )}
              
              <div className="task-footer">
                <div className="task-meta">
                  {task.dueDate && (
                    <span className="task-due-date">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  <span className="task-created">
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                  {user?.role === 'admin' && task.createdBy && (
                    <span className="task-creator">
                      Created by: {task.createdBy.fullName || task.createdBy.email}
                    </span>
                  )}
                </div>
                <div className="task-assignment">
                  {task.assignedTo && (
                    <span>Assigned to: {task.assignedTo.fullName}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        onSuccess={() => {
          setIsModalOpen(false);
          setEditingTask(null);
          fetchTasks();
        }}
        currentUser={user}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Delete"
        size="small"
      >
        <p>Are you sure you want to delete "{deleteConfirm?.title}"?</p>
        <div className="modal-actions">
          <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDeleteTask(deleteConfirm._id)}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

// Task Modal Component
const TaskModal = ({ isOpen, onClose, task, onSuccess, currentUser }) => {
  const { success, error: showError } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
    assignedTo: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setFormData({
          title: task.title || '',
          description: task.description || '',
          status: task.status || 'pending',
          priority: task.priority || 'medium',
          dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
          assignedTo: task.assignedTo?._id || ''
        });
      } else {
        setFormData({
          title: '',
          description: '',
          status: 'pending',
          priority: 'medium',
          dueDate: '',
          assignedTo: ''
        });
      }
      setErrors({});
      // Fetch users for assignment (if admin)
      if (currentUser?.role === 'admin') {
        fetchUsers();
      }
    }
  }, [isOpen, task, currentUser]);

  const fetchUsers = async () => {
    try {
      const { adminAPI } = await import('../utils/api');
      const response = await adminAPI.getAllUsers(1, 100);
      setUsers(response.data.users);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        dueDate: formData.dueDate || null,
        assignedTo: formData.assignedTo || null
      };

      if (task) {
        await taskAPI.updateTask(task._id, submitData);
        success('Task updated successfully');
      } else {
        await taskAPI.createTask(submitData);
        success('Task created successfully');
      }
      onSuccess();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create New Task'}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="task-form">
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          required
        />
        <div className="input-group">
          <label className="input-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input-field"
            rows="4"
          />
        </div>
        <div className="form-row">
          <div className="input-group">
            <label className="input-label">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input-field"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="input-field"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="input-group">
            <label className="input-label">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          {currentUser?.role === 'admin' && (
            <div className="input-group">
              <label className="input-label">Assign To</label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Unassigned</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.fullName} ({user.email})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="modal-actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {task ? 'Update' : 'Create'} Task
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default Tasks;

