export class ForbiddenError extends Error {
  constructor(stack: string) {
    super('Access denied (ForbiddenError)');
    this.name = 'ServerParamError';
    if (stack !== '') this.stack = stack;
  }
}
