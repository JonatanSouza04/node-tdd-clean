import request from 'supertest';
import app from '../config/app';
import { noCache } from './no-cache';

describe('NoCache Middleware', () => {
  test('Should enable CORS', async () => {
    app.get('/test_nocache', noCache, (req, res) => {
      res.send();
    });

    await request(app)
      .get('/test_nocache')
      .expect(
        'cache-control',
        'np-store, no-cache, must-revalidate, proxy-revalidade',
      )
      .expect('pragma', 'no-cache')
      .expect('expires', '0')
      .expect('surrogate-control', 'no-store');
  });
});
