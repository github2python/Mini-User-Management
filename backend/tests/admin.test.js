const request = require('supertest');
const mongoose = require('mongoose');

// Set test environment variables before requiring server
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-purposes-only';
process.env.JWT_EXPIRE = '7d';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/user-management-test';

const app = require('../server');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

describe('Admin API', () => {
  let adminToken;
  let adminUser;
  let regularUser;

  beforeAll(async () => {
    // Connect to test database
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/user-management-test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    } else if (mongoose.connection.readyState !== 1) {
      await mongoose.disconnect();
      await mongoose.connect(mongoUri);
    }
  });

  afterAll(async () => {
    await User.deleteMany({});
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  beforeEach(async () => {
    // Clear all users
    await User.deleteMany({});

    // Create admin user
    adminUser = await User.create({
      email: 'admin@example.com',
      password: 'Admin1234',
      fullName: 'Admin User',
      role: 'admin',
      status: 'active'
    });

    // Create regular user
    regularUser = await User.create({
      email: 'user@example.com',
      password: 'User1234',
      fullName: 'Regular User',
      role: 'user',
      status: 'active'
    });

    // Wait a bit for users to be saved
    await new Promise(resolve => setTimeout(resolve, 50));

    // Generate token with the user ID
    adminToken = generateToken(adminUser._id);
  });

  describe('GET /api/admin/users', () => {
    it('should get all users with pagination (admin only)', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.users).toBeInstanceOf(Array);
      expect(response.body.total).toBe(2);
      expect(response.body.page).toBe(1);
    });

    it('should reject access for non-admin users', async () => {
      // Generate token directly for regular user
      const userToken = generateToken(regularUser._id);

      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/admin/users/:id/activate', () => {
    it('should activate a user account (admin only)', async () => {
      // Deactivate user first
      regularUser.status = 'inactive';
      await regularUser.save();
      
      // Refresh user from database
      regularUser = await User.findById(regularUser._id);

      const response = await request(app)
        .put(`/api/admin/users/${regularUser._id.toString()}/activate`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user.status).toBe('active');
    });
  });

  describe('PUT /api/admin/users/:id/deactivate', () => {
    it('should deactivate a user account (admin only)', async () => {
      const response = await request(app)
        .put(`/api/admin/users/${regularUser._id.toString()}/deactivate`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user.status).toBe('inactive');
    });

    it('should prevent admin from deactivating themselves', async () => {
      const response = await request(app)
        .put(`/api/admin/users/${adminUser._id.toString()}/deactivate`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('cannot deactivate');
    });
  });
});

