/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Model, model, Schema } from 'mongoose';
import { BaseModel } from './baseModel';

describe('BaseModel', () => {
    it('should be able to create a new model', () => {
        const modelName = 'test;'
        const schema = new Schema();
        const NewModel = model(modelName, schema);
        const newModel = new BaseModel<any>(modelName, '/test',schema, NewModel);
        expect(newModel).toBeDefined();
        expect(newModel.Model).toBeTruthy();
        const retrievedModel = BaseModel.getModel(modelName);
        expect(retrievedModel).toBe(newModel.Model);
        expect(retrievedModel.modelName).toBe(modelName);
    });
    it('should not allow the same model to be added twice', () => {
        const schema1 = new Schema();
        const NewModel1 = model('test', schema1);
        const schema2 = new Schema();
        const NewModel2 = model('test', schema2);
        const newModel1 = new BaseModel<any>('test', '/test', schema1, NewModel1);
        const newModel2 = new BaseModel<any>('test2', '/test', schema2, NewModel2);
        const schema3 = new Schema();
        const NewModel3 = model('test', schema3);
        expect(() => new BaseModel<any>('test', '/test', schema3, NewModel3)).toThrowError('Cannot overwrite `test` model once compiled.');
    });
});