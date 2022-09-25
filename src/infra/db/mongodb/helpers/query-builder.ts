export class QueryBuilder {
  private readonly query = [];

  private addStep(step: string, data: Record<string, unknown>): QueryBuilder {
    this.query.push({
      [step]: data,
    });
    return this;
  }

  match(data: Record<string, unknown>): QueryBuilder {
    return this.addStep('$match', data);
  }

  group(data: Record<string, unknown>): QueryBuilder {
    return this.addStep('$group', data);
  }

  sort(data: Record<string, unknown>): QueryBuilder {
    return this.addStep('$sort', data);
  }

  unwind(data: Record<string, unknown>): QueryBuilder {
    return this.addStep('$unwind', data);
  }

  lookup(data: Record<string, unknown>): QueryBuilder {
    return this.addStep('$lookup', data);
  }

  project(data: Record<string, unknown>): QueryBuilder {
    return this.addStep('$project', data);
  }

  build(): any[] {
    return this.query;
  }
}
