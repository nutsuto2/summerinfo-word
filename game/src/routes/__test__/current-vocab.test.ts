import request from 'supertest';
import { app } from '../../app';

it('returns current vocabularies', async () => {
    await request(app)
        .get('/api/game/start')
        .send({})
        .set('Cookie', await global.signin())
        .expect(200);

    const response = await request(app)
        .get('/api/game/current-vocabulary')
        .send({})
        .set('Cookie', await global.signin())
        .expect(200);
    
    expect(response.body.currentVocabulary).toBeDefined();
});
