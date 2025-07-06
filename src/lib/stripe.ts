import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-06-30.basil",
  typescript: true,
  maxNetworkRetries: 3,
});
export default stripe;
