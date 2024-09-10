import Plan from "../models/plan.model";

export const SubscriptionSeed = async () => {
  const isExist = await Plan.findOne({ name: "Free Trial" });

  if (!isExist) {
    Plan.create({
      name: "Free Trial",
      description: "",
      duration: 10,
      credit: 5,
      price: 0,
    });
  }
};
