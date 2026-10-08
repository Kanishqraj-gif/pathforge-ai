import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

import { predictLearner } from "./mlBridge.js";
import { buildLearningStrategy } from "./decision/decisionEngine.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`PathForge AI backend running on port ${PORT}`);
});

// --------------------------------------------------
// CONFIGURATION
// --------------------------------------------------

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn(
    "WARNING: GEMINI_API_KEY is not configured in .env"
  );
}

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

// --------------------------------------------------
// MIDDLEWARE
// --------------------------------------------------

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));

// --------------------------------------------------
// HEALTH CHECK
// --------------------------------------------------

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "PathForge AI backend is running.",
  });
});

// --------------------------------------------------
// BASIC ROOT ROUTE
// --------------------------------------------------

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to PathForge AI API.",
    status: "running",
  });
});

// --------------------------------------------------
// GEMINI ROADMAP SCHEMA
// --------------------------------------------------

const roadmapSchema = {
  type: "OBJECT",

  properties: {
    careerSummary: {
      type: "STRING",
    },

    targetRole: {
      type: "STRING",
    },

    entryLevelRoles: {
      type: "ARRAY",
      items: {
        type: "STRING",
      },
    },

    totalEstimatedWeeks: {
      type: "NUMBER",
    },

    phases: {
      type: "ARRAY",

      items: {
        type: "OBJECT",

        properties: {
          id: {
            type: "STRING",
          },

          title: {
            type: "STRING",
          },

          description: {
            type: "STRING",
          },

          estimatedWeeks: {
            type: "NUMBER",
          },

          children: {
            type: "ARRAY",

            items: {
              type: "OBJECT",

              properties: {
                id: {
                  type: "STRING",
                },

                title: {
                  type: "STRING",
                },

                description: {
                  type: "STRING",
                },

                type: {
                  type: "STRING",
                },

                children: {
                  type: "ARRAY",

                  items: {
                    type: "OBJECT",

                    properties: {
                      id: {
                        type: "STRING",
                      },

                      title: {
                        type: "STRING",
                      },

                      description: {
                        type: "STRING",
                      },

                      children: {
                        type: "ARRAY",

                        items: {
                          type: "OBJECT",

                          properties: {
                            id: {
                              type: "STRING",
                            },

                            title: {
                              type: "STRING",
                            },

                            description: {
                              type: "STRING",
                            },

                            type: {
                              type: "STRING",
                            },
                          },

                          required: [
                            "id",
                            "title",
                            "description",
                            "type",
                          ],
                        },
                      },
                    },

                    required: [
                      "id",
                      "title",
                      "description",
                      "children",
                    ],
                  },
                },
              },

              required: [
                "id",
                "title",
                "description",
                "type",
                "children",
              ],
            },
          },
        },

        required: [
          "id",
          "title",
          "description",
          "estimatedWeeks",
          "children",
        ],
      },
    },
  },

  required: [
    "careerSummary",
    "targetRole",
    "entryLevelRoles",
    "totalEstimatedWeeks",
    "phases",
  ],
};

// --------------------------------------------------
// HELPER: NORMALIZE PROFILE
// --------------------------------------------------

function normalizeProfile(profile = {}) {
  return {
    education:
      profile.education ||
      profile.currentLevel ||
      "",

    field:
      profile.field ||
      profile.industry ||
      "",

    currentLevel:
      profile.currentLevel ||
      "",

    experienceYears: Number(
      profile.experienceYears || 0
    ),

    careerSwitch:
      Boolean(profile.careerSwitch),

    dreamRole:
      profile.dreamRole ||
      "",

    careerTrack:
      profile.careerTrack ||
      "",

    hoursPerWeek: Number(
      profile.hoursPerWeek ||
      0
    ),

    timelineMonths: Number(
      profile.timelineMonths ||
      0
    ),

    skills:
      Array.isArray(profile.skills)
        ? profile.skills
        : typeof profile.skills === "string"
        ? profile.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        : [],

    industry:
      profile.industry ||
      "",

    targetCompany:
      profile.targetCompany ||
      "",
  };
}

