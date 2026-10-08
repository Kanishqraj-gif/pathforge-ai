import { CAREER_RULES } from "./rules.js";

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .trim();
}

function containsKeyword(text, keywords) {
  return keywords.some((keyword) =>
    text.includes(keyword)
  );
}

function detectCareerTrack(profile) {
  const dreamRole = normalize(profile.dreamRole);

  for (const [track, rule] of Object.entries(CAREER_RULES)) {
    if (containsKeyword(dreamRole, rule.keywords)) {
      return track;
    }
  }

  return "management";
}

function detectLearnerSituation(profile, mlPrediction) {
  const level = normalize(profile.currentLevel);
  const experience = Number(profile.experienceYears || 0);

  if (
    level === "school_student" ||
    level === "school"
  ) {
    return "school_explorer";
  }

  if (
    level === "working_professional" &&
    profile.careerSwitch === true
  ) {
    return "career_switcher";
  }

  if (
    level === "working_professional" &&
    experience >= 5
  ) {
    return "career_advancer";
  }

  if (
    level === "graduate" ||
    level === "college_student"
  ) {
    return mlPrediction?.learner_type ||
      "college_beginner";
  }

  return (
    mlPrediction?.learner_type ||
    "general_learner"
  );
}

function detectStartingLevel(
  situation,
  profile,
  mlPrediction
) {
  if (situation === "school_explorer") {
    return "foundation";
  }

  if (situation === "career_advancer") {
    return "intermediate";
  }

  if (situation === "career_switcher") {
    return Number(profile.experienceYears || 0) >= 5
      ? "intermediate"
      : "beginner";
  }

  return (
    mlPrediction?.starting_level ||
    "beginner"
  );
}

function findKnownSkills(profile) {
  if (!Array.isArray(profile.skills)) {
    return [];
  }

  return profile.skills
    .map((skill) => normalize(skill))
    .filter(Boolean);
}

function removeKnownAreas(areas, knownSkills) {
  return areas.filter((area) => {
    const normalizedArea = normalize(area);

    return !knownSkills.some(
      (skill) =>
        normalizedArea.includes(skill) ||
        skill.includes(normalizedArea)
    );
  });
}

export function buildLearningStrategy(
  profile,
  mlPrediction = {}
) {
  const careerTrack = detectCareerTrack(profile);

  const situation = detectLearnerSituation(
    profile,
    mlPrediction
  );

  const startingLevel = detectStartingLevel(
    situation,
    profile,
    mlPrediction
  );

  const rule =
    CAREER_RULES[careerTrack] ||
    CAREER_RULES.management;

  const knownSkills =
    findKnownSkills(profile);

  let foundations = [
    ...rule.foundations,
  ];

  let advanced = [
    ...rule.advanced,
  ];

  /* --------------------------------
     REMOVE ALREADY KNOWN SKILLS
  -------------------------------- */

  foundations = removeKnownAreas(
    foundations,
    knownSkills
  );

  advanced = removeKnownAreas(
    advanced,
    knownSkills
  );

  /* --------------------------------
     SITUATIONAL ADAPTATION
  -------------------------------- */

  const strategy = {
    learnerType: situation,

    careerTrack,

    startingLevel,

    learningMode: "standard",

    pace: "balanced",

    skipTopics: [],

    requiredFoundations: foundations,

    priorityAreas: advanced,

    knownSkills,

    reasoning: [],
  };

  /* --------------------------------
     SCHOOL STUDENT
  -------------------------------- */

  if (situation === "school_explorer") {
    strategy.learningMode =
      "exploration_and_foundation";

    strategy.pace =
      "long_term";

    strategy.reasoning.push(
      "Learner is still in school, so the roadmap prioritizes fundamentals and career exploration."
    );

    strategy.priorityAreas = [
      ...foundations,
      ...advanced,
      "Career Exploration",
      "Communication",
    ];
  }

  /* --------------------------------
     CAREER SWITCHER
  -------------------------------- */

  if (situation === "career_switcher") {
    strategy.learningMode =
      "career_transition";

    strategy.pace =
      "accelerated";

    strategy.reasoning.push(
      "Learner has professional experience and is transitioning into a new career."
    );

    strategy.reasoning.push(
      "Transferable skills should be recognized instead of repeating generic workplace fundamentals."
    );

    strategy.priorityAreas = [
      ...advanced,
      "Transferable Skills",
      "Portfolio / Projects",
      "Interview Preparation",
    ];
  }

  /* --------------------------------
     CAREER ADVANCER
  -------------------------------- */

  if (situation === "career_advancer") {
    strategy.learningMode =
      "career_advancement";

    strategy.pace =
      "part_time";

    strategy.reasoning.push(
      "Learner already has substantial professional experience."
    );

    strategy.skipTopics = [
      ...foundations,
    ];

    strategy.priorityAreas = [
      ...advanced,
      "Leadership",
      "Strategic Thinking",
      "Management",
    ];
  }

  /* --------------------------------
     GENERAL BEGINNER
  -------------------------------- */

  if (
    situation === "general_learner" ||
    situation === "college_beginner"
  ) {
    strategy.learningMode =
      "structured_learning";

    strategy.pace =
      "balanced";
  }

  /* --------------------------------
     TIME ADAPTATION
  -------------------------------- */

  const hours =
    Number(profile.hoursPerWeek || 0);

  if (hours > 0 && hours <= 5) {
    strategy.pace =
      "slow_and_consistent";

    strategy.reasoning.push(
      "Limited weekly study time detected."
    );
  }

  if (hours >= 15) {
    strategy.pace =
      "accelerated";

    strategy.reasoning.push(
      "High weekly study availability detected."
    );
  }

  return strategy;
}