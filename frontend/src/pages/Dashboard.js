import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../utils/api';
import { useToast } from '../hooks/useToast';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import './Dashboard.css';

const Dashboard = () => {
  const { success, error: showError } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, user: null, action: null });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllUsers(page, 10);
      setUsers(response.data.users);
      setTotalPages(response.data.pages);
      setTotal(response.data.total);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [page, showError]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleActivate = async (userId) => {
    setActionLoading(userId);
    try {
      await adminAPI.activateUser(userId);
      success('User activated successfully');
      fetchUsers();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to activate user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeactivate = async (userId) => {
    setActionLoading(userId);
    try {
      await adminAPI.deactivateUser(userId);
      success('User deactivated successfully');
      fetchUsers();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to deactivate user');
    } finally {
      setActionLoading(null);
    }
  };

  const openConfirmModal = (user, action) => {
    setConfirmModal({ isOpen: true, user, action });
  };

  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, user: null, action: null });
  };

  const confirmAction = () => {
    if (confirmModal.action === 'activate') {
      handleActivate(confirmModal.user._id);
    } else if (confirmModal.action === 'deactivate') {
      handleDeactivate(confirmModal.user._id);
    }
    closeConfirmModal();
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>User Management Dashboard</h1>
        <p className="dashboard-subtitle">Total Users: {total}</p>
      </div>

      <div className="dashboard-table-container">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Full Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="table-empty">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.email}</td>
                  <td>{user.fullName}</td>
                  <td>
                    <span className={`role-badge role-${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${user.status}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleString()
                      : 'Never'}
                  </td>
                  <td>
                    <div className="table-actions">
                      {user.status === 'active' ? (
                        <Button
                          variant="danger"
                          size="small"
                          onClick={() => openConfirmModal(user, 'deactivate')}
                          loading={actionLoading === user._id}
                        >
                          Deactivate
                        </Button>
                      ) : (
                        <Button
                          variant="success"
                          size="small"
                          onClick={() => openConfirmModal(user, 'activate')}
                          loading={actionLoading === user._id}
                        >
                          Activate
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="dashboard-pagination">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="pagination-info">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <Modal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        title={`Confirm ${confirmModal.action === 'activate' ? 'Activation' : 'Deactivation'}`}
        size="small"
      >
        <p>
          Are you sure you want to {confirmModal.action === 'activate' ? 'activate' : 'deactivate'}{' '}
          {confirmModal.user?.fullName} ({confirmModal.user?.email})?
        </p>
        <div className="modal-actions">
          <Button variant="secondary" onClick={closeConfirmModal}>
            Cancel
          </Button>
          <Button
            variant={confirmModal.action === 'activate' ? 'success' : 'danger'}
            onClick={confirmAction}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;

