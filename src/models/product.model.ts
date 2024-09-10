import mongoose, { Document, Schema } from "mongoose";

interface IProduct extends Document {
  product_name: string;
  url_slug: string;
  category_id: mongoose.Schema.Types.ObjectId;
  description?: string;
  price: number;
  stock_quantity: number;
  status: "active" | "inactive";
}

const productSchema: Schema<IProduct> = new Schema(
  {
    product_name: { type: String, required: true },
    url_slug: { type: String, required: true, unique: true },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: { type: String },
    price: { type: Number, required: true },
    stock_quantity: { type: Number, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model<IProduct>("Product", productSchema);

export default ProductModel;
