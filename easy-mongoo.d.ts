// Type definitions for easy-mongoo
export = easyMongoo;

declare const easyMongoo: EasyMongoo;

interface EasyMongoo {
  connect(uri: string, options?: object): Promise<any>;
  disconnect(): Promise<void>;
  schema(definition: object, options?: object): any;
  model(name: string, schema: object | any): any;
  create(modelName: string, data: object): Promise<any>;
  find(modelName: string, filter?: object, options?: object): Promise<any[]>;
  findOne(modelName: string, filter?: object, options?: object): Promise<any>;
  findById(modelName: string, id: string, options?: object): Promise<any>;
  update(modelName: string, filter: object, data: object, options?: object): Promise<any>;
  updateById(modelName: string, id: string, data: object, options?: object): Promise<any>;
  delete(modelName: string, filter: object, options?: object): Promise<any>;
  deleteById(modelName: string, id: string): Promise<any>;
  count(modelName: string, filter?: object): Promise<number>;
  aggregate(modelName: string, pipeline: any[]): Promise<any[]>;
  populate(modelName: string, docs: any, paths: string | string[]): Promise<any>;
  startSession(): Promise<any>;
  transaction(callback: Function): Promise<any>;
  createIndex(modelName: string, index: object, options?: object): Promise<void>;
  pre(modelName: string, hook: string, callback: Function): void;
  post(modelName: string, hook: string, callback: Function): void;
  virtual(modelName: string, field: string, getter?: Function, setter?: Function): void;
  static(modelName: string, name: string, method: Function): void;
  method(modelName: string, name: string, method: Function): void;
  query(modelName: string, name: string, helper: Function): void;
  validate(modelName: string, path: string, validator: Function, message: string): void;
  plugin(modelName: string, plugin: Function, options?: object): void;
  dropDatabase(): Promise<void>;
  clearAll(): Promise<void>;
  status(): object;
  isReady(): boolean;
  readonly mongoose: any;
  collection(name: string): any;
  readonly schemasTemplates: {
    user: object;
    product: object;
    post: object;
  };
}