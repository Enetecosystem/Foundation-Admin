import { v } from "convex/values";
import { mutationWithAuth } from "@convex-dev/convex-lucia-auth";

// Write your Convex functions in any file inside this directory (`convex`).
// See https://docs.convex.dev/functions for more.

// You can read data from the database via a query:

export const deleteUserWithId = mutationWithAuth({
  args: { userId: v.id("user") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.userId);
  },
});

export const deleteTaskWithId = mutationWithAuth({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => await ctx.db.delete(args.taskId),
});
