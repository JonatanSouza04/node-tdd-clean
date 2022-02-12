import { MongoClient, Collection } from 'mongodb';

export const MongoHelper = {
  client: null as unknown as MongoClient,
  async connect(url: string): Promise<void> {
    this.client = await MongoClient.connect(url);
  },

  async disconnect(): Promise<void> {
    await this.client.close();
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name);
  },

  map(collection: any, _id: string): any {
    return Object.assign({}, collection, { id: _id });
  },
};
