// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IHasUpdater<T = any> {
    /**
     * The MongoDB unique identifier for the user who updated the object.
     */
    updatedBy: T;
}