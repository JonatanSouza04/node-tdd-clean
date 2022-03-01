import { SignUpController } from './signup';
import { MissingParamError, InvalidParamError, ServerError } from '../../erros';
import {
  EmailValidator,
  AccountModel,
  AddAccount,
  AddAccountModel,
  HttpRequest,
  Validation,
} from './signup-protocols';

import { ok, serverError, badRequest } from '../../helpers/http-helper';

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return await new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new AddAccountStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null as unknown as Error;
    }
  }

  return new ValidationStub();
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'Jonatan Souza',
    email: 'invalid_email@gmail.com',
    password: '123456',
    passwordConfirm: '123456',
  },
});

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@gmail.com',
  password: 'valid_password',
});

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const sut = new SignUpController(
    emailValidatorStub,

    addAccountStub,
    validationStub,
  );

  return {
    sut,
    emailValidatorStub,
    addAccountStub,
    validationStub,
  };
};

describe('SignUp Controller', () => {
  test('Should return 400 if name is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'jonatan@gmail.com',
        password: '123456',
        passwordConfirm: '123456',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')));
  });

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'Jonatan Souza',
        password: '123456',
        passwordConfirm: '123456',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'Jonatan Souza',
        email: 'jonatan@gmail.com',
        passwordConfirm: '123456',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  test('Should return 400 if no confirmation is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'Jonatan Souza',
        email: 'jonatan@gmail.com',
        password: '123456',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('passwordConfirm')),
    );
  });

  test('Should return 400 if an email invalid is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    const httpRequest = {
      body: {
        name: 'Jonatan Souza',
        email: 'test_email@gmail.com',
        password: '123456',
        passwordConfirm: '123456',
      },
    };
    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith('test_email@gmail.com');
  });

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  test('Should return 400 if no password confirmation fails', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'Jonatan Souza',
        email: 'jonatan@gmail.com',
        password: '1234',
        passwordConfirm: 'invalid',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError('passwordConfirm')),
    );
  });

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add');

    await sut.handle(makeFakeRequest());
    expect(addSpy).toHaveBeenCalledWith({
      name: 'Jonatan Souza',
      email: 'invalid_email@gmail.com',
      password: '123456',
    });
  });

  test('Should return 500 if Account throws', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()));
    });

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError('Error Intern')));
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});
