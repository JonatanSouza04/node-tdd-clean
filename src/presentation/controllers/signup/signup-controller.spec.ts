import { SignUpController } from './signup-controller';
import { MissingParamError, ServerError, ForbiddenError } from '../../erros';
import {
  AddAccount,
  Validation,
  Authentication,
} from './signup-controller-protocols';

import {
  ok,
  serverError,
  badRequest,
  forbidden,
} from '../../helpers/http/http-helper';

import { mockRequestAddAccount, mockReturnNull } from '@/domain/mocks';
import { mockValidation } from '@/validation/mocks';
import { mockAddAccount, mockAuthentication } from '@/presentation/mocks';

type SutTypes = {
  sut: SignUpController;
  addAccountStub: AddAccount;
  validationStub: Validation;
  authenticationStub: Authentication;
};

const makeSut = (): SutTypes => {
  const addAccountStub = mockAddAccount();
  const validationStub = mockValidation();
  const authenticationStub = mockAuthentication();
  const sut = new SignUpController(
    addAccountStub,
    validationStub,
    authenticationStub,
  );

  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub,
  };
};

describe('SignUp Controller', () => {
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add');

    await sut.handle(mockRequestAddAccount());
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    });
  });

  test('Should return 500 if Account throws', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()));
    });

    const httpResponse = await sut.handle(mockRequestAddAccount());
    expect(httpResponse).toEqual(serverError(new ServerError('Error Intern')));
  });

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(mockReturnNull);
    const httpResponse = await sut.handle(mockRequestAddAccount());
    expect(httpResponse).toEqual(
      forbidden(new ForbiddenError('Email is already used')),
    );
  });

  test('Should returns an token on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequestAddAccount());
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }));
  });

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = mockRequestAddAccount();
    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'));

    const httpResponse = await sut.handle(mockRequestAddAccount());
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('any_field')),
    );
  });

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');
    await sut.handle(mockRequestAddAccount());
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password',
    });
  });
});
