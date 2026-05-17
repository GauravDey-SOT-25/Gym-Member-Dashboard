/* [ROLE #8 - Real-Time Data Simulation]
   The ONLY place setInterval should live. Other modules read via the hook. */
import { useEffect, useState } from "react";

export type LiveTick = {
  points: number;
  sessions: number;
  heartRate: number;
  caloriesBurned: number;
  tick: number;
};

const INITIAL: LiveTick = {
  points: 2450,
  sessions: 128,
  heartRate: 72,
  caloriesBurned: 4210,
  tick: 0,
};

export function useRealtime(intervalMs = 3000): LiveTick {
  const [data, setData] = useState<LiveTick>(INITIAL);

  useEffect(() => {
    const id = setInterval(() => {
      setData((d) => ({
        points: d.points + Math.floor(Math.random() * 5),
        sessions: d.sessions + (Math.random() > 0.9 ? 1 : 0),
        heartRate: 65 + Math.floor(Math.random() * 25),
        caloriesBurned: d.caloriesBurned + Math.floor(Math.random() * 4),
        tick: d.tick + 1,
      }));
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return data;
}
