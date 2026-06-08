import mongoose, { Schema, type InferSchemaType } from "mongoose";

const blogPostSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    date: { type: String, required: true },
    excerpt: { type: String, required: true },
    tags: [{ type: String }],
    content: { type: String, required: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type BlogPostDocument = InferSchemaType<typeof blogPostSchema> & { _id: mongoose.Types.ObjectId };
export const BlogPost = mongoose.model("BlogPost", blogPostSchema);
