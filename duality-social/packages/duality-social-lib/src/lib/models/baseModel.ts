import {
  model as makeModel,
  Document,
  Model,
  Schema,
  UpdateWriteOpResult as UpdateResult,
} from 'mongoose';
import { IHasID } from '../interfaces/hasId';

abstract class Base {
  protected static ModelRegistry: Map<string, Model<unknown>> = new Map<
    string,
    Model<unknown>>();
  protected static InstanceRegistry: Map<string, Base&Document> = new Map<
    string,
    Base&Document>();
  constructor(model: Model<unknown>) {
    if (BaseModel.ModelRegistry.has(model.modelName)) {
      throw new Error(`Model ${model.modelName} already exists`);
    }
    BaseModel.ModelRegistry.set(model.modelName, model);
  }
  public static getModel<T>(model: string): Model<T & Document> {
    if (!BaseModel.ModelRegistry.has(model)) {
      throw new Error(`Model ${model} does not exist`);
    }
    return BaseModel.ModelRegistry.get(model) as Model<T & Document>;
  }
  public static getInstance<T extends Base>(model: string, id: string): T & Document {
    const key = `${model}:${id}`;
    if (!BaseModel.InstanceRegistry.has(key)) {
      throw new Error(`Instance ${key} does not exist`);
    }
    return BaseModel.InstanceRegistry.get(key) as T & Document;
  }
  protected static setInstance<T extends Base>(model: string, id: string, instance: T & Document): void {
    const key = `${model}:${id}`;
    BaseModel.InstanceRegistry.set(key, instance);
  }
}

export class BaseModel<
  T extends IHasID<U>,
  U = Schema.Types.ObjectId
> extends Base {
  public readonly Name: string;
  public readonly Path: string;
  public readonly Schema: Schema;
  public readonly Collection?: string;
  public readonly Model: Model<T & Document>;
  public readonly Document?: T & Document;
  constructor(
    name: string,
    path: string,
    schema: Schema,
    model: Model<T & Document>,
    collection?: string,
    doc?: T&Document | T
  ) {
    super(model as Model<unknown>);
    this.Name = name;
    this.Path = path;
    this.Schema = schema;
    this.Collection = collection;
    this.Model = model;
    if (doc) {
      this.addDocument(doc as T & Document);
    }
  }
  public getModel(): Model<T & Document> {
    return Base.getModel<T>(this.Name);
  }
  public async createNew(): Promise<T & Document> {
    if (this.Document === undefined) {
      throw new Error('model have document set');
    }
    const created = await this.Model.create(this.Document);
    if (created._id === undefined) {
      throw new Error('model have id set');
    }
    this.addDocument(created);
    return created;
  }
  public async update(): Promise<UpdateResult> {
    if (this.Document === undefined) {
      throw new Error('model have document set');
    }
    if (this.Document._id === undefined) {
      throw new Error('model have id set');
    }
    const updateStatus = await this.Model.updateOne({ _id: this.Document._id }, this.Document);
    this.addDocument(this.Document, true);
    return updateStatus;
  }
  public addDocument(doc: T & Document, overwrite = false): void {
    // TODO: detect new doc without id
    const document = new this.Model(doc);
    const key = `${this.Name}:${doc._id.toString()}`;
    if (!overwrite && BaseModel.InstanceRegistry.has(key)) {
        throw new Error(`Document ${key} already exists`);
    }
    Base.setInstance(key, doc._id.toString(), document);
  }
}
