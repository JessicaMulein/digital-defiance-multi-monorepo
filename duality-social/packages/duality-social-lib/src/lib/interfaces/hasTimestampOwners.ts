import { IHasCreator } from "./hasCreator";
import { IHasUpdater } from "./hasUpdater";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IHasTimestampOwners<T = any> extends IHasCreator<T>, IHasUpdater<T> {
    /**
     * The MongoDB unique identifier for the user who created the object.
     */
    createdBy: T;
    /**
     * The MongoDB unique identifier for the user who updated the object.
     */
    updatedBy: T;
}