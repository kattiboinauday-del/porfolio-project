import mongoose, { Schema, type InferSchemaType } from "mongoose";

const experienceEntrySchema = new Schema(
  {
    type: { type: String, enum: ["internship", "education"], required: true },
    title: { type: String, required: true },
    organization: { type: String, required: true },
    period: { type: String, required: true },
    location: { type: String },
    description: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type ExperienceEntryDocument = InferSchemaType<typeof experienceEntrySchema> & {
  _id: mongoose.Types.ObjectId;
};
export const ExperienceEntry = mongoose.model("ExperienceEntry", experienceEntrySchema);
