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

export const addTask = mutationWithAuth({
  args: {
    name: v.string(),
    reward: v.number(),
    action: v.object({
      link: v.string(),
      type: v.union(
        v.literal("visit"),
        v.literal("follow"),
        v.literal("post"),
        v.literal("join"),
      ),
      socialNetwork: v.union(
        v.literal("twitter"),
        v.literal("telegram"),
        v.literal("discord"),
        v.literal("website"),
      ),
    }),
  },
  handler: async (ctx, args) =>
    await ctx.db.insert("tasks", {
      name: args.name,
      reward: args.reward,
      action: args.action,
    }),
});

export const updateTask = mutationWithAuth({
  args: {
    taskId: v.id("tasks"),
    name: v.string(),
    reward: v.number(),
    action: v.object({
      link: v.string(),
      type: v.union(
        v.literal("visit"),
        v.literal("follow"),
        v.literal("post"),
        v.literal("join"),
      ),
      socialNetwork: v.union(
        v.literal("twitter"),
        v.literal("telegram"),
        v.literal("discord"),
        v.literal("website"),
      ),
    }),
  },
  handler: async (ctx, args) =>
    await ctx.db.replace(args.taskId, {
      name: args.name,
      reward: args.reward,
      action: args.action,
    }),
});