// --------------------------------------------------
// HELPER: BUILD GEMINI PROMPT
// --------------------------------------------------

function buildRoadmapPrompt(
  profile,
  mlPrediction,
  learningStrategy
) {
  return `
You are the curriculum intelligence engine for PathForge AI.

Your job is to create a highly personalized career-learning roadmap.

Do NOT generate a generic roadmap.

You MUST use the learner profile, machine-learning prediction,
and decision-engine strategy below.

========================
LEARNER PROFILE
========================

${JSON.stringify(profile, null, 2)}

========================
ML LEARNER PREDICTION
========================

${JSON.stringify(mlPrediction, null, 2)}

========================
DECISION ENGINE STRATEGY
========================

${JSON.stringify(learningStrategy, null, 2)}

========================
CORE RULE
========================

The learner's situation matters more than generic career roadmaps.

For example:

1. A school student who wants to become an HR Manager should
   receive foundational and long-term preparation.

2. An Arts graduate who wants HR should receive professional
   HR fundamentals and practical HR skills.

3. A working professional switching to HR Management should
   NOT be forced through unnecessary beginner material.
   Use transferable skills and focus on missing professional
   competencies such as:

   - HR strategy
   - Talent management
   - People analytics
   - Performance management
   - Leadership
   - Workforce planning

4. A Data Science learner should receive relevant areas such as:

   - Python
   - Statistics
   - SQL
   - Pandas
   - Data Visualization
   - Machine Learning

NEVER introduce programming, Python, SQL, machine learning,
or data science unless they are actually relevant to the
learner's target career.

========================
PERSONALIZATION
========================

Respect:

- Existing skills
- Experience
- Career switching status
- Education
- Current level
- Weekly available hours
- Timeline
- Target role
- Target industry
- Decision-engine skip topics
- Required foundations
- Priority areas

If the learner already knows a topic, do not waste major
roadmap space repeating it.

========================
ROADMAP STRUCTURE
========================

Generate:

4 to 5 phases.

Each phase should contain:

2 to 4 major topics.

Each topic should contain:

2 to 4 subtopics.

Each subtopic should contain:

2 to 3 micro-topics.

Keep the curriculum detailed but concise.
Do not generate unnecessary explanations.

Structure:

Phase
  ↓
Topic
  ↓
Subtopic
  ↓
Micro-topic

Every micro-topic is a completable learning unit.

========================
TOPIC TYPES
========================

Topics may use:

skill
project
milestone

Micro-topics may use:

lesson
practice
project
checkpoint

========================
PROJECTS
========================

Include practical projects where appropriate.

Projects must match the learner's target career.

For example:

HR:
- Recruitment workflow project
- Employee engagement analysis
- HR dashboard
- People analytics project

Data Science:
- Data analysis project
- ML prediction project
- End-to-end portfolio project

Software Engineering:
- Full-stack application
- API project
- Deployment project

Do not add irrelevant projects.

========================
CAREER PREPARATION
========================

Include practical career preparation where appropriate:

- Portfolio work
- Interview preparation
- Resume-related skills
- Real-world projects
- Industry practices
- Milestones

========================
QUALITY REQUIREMENTS
========================

The roadmap must be:

- Specific
- Practical
- Sequential
- Personalized
- Realistic
- Career-oriented
- Easy to follow

Do not explain your reasoning outside the requested JSON.

Return ONLY valid JSON matching the provided schema.
`;
}

// --------------------------------------------------
// GENERATE ROADMAP
// --------------------------------------------------

