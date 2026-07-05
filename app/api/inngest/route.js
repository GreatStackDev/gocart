import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import {
  syncUserDeletion,
  syncUserUpdation,
  syncUserCreation,
  deleteCouponOnExpiry
} from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [syncUserDeletion, syncUserUpdation, syncUserCreation, deleteCouponOnExpiry],
});
