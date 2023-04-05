import mongoose, { Document, Model, ObjectId, Schema, model } from "mongoose";

export interface IAction extends Document {
    id: number;
    action: string;
    date: number;
}

const ActionSchema = new Schema({
    id: {
        type: Number,
    },
    action: {
        type: String,
    },
    date: {
        type: Number,
        default: Date.now(),
    },
});

const Action = model<IAction>("Action", ActionSchema);
export default Action;
