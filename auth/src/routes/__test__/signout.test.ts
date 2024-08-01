import request from 'supertest';
import  { app } from '../../app';

it('have no cookie session after user signout', async () => {
    const cookie = await global.signin();

    const response = await request(app)
        .post('/api/users/signout')
        .set('Cookie', cookie)
        .send({});
    
    const responseCookie = response.get('Set-Cookie')
    expect(responseCookie).toEqual(["session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"]);
});