app.post(
  "/api/generate-roadmap",
  async (req, res) => {
    try {
      console.log("\n=================================");
      console.log("PATHFORGE ROADMAP REQUEST");
      console.log("=================================");

      const profile = normalizeProfile(
        req.body
      );

      console.log(
        "Learner profile:",
        profile
      );

      // ------------------------------------------------
      // STEP 1: ML LEARNER PROFILING
      // ------------------------------------------------

      console.log(
        "\nRunning ML learner profiler..."
      );

      const mlPrediction =
        await predictLearner({
          education:
            profile.education,

          field:
            profile.field,

          current_level:
            profile.currentLevel,

          experience_years:
            profile.experienceYears,

          career_switch:
            profile.careerSwitch,

          dream_role:
            profile.dreamRole,

          career_track:
            profile.careerTrack,

          hours_per_week:
            profile.hoursPerWeek,

          timeline_months:
            profile.timelineMonths,
        });

      console.log(
        "ML prediction:",
        mlPrediction
      );

      // ------------------------------------------------
      // STEP 2: DECISION ENGINE
      // ------------------------------------------------

      console.log(
        "\nBuilding learning strategy..."
      );

      const learningStrategy =
        buildLearningStrategy(
          profile,
          mlPrediction
        );

      console.log(
        "Learning strategy:",
        learningStrategy
      );

      // ------------------------------------------------
      // STEP 3: BUILD GEMINI PROMPT
      // ------------------------------------------------

      const prompt =
        buildRoadmapPrompt(
          profile,
          mlPrediction,
          learningStrategy
        );

      console.log(
        "\nGenerating personalized roadmap..."
      );

      // ------------------------------------------------
      // STEP 4: GEMINI MODEL FALLBACK
      // ------------------------------------------------

      let response = null;
      let lastError = null;
      let successfulModel = null;

      const models = [
        "gemini-3.5-flash",
        "gemini-3.6-flash",
        "gemini-3.7-flash",
        "gemini-3.8-flash",
      ];

      for (const model of models) {
        try {
          console.log(
            `Trying Gemini model: ${model}`
          );

          response =
            await ai.models.generateContent({
              model,
              contents: prompt,

              config: {
                responseMimeType:
                  "application/json",

                responseSchema:
                  roadmapSchema,
              },
            });

          successfulModel = model;

          console.log(
            `Gemini succeeded with: ${model}`
          );

          break;
        } catch (error) {
          lastError = error;

          console.error(
            `${model} failed:`,
            error?.message ||
              error
          );
        }
      }

      // ------------------------------------------------
      // ALL MODELS FAILED
      // ------------------------------------------------

      if (!response) {
        throw new Error(
          `All Gemini models failed. Last error: ${
            lastError?.message ||
            "Unknown Gemini error"
          }`
        );
      }

      // ------------------------------------------------
      // STEP 5: READ GEMINI RESPONSE
      // ------------------------------------------------

      const rawText =
        response.text;

      if (!rawText) {
        throw new Error(
          "Gemini returned an empty response."
        );
      }

      console.log(
        `Gemini response received using ${successfulModel}`
      );

      // ------------------------------------------------
      // STEP 6: PARSE JSON
      // ------------------------------------------------

      let roadmap;

      try {
        roadmap =
          JSON.parse(rawText);
      } catch (parseError) {
        console.error(
          "Gemini returned invalid JSON:",
          rawText
        );

        throw new Error(
          "Gemini returned invalid JSON."
        );
      }

      // ------------------------------------------------
      // STEP 7: FINAL RESPONSE
      // ------------------------------------------------

      return res.json({
        success: true,

        data: {
          profile,

          mlPrediction,

          learningStrategy,

          roadmap,
        },
      });
    } catch (error) {
      console.error(
        "\nROADMAP GENERATION ERROR:"
      );

      console.error(error);

      return res.status(500).json({
        success: false,

        message:
          error?.message ||
          "Failed to generate personalized roadmap.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? {
                name:
                  error?.name,
                stack:
                  error?.stack,
              }
            : undefined,
      });
    }
  }
);

// --------------------------------------------------
// 404 HANDLER
// --------------------------------------------------

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,
      message:
        "API route not found.",
    });
  }
);

// --------------------------------------------------
// GLOBAL ERROR HANDLER
// --------------------------------------------------

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    console.error(
      "Unhandled server error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Internal server error.",
    });
  }
);

// --------------------------------------------------
// START SERVER
// --------------------------------------------------

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `PathForge AI backend running on port ${PORT}`
    );
  }
);