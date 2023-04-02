// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IHasDeleter<T = any> {
    /**
     * The MongoDB unique identifier for the user who deleted the object.
     */
    deletedBy?: T;
}