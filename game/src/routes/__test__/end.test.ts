import request from 'supertest';
import { app } from '../../app';

it('returns 200 when game is finished', async() => {
    const response = await request(app)
        .get('/api/game/end')
        .send({})
        .set('Cookie', await global.gameClear())
        .expect(200);
});
