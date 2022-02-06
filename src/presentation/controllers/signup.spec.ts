import { SignUpController } from './signup';

describe('SignUp Controller', () => {
  test('Should return 100 if name is provided', () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        email: 'jonatan@gmail.com',
        password: '123456',
        passwordConfirm: '123456',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new Error('Missing param: name'));
  });

  test('Should return 100 if no email is provided', () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        name: 'Jonatan Souza',
        password: '123456',
        passwordConfirm: '123456',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new Error('Missing param: email'));
  });
});
