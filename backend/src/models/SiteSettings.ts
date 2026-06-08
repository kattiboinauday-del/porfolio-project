import mongoose, { Schema, type InferSchemaType } from "mongoose";

const siteSettingsSchema = new Schema(
  {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    github: { type: String, required: true },
    linkedin: { type: String, default: "" },
    resumeUrl: { type: String, default: "/api/resume" },
    footerText: { type: String, default: "Built with ♥ by K. Uday Kiran · © 2025" },
  },
  { timestamps: true },
);

export type SiteSettingsDocument = InferSchemaType<typeof siteSettingsSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const SiteSettings = mongoose.model("SiteSettings", siteSettingsSchema);
