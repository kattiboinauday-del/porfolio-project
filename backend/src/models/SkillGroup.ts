import mongoose, { Schema, type InferSchemaType } from "mongoose";

const skillGroupSchema = new Schema(
  {
    icon: { type: String, required: true },
    title: { type: String, required: true },
    items: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type SkillGroupDocument = InferSchemaType<typeof skillGroupSchema> & { _id: mongoose.Types.ObjectId };
export const SkillGroup = mongoose.model("SkillGroup", skillGroupSchema);
