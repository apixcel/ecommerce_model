import mongoose, { Document, Schema } from "mongoose";

interface ICategory extends Document {
  category_name: string;
  url_slug: string;
  parent_cat_id?: mongoose.Schema.Types.ObjectId;
  status: "active" | "inactive";
}

const categorySchema: Schema<ICategory> = new Schema(
  {
    category_name: { type: String, required: true },
    url_slug: { type: String, required: true, unique: true },
    parent_cat_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
