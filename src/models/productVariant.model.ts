import mongoose, { Document, Schema } from "mongoose";

interface IProductVariant extends Document {
  product_id: mongoose.Schema.Types.ObjectId;
  color?: string;
  size?: string;
  price: number;
  stock_quantity: number;
}

const productVariantSchema: Schema<IProductVariant> = new Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    color: { type: String },
    size: { type: String },
    price: { type: Number, required: true },
    stock_quantity: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const ProductVariant = mongoose.model<IProductVariant>(
  "ProductVariant",
  productVariantSchema
);

export default ProductVariant;
