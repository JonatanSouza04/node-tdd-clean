export class ServerError extends Error {
  constructor(stack) {
    super('Internal Server Error');
    this.name = 'ServerParamError';
    if (stack !== '') this.stack = stack;
  }
}
