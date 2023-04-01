import cron from "node-cron";
import Gig from "../models/gig.model.js";

const job = cron.schedule("0 0 * * *", async () => {
  const pinnedGigs = await Gig.find({
    pinned: true,
    pinnedAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });
  pinnedGigs.forEach(async (gig) => {
    gig.pinned = false;
    await gig.save();
  });
});

export default job