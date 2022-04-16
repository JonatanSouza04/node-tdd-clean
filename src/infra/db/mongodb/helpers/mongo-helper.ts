import { MongoClient, Collection, ObjectId } from 'mongodb';

export const MongoHelper = {
  client: null as unknown as MongoClient,
  uri: null as unknown as string,

  async connect(uri): Promise<void> {
    this.uri = uri;
    this.client = await MongoClient.connect(uri);
  },

  async disconnect(): Promise<void> {
    this.client.close();
    this.client = null;
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client) await this.connect(this.uri);

    const collection = await this.client.db().collection(name);
    return collection;
  },

  map(collection: any, _id: string): any {
    return Object.assign({}, collection, { id: _id });
  },

  objectID(id: string): ObjectId {
    return new ObjectId(id);
  },
};
