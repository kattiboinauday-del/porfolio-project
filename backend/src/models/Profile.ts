import mongoose, { Schema, type InferSchemaType } from "mongoose";

const statSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
    icon: { type: String, required: true },
  },
  { _id: false },
);

const profileSchema = new Schema(
  {
    name: { type: String, required: true },
    roles: [{ type: String }],
    heroTagline: { type: String, required: true },
    heroDescription: { type: String, required: true },
    aboutParagraphs: [{ type: String }],
    stats: [statSchema],
    availability: { type: String, required: true },
    initials: { type: String, default: "UK" },
  },
  { timestamps: true },
);

export type ProfileDocument = InferSchemaType<typeof profileSchema> & { _id: mongoose.Types.ObjectId };
export const Profile = mongoose.model("Profile", profileSchema);
