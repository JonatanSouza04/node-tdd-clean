export class ForbiddenError extends Error {
  constructor(stack: string) {
    super(stack);
    this.name = 'ForbiddenError';
  }
}
