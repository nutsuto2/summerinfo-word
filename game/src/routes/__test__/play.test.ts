import request from 'supertest';
import { app } from '../../app';

it('returns 401 when the user is not sign in', async () => {
    await request(app)
        .post('/api/game/play')
        .send({
            connectingVocabulary: 'dasdpdkpk'
        })
        .expect(401);
});

it('returns 403 when the input length is not 5', async () => {
    await request(app)
        .post('/api/game/play')
        .send({
            connectingVocabulary: 'dasdpdkpk'
        })
        .set('Cookie', await global.signin())
        .expect(403);
});

it('returns 400 when there is no current vocab or used vocab', async () => {
    await request(app)
        .post('/api/game/play')
        .send({
            connectingVocabulary: 'racer'
        })
        .set('Cookie', await global.signin())
        .expect(400);
});

it('returns 400 when the connecting vocab is already used', async () => {
    await request(app)
        .post('/api/game/play')
        .send({
            connectingVocabulary: 'radar'
        })
        .set('Cookie', await global.gameStart('radar'))
        .expect(400);
});

it('returns 200 when the vocab can be used', async () => {
    await request(app)
        .post('/api/game/play')
        .send({
            connectingVocabulary: 'racer'
        })
        .set('Cookie', await global.gameStart('radar'))
        .expect(200);
});

it('returns 400 when the vocab is unconnectable', async () => {
    await request(app)
        .post('/api/game/play')
        .send({
            connectingVocabulary: 'erupt'
        })
        .set('Cookie', await global.gameStart('radar'))
        .expect(400);
});
