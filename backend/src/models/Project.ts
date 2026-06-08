import mongoose, { Schema, type InferSchemaType } from "mongoose";

const projectSchema = new Schema(
  {
    title: { type: String, required: true },
    period: { type: String, required: true },
    stack: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
    github: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type ProjectDocument = InferSchemaType<typeof projectSchema> & { _id: mongoose.Types.ObjectId };
export const Project = mongoose.model("Project", projectSchema);
