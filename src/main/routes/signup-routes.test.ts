import request from 'supertest';
import app from '../config/app';

describe('SignUp Routes', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'valid_name',
        email: 'valid_email@gmail.com',
        password: '1234',
        passwordConfirmation: '1234',
      })
      .expect(200);
  });
});