export class ForbiddenError extends Error {
  constructor(stack: string) {
    super('ForbiddenError');
    this.name = 'ServerParamError';
    if (stack !== '') this.stack = stack;
  }
}
