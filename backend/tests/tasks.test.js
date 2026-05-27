const request = require('supertest');
const app = require('../src/app');

let token;

beforeAll(async () => {
  // Register and login to get token
  await request(app)
    .post('/api/auth/register')
    .send({
      username: 'taskuser',
      email: 'taskuser@example.com',
      password: 'password123'
    });

  const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'taskuser@example.com',
      password: 'password123'
    });

  token = res.body.token;
});

describe('Task Endpoints', () => {

  describe('GET /api/tasks', () => {
    it('should return empty task list for new user', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should reject request without token', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Task',
          description: 'Test Description',
          status: 'todo'
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe('Test Task');
      expect(res.body.status).toBe('todo');
    });

    it('should fail to create task without title', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ description: 'No title task' });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update an existing task', async () => {
      const create = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Task to Update', status: 'todo' });

      const res = await request(app)
        .put(`/api/tasks/${create.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated Task', status: 'in-progress' });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('in-progress');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete an existing task', async () => {
      const create = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Task to Delete', status: 'todo' });

      const res = await request(app)
        .delete(`/api/tasks/${create.body.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Task deleted successfully');
    });

    it('should return 404 for non-existent task', async () => {
      const res = await request(app)
        .delete('/api/tasks/99999')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(404);
    });
  });
});