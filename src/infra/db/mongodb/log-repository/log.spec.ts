import { LogError } from './log';

describe('Test LogErros', () => {
  test('Test call log', () => {
    const sut = new LogError();
    const value = jest.spyOn(sut, 'log');
    sut.log('log_error');
    expect(value).toHaveBeenCalledWith('log_error');
  });
});
