import { LoginController, Request } from './login-controller';
import {
  badRequest,
  serverError,
  unAuthorized,
  ok,
} from '../../helpers/http/http-helper';
import { MissingParamError } from '../../erros';

import { Authentication, Validation } from './login-controller-protocols';
import { mockThrowError } from '@/domain/mocks';
import { mockValidation } from '@/validation/mocks';
import { mockAuthentication } from '@/presentation/mocks';
import { faker } from '@faker-js/faker';

type SutTypes = {
  sut: LoginController;
  authenticationStub: Authentication;
  validationStub: Validation;
};

const makeSut = (): SutTypes => {
  const validationStub = mockValidation();
  const authenticationStub = mockAuthentication();
  const sut = new LoginController(authenticationStub, validationStub);

  return {
    sut,
    authenticationStub,
    validationStub,
  };
};

const mockRequest = (): Request => ({
  email: faker.internet.email.toString(),
  password: faker.internet.password.toString(),
});

describe('Login Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');
    const request = mockRequest();
    await sut.handle(request);
    expect(authSpy).toHaveBeenCalledWith({
      email: request.email,
      password: request.password,
    });
  });

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();
    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(new Promise((resolve) => resolve('')));

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(unAuthorized());
  });

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut();
    jest
      .spyOn(authenticationStub, 'auth')
      .mockImplementationOnce(mockThrowError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }));
  });

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');

    const request = mockRequest();
    await sut.handle(request);

    expect(validateSpy).toHaveBeenCalledWith(request);
  });

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'));

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('any_field')),
    );
  });
});
