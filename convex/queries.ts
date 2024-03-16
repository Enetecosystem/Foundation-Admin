import { queryWithAuth } from "@convex-dev/convex-lucia-auth";
import { query } from "./_generated/server";

export const dashboardData = queryWithAuth({
  args: {},
  handler: async ({ db }) => {
    const users = await db.query("user").order("asc").collect();

    // Filter and extract

    const totalMined = users.reduce((c, obj) => c + (obj.minedCount ?? 0), 0);
    const totalXp = users.reduce((c, obj) => c + (obj.xpCount ?? 0), 0);
    const totalReferrals = users.reduce(
      (c, obj) => c + (obj.referralCount ?? 0),
      0,
    );
    const totalUsers = users.length;
    const recentUsers = users.slice(0, 5);

    return { totalMined, totalXp, totalReferrals, totalUsers, recentUsers };
  },
});
