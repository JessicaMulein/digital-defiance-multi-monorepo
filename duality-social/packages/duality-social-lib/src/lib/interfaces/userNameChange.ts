import { Document } from "mongoose"

export interface IUserNameChange extends Document {
    oldName: string
    newName: string
    createdAt: Date
    createdBy: string
}