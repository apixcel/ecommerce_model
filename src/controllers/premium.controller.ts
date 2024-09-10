import catchAsyncError from "../middlewares/catchAsyncErrors";
import Subscription from "../models/subscription.model";

export const specialContent = catchAsyncError(async (req, res) => {
  const subscription = req.subscription;
  const result = await Subscription.findByIdAndUpdate(
    subscription._id,
    {
      $inc: { currentCredit: -1 },
    },
    { new: true }
  );

  res.send({ message: "Hey subscribed user", result });
});
