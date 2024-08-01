import request from 'supertest';
import { app } from '../../app';

it('returns 403 when user do not enter username', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            password: 'Test1234@'
        })
        .expect(403);
});

it('returns 404 when user provide wrong username', async () => {
    const email = "test@test.com";
    const username = "tester";
    const password = "Test1234@";

    await request(app)
        .post('/api/users/signup')
        .send({
            email, username, password
        })
        .expect(201);
    
    await request(app)
        .post('/api/users/signin')
        .send({
            username: 'testtt',
            password: password
        })
        .expect(404);
});

it('returns 403 when user do not enter password', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            username: 'tester'
        })
        .expect(403);
});

it('returns 404 when user provide wrong password', async () => {
    const email = "test@test.com";
    const username = "tester";
    const password = "Test1234@";

    await request(app)
        .post('/api/users/signup')
        .send({
            email, username, password
        })
        .expect(201);
    
    await request(app)
        .post('/api/users/signin')
        .send({
            username: username,
            password: 'Test1234'
        })
        .expect(404);
});

it('returns 200 and assign jwt cookie session', async () => {
    const email = "test@test.com";
    const username = "tester";
    const password = "Test1234@";

    await request(app)
        .post('/api/users/signup')
        .send({
            email, username, password
        })
        .expect(201);
    
    const cookie = await request(app)
        .post('/api/users/signin')
        .send({
            username, password
        })
        .expect(200);
    
    expect(cookie).toBeDefined();
});
