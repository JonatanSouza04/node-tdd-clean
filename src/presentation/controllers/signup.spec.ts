import { SignUpController } from './signup';
import { MissingParamError } from '../erros/missing-param-error';

describe('SignUp Controller', () => {
  test('Should return 400 if name is provided', () => {
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
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  test('Should return 400 if no email is provided', () => {
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
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  test('Should return 400 if no password is provided', () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        name: 'Jonatan Souza',
        email: 'jonatan@gmail.com',
        passwordConfirm: '123456',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });
});
