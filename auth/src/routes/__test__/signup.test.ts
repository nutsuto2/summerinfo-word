import request from 'supertest';
import { app } from '../../app';

it('returns a 403 when user do not enter email', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            username: 'test1234',
            password: 'Test1234@'
        })
        .expect(403);
});

it('returns a 403 when user enter wrong format of email', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test',
            username: 'test1234',
            password: 'Test1234@'
        })
        .expect(403);
});

it('returns a 403 when user do not enter username', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'Test1234@'
        })
        .expect(403);
});

it('returns a 403 when user enter wrong format of username', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            username: 'test',
            password: 'Test1234@'
        })
        .expect(403);
});


it('returns a 403 when user do not enter password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            username: 'test1234'
        })
        .expect(403);
});

it('returns a 403 when user enter wrong format of password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            username: 'test1234',
            password: 'test1234'
        })
        .expect(403);
});

it('returns a 201 and assign jwt to cookie session', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            username: 'test1234',
            password: 'Test1234@'
        })
        .expect(201);
    
    const cookie = response.get('Set-Cookie');
    expect(cookie).toBeDefined();
    // create global signin function for testing
});

it('returns a 400 when the email or username is already used', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            username: 'test1234',
            password: 'Test1234@'
        })
        .expect(201);
    
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            username: 'test1234',
            password: 'Test1234@'
        })
        .expect(400);
});
