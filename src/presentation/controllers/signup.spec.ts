import { SignUpController } from './signup';

describe('SignUp Controller', () => {
  test('Should return 100 if name is provider', () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        name: 'Jonatan Souza',
        email: 'jonatan@gmail.com',
        password: '123456',
        passwordConfirm: '123456',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
  });
});
