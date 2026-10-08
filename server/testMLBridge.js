import { predictLearner } from "./mlBridge.js";

const profile = {
  education: "BA",
  field: "Arts",
  current_level: "working_professional",
  experience_years: 5,
  career_switch: true,
  dream_role: "HR Manager",
  career_track: "hr_management",
  hours_per_week: 6,
  timeline_months: 18
};

try {
  const result = await predictLearner(profile);

  console.log(
    "\nPathForge ML Result:\n"
  );

  console.log(result);

} catch (error) {

  console.error(
    "\nML ERROR:\n",
    error.message
  );
}