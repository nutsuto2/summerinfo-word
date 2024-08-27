import request from 'supertest';
import { app } from '../../app';

it('returns 401 when the user is not sign in', async () => {
    await request(app)
        .get('/api/game/start')
        .send({})
        .expect(401);
});

it('returns firstVocabulary when start the game', async () => {
    const response = await request(app)
        .get('/api/game/start')
        .send({})
        .set('Cookie', await global.signin())
        .expect(200);

    expect(response.body.firstVocabulary).toBeDefined();
});

it('assign current vocab cookie session when start the game', async () => {
    const response = await request(app)
        .get('/api/game/start')
        .send({})
        .set('Cookie', await global.signin())
        .expect(200);

    const cookie = response.get('Set-Cookie');
    expect(cookie).toBeDefined();
});


it('assign used vocabularies cookie session when start the game', async () => {
    const response = await request(app)
        .get('/api/game/start')
        .send({})
        .set('Cookie', await global.signin())
        .expect(200);

    const cookie = response.get('Set-Cookie');
    expect(cookie).toBeDefined();
});
