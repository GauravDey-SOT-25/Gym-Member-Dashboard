/* [ROLE #19 - Backend Simulation & Integration Support]
   Fake async layer simulating latency + occasional failure.
   Replace with real fetch() calls when wiring to a real backend. */
import { currentMember, upcomingBookings, transactions, type Member } from "./members";
import { activitySeries, muscleGroups, facilityHeatmap, membershipUsage, type Range } from "./analytics";
import { rewards, recentPoints, nextTier } from "./rewards";

const delay = (ms = 500) => new Promise((res) => setTimeout(res, ms));

export const api = {
  async getMember(): Promise<Member> {
    await delay(300);
    return currentMember;
  },
  async getBookings() {
    await delay(400);
    return upcomingBookings;
  },
  async getTransactions() {
    await delay(450);
    return transactions;
  },
  async getActivity(range: Range) {
    await delay(500);
    return activitySeries[range];
  },
  async getMuscleGroups() {
    await delay(450);
    return muscleGroups;
  },
  async getFacility() {
    await delay(350);
    return facilityHeatmap;
  },
  async getMembershipUsage() {
    await delay(400);
    return membershipUsage;
  },
  async getRewards() {
    await delay(400);
    return { rewards, recentPoints, nextTier };
  },
};
