/* Application Storage & Config Constants */
export const STORAGE_KEY = "gym-dashboard-theme";
export const USER_DATA_KEY = "gym-dashboard-user-data";

export const THEMES = {
  DARK: "dark",
  LIGHT: "light",
};

export const DEFAULT_USER_DATA = {
  name: "Shashank",
  membershipTier: "Premium",
  weeklyGoal: 5,
  points: 1240,
  workouts: [
    {
      id: "w1",
      type: "Strength",
      name: "Upper Body Power Split",
      duration: 60,
      heartRate: 142,
      pointsEarned: 50,
      timestamp: "2026-05-24T10:30:00Z"
    },
    {
      id: "w2",
      type: "Cardio",
      name: "HIIT Rowing Workout",
      duration: 35,
      heartRate: 165,
      pointsEarned: 40,
      timestamp: "2026-05-23T17:15:00Z"
    },
    {
      id: "w3",
      type: "Strength",
      name: "Leg Day - Heavy Squats",
      duration: 50,
      heartRate: 138,
      pointsEarned: 50,
      timestamp: "2026-05-21T08:45:00Z"
    },
    {
      id: "w4",
      type: "Cardio",
      name: "Steady State Trail Run",
      duration: 45,
      heartRate: 152,
      pointsEarned: 45,
      timestamp: "2026-05-20T11:00:00Z"
    }
  ]
};

export const REWARD_STORE_ITEMS = [
  {
    id: "r1",
    name: "Pure Whey Protein Shake",
    description: "Post-workout performance blend with cold milk.",
    points: 150,
    icon: "🥤"
  },
  {
    id: "r2",
    name: "PowerGym Microfiber Towel",
    description: "Ultra-absorbent, fast-drying aesthetic towel.",
    points: 300,
    icon: "🧣"
  },
  {
    id: "r3",
    name: "1-on-1 Personal Trainer Session",
    description: "60-minute custom strategy and form correction.",
    points: 800,
    icon: "🏋️"
  },
  {
    id: "r4",
    name: "Elite Performance Gym Bag",
    description: "Water-resistant matte black duffle with shoe compartment.",
    points: 1200,
    icon: "🎒"
  }
];

export const HEALTH_TIPS = [
  "Protein synthesis continues up to 48 hours post weight session. Keep fueling!",
  "Steady state cardio improves heart rate recovery and boosts active stamina.",
  "Drinking water during intensive sets reduces muscle fatigue and prevents cramping.",
  "Sleep is where the actual muscle fiber replication happens. Aim for 8 hours!",
  "Consistency is always superior to intensity. Keep showing up every week!"
];
