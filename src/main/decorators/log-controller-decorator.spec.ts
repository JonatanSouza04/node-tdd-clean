import { Controller, HttpResponse } from '@/presentation/protocols';
import { LogControllerDecorator } from './log-controller-decorator';
import { serverError, ok } from '@/presentation/helpers/http/http-helper';
import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository';
import { mockLogErrorRepository } from '@/data/mocks';
import { mockAccountModel } from '@/domain/mocks';

type SutTypes = {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
};

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(request: any): Promise<HttpResponse> {
      return await Promise.resolve(ok(mockAccountModel()));
    }
  }

  return new ControllerStub();
};

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = mockLogErrorRepository();
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub,
  );

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub,
  };
};

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');

    const request = {
      email: 'any_email',
      name: 'any_name',
      password: '_any_password',
      passwordConfirm: 'any_password',
    };
    await sut.handle(request);
    expect(handleSpy).toHaveBeenCalledWith(request);
  });

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut();

    const request = {
      email: 'any_email',
      name: 'any_name',
      password: '_any_password',
      passwordConfirm: 'any_password',
    };
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(ok(mockAccountModel()));
  });

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();

    const fakeError = new Error();
    fakeError.stack = 'any_error';

    const error = serverError(fakeError);
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');

    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(new Promise((resolve) => resolve(error)));

    const request = {
      body: {
        email: 'any_email',
        name: 'any_name',
        password: '_any_password',
        passwordConfirm: 'any_password',
      },
    };
    await sut.handle(request);
    expect(logSpy).toHaveBeenCalledWith('any_error');
  });
});
