import request from 'supertest';
import { app } from '../../app';

it('returns null if user is not signed-in', async () => {
    const response = await request(app)
                        .get('/api/users/current-user')
                        .send({});
    
    expect(response.body.currentUser).toBeNull();
});

it('returns current-user if user is signed-in', async () => {
    const cookie = await global.signin();

    const response = await request(app)
        .get('/api/users/current-user')
        .set('Cookie', cookie)
        .send({});
    
    expect(response.body.currentUser).toBeDefined();
});
