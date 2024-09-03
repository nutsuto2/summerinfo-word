import request from 'supertest';
import { app } from '../../app';

it('returns used vocabularies', async () => {
    await request(app)
        .get('/api/game/start')
        .send({})
        .set('Cookie', await global.signin())
        .expect(200);

    const response = await request(app)
        .get('/api/game/used-vocabularies')
        .send({})
        .set('Cookie', await global.signin())
        .expect(200);
    
    expect(response.body.usedVocabularies).toBeDefined();
});
