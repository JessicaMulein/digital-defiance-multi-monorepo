// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IHasID<T = any> {
    /**
     * The MongoDB unique identifier for the object.
     */
    _id?: T;
}