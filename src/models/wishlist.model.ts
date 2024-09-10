import mongoose, { model } from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    product_variant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: false,
    },
  },
  { timestamps: true }
);
const Wishlist = model("Wishlist", wishlistSchema);

export default Wishlist;
