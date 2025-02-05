import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  name?: string;
  contentTypes: string[];
  tags: string[];
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String },
    contentTypes: { type: [String], default: [] },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

// If the model exists, reuse it; otherwise, create a new model.
export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
