import { buildLearningStrategy } from "./decisionEngine.js";

const profiles = [
  {
    name: "School Student",
    profile: {
      currentLevel: "school_student",
      dreamRole: "HR Manager",
      skills: [],
      experienceYears: 0,
      hoursPerWeek: 6,
      careerSwitch: false,
    },
  },

  {
    name: "Arts Graduate",
    profile: {
      currentLevel: "graduate",
      dreamRole: "HR Executive",
      skills: ["communication"],
      experienceYears: 0,
      hoursPerWeek: 10,
      careerSwitch: false,
    },
  },

  {
    name: "Working Professional",
    profile: {
      currentLevel: "working_professional",
      dreamRole: "HR Manager",
      skills: ["communication", "teamwork"],
      experienceYears: 5,
      hoursPerWeek: 6,
      careerSwitch: true,
    },
  },

  {
    name: "Data Science Student",
    profile: {
      currentLevel: "college_student",
      dreamRole: "Data Scientist",
      skills: ["python"],
      experienceYears: 0,
      hoursPerWeek: 15,
      careerSwitch: false,
    },
  },
];

for (const item of profiles) {
  console.log("\n=================================");
  console.log(item.name);
  console.log("=================================");

  const result = buildLearningStrategy(
    item.profile,
    {
      learner_type: "college_beginner",
      starting_level: "beginner",
    }
  );

  console.log(
    JSON.stringify(result, null, 2)
  );
}