const request = require('supertest');
const app = require('../server');

describe('API endpoints', () => {
  // note: these tests expect a running PostgreSQL instance with the schema loaded.
  // you can quickly bring one up via `docker-compose up -d database` as defined
  // in the project root.

  it('should respond to health check', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'healthy');
  });

  it('should list tasks (empty or seeded)', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create, update and delete a task', async () => {
    // create
    const createRes = await request(app)
      .post('/api/tasks')
      .send({ title: 'test task', description: 'desc', status: 'todo' });
    expect(createRes.statusCode).toBe(201);
    expect(createRes.body).toHaveProperty('id');
    const id = createRes.body.id;

    // update
    const updateRes = await request(app)
      .put(`/api/tasks/${id}`)
      .send({ status: 'done' });
    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body).toHaveProperty('status', 'done');

    // delete
    const deleteRes = await request(app).delete(`/api/tasks/${id}`);
    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body).toHaveProperty('message', 'Task deleted');
  });
});
