// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IHasCreator<T = any> {
    /**
     * The MongoDB unique identifier for the user who created the object.
     */
    createdBy: T;
}