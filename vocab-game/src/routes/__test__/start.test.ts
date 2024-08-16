import request from 'supertest';
import { app } from '../../app';

it('returns firstVocabulary when start the game', async () => {
    const response = await request(app)
        .get('/api/games/start')
        .send({})
        .expect(200);

    expect(response.body.firstVocabular).toBeDefined();
});

it('assign current vocab cookie session when start the game', async () => {
    const response = await request(app)
        .get('/api/games/start')
        .send({})
        .expect(200);
    
    const cookie = response.get('Set-Cookie');
    expect(cookie).toBeDefined();
});
