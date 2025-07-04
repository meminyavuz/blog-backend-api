const request = require('supertest');
const app = require('../src/app'); // Express uygulamanızın ana dosyası
const { sequelize } = require('../src/models/index'); // Sequelize bağlantısı
const User = require('../src/models/user.models/user.model'); // User modelini içe aktar

let token; // Kullanıcı oturum token'ı
let adminToken; // Admin oturum token'ı

beforeAll(async () => {
    // Veritabanını senkronize et
    await sequelize.sync({ force: false });

    // Test kullanıcılarını oluştur
    const testUser = await User.create({
        fullName: 'Test User',
        email: 'testuser@example.com',
        password: 'password123', // Şifre hashlenmiş olmalı
        roleId: process.env.AUTHOR_ROLE_ID, // Sabit bir rol ID'si
    });

    const testAdmin = await User.create({
        fullName: 'Test Admin',
        email: 'testadmin@example.com',
        password: 'password123', // Şifre hashlenmiş olmalı
        roleId: process.env.ADMIN_ROLE_ID, // Sabit bir admin rol ID'si
    });


    // Kullanıcı için giriş yap ve token al
    const userLoginResponse = await request(app)
        .post('/api/users/login')
        .send({
            email: 'testuser@example.com',
            password: 'password123',
        });

    token = userLoginResponse.body.token; // Kullanıcı token'ini kaydet

    // Admin için giriş yap ve token al
    const adminLoginResponse = await request(app)
        .post('/api/users/login')
        .send({
            email: 'testadmin@example.com',
            password: 'password123',
        });

    adminToken = adminLoginResponse.body.token; // Admin token'ini kaydet
});

afterAll(async () => {
    await sequelize.close();
});

describe('User Routes', () => {
    describe('POST /api/users/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/users/register')
                .send({
                    fullName: 'Test User',
                    email: 'testuser@example.com',
                    password: 'password123',
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('message', 'User registered. Please verify email.');
        });

        it('should return validation error for missing fields', async () => {
            const res = await request(app)
                .post('/api/users/register')
                .send({});

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message');
        });
    });

    describe('POST /api/users/forgot-password', () => {
        it('should send a password reset email', async () => {
            const res = await request(app)
                .post('/api/users/forgot-password')
                .send({
                    email: 'testuser@example.com',
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Password reset email sent.');
        });

        it('should return error for non-existent email', async () => {
            const res = await request(app)
                .post('/api/users/forgot-password')
                .send({
                    email: 'nonexistent@example.com',
                });

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'User not found');
        });
    });

    describe('PUT /api/users/profile', () => {
        it('should update the user profile', async () => {
            const res = await request(app)
                .put('/api/users/profile')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    fullName: 'Updated User',
                    email: 'updateduser@example.com',
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Profile updated successfully.');
            expect(res.body.user).toHaveProperty('email', 'updateduser@example.com');
        });

        it('should return error for unauthorized access', async () => {
            const res = await request(app)
                .put('/api/users/profile')
                .send({
                    fullName: 'Updated User',
                });

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'Unauthorized');
        });
    });

    describe('PUT /api/users/assign-role', () => {
        it('should assign a role to a user', async () => {
            const res = await request(app)
                .put('/api/users/assign-role')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    userId: '460f4aeb-db36-436e-9842-b7bdd485f547', // Test kullanıcı ID'si
                    roleId: 'e985d994-02a6-4213-92c4-c744eadcc955', // Admin rolü ID'si
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Role assigned successfully.');
        });

        it('should return error for non-admin users', async () => {
            const res = await request(app)
                .put('/api/users/assign-role')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    userId: '460f4aeb-db36-436e-9842-b7bdd485f547',
                    roleId: 'e985d994-02a6-4213-92c4-c744eadcc955',
                });

            expect(res.statusCode).toBe(403);
            expect(res.body).toHaveProperty('message', 'Access denied. Admins only.');
        });
    });
});