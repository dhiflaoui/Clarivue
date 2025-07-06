import { auth } from "@clerk/nextjs/server";
import prismadb from "./prisma";
import stripe from "./stripe";

export const isValidSubscription = async () => {
  const { userId } = await auth();
  if (!userId) return false;
  const subscription = await prismadb.subscription.findFirst({
    where: {
      userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripePriceId: true,
    },
  });
  if (!subscription) return false;
  const isValid =
    subscription.stripePriceId &&
    subscription.stripeCurrentPeriodEnd?.getTime()! > Date.now();
  return isValid;
};
export const generateBillingLink = async () => {
  const defaultUrl = process.env.BASE_URL + "/documents";
  const { userId } = await auth();
  if (!userId) return false;
  const subscription = await prismadb.subscription.findUnique({
    where: {
      userId,
    },
  });
  if (!subscription || !subscription.stripeCustomerId) {
    return false;
  }
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: defaultUrl,
  });
  return portalSession.url;
};
const MAX_FREE_DOCS = 3;
export const isMaxFreeDocuments = async () => {
  const { userId } = await auth();
  if (!userId) return false;
  const documents = await prismadb.subscription.findMany({
    where: {
      userId,
    },
  });
  if (documents && documents.length >= MAX_FREE_DOCS) return true;
  return false;
};

export const needToUpgrade = async () => {
  const isSubscribed = await isValidSubscription();
  const reachedFreeQuota = await isMaxFreeDocuments();
  if (!isSubscribed && reachedFreeQuota) {
    return true;
  }
  return false;
};
