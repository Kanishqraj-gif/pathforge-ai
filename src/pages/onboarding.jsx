import { useState } from "react";
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Onboarding({ onComplete }) {
  const [form, setForm] = useState({
    education: "",
    field: "",
    currentLevel: "",
    experienceYears: "",
    careerSwitch: false,
    dreamRole: "",
    industry: "",
    skills: "",
    targetCompany: "",
    timeline: "12",
    hoursPerWeek: "10",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateRoadmap = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const profile = {
        education: form.education.trim(),
        field: form.field.trim(),
        currentLevel: form.currentLevel.trim(),
        experienceYears: Number(form.experienceYears || 0),
        careerSwitch: Boolean(form.careerSwitch),

        dreamRole: form.dreamRole.trim(),
        industry: form.industry.trim(),

        skills: form.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),

        targetCompany: form.targetCompany.trim(),

        timelineMonths: Number(form.timeline || 0),
        hoursPerWeek: Number(form.hoursPerWeek || 0),
      };

      if (!profile.dreamRole) {
        throw new Error(
          "Please enter your dream role."
        );
      }

      if (!profile.currentLevel) {
        throw new Error(
          "Please select your current level."
        );
      }

      console.log(
        "Sending learner profile:",
        profile
      );

      const response = await fetch(`${API_BASE_URL}/api/generate-roadmap`, 
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(profile),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to generate your roadmap."
        );
      }

      console.log(
        "Personalized roadmap received:",
        result
      );

      const completeProfile = {
        ...profile,

        mlPrediction:
          result.data?.mlPrediction || null,

        learningStrategy:
          result.data?.learningStrategy || null,

        roadmap:
          result.data?.roadmap || null,
      };

      /*
       * Store the generated roadmap so it survives
       * page navigation / refresh.
       */
      localStorage.setItem(
        "pathforge_user_profile",
        JSON.stringify(completeProfile)
      );

      localStorage.setItem(
        "pathforge_roadmap",
        JSON.stringify(
          result.data?.roadmap || null
        )
      );

      localStorage.setItem(
        "pathforge_ml_prediction",
        JSON.stringify(
          result.data?.mlPrediction || null
        )
      );

      localStorage.setItem(
        "pathforge_learning_strategy",
        JSON.stringify(
          result.data?.learningStrategy || null
        )
      );

      /*
       * Send the complete personalized data
       * back to App.jsx.
       */
      if (onComplete) {
        onComplete(completeProfile);
      }
    } catch (err) {
      console.error(
        "ROADMAP GENERATION ERROR:",
        err
      );

      setError(
        err?.message ||
          "Something went wrong while creating your roadmap."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">

        <div className="onboarding-header">
          <span className="onboarding-kicker">
            PATHFORGE AI
          </span>

          <h1>
            Build your personalized career path.
          </h1>

          <p>
            Tell us where you are now and where you
            want to go. PathForge will build a learning
            journey around you.
          </p>
        </div>

        <form
          className="onboarding-form"
          onSubmit={generateRoadmap}
        >

          {/* EDUCATION */}

          <div className="form-group">
            <label htmlFor="education">
              Education
            </label>

            <select
              id="education"
              value={form.education}
              onChange={(e) =>
                updateField(
                  "education",
                  e.target.value
                )
              }
              required
            >
              <option value="">
                Select your education
              </option>

              <option value="School Student">
                School Student
              </option>

              <option value="Diploma">
                Diploma
              </option>

              <option value="Undergraduate">
                Undergraduate
              </option>

              <option value="Graduate">
                Graduate
              </option>

              <option value="Postgraduate">
                Postgraduate
              </option>

              <option value="Working Professional">
                Working Professional
              </option>
            </select>
          </div>

          {/* FIELD */}

          <div className="form-group">
            <label htmlFor="field">
              Your field / background
            </label>

            <input
              id="field"
              type="text"
              value={form.field}
              onChange={(e) =>
                updateField(
                  "field",
                  e.target.value
                )
              }
              placeholder="e.g. Computer Science, Arts, Commerce"
            />
          </div>

          {/* CURRENT LEVEL */}

          <div className="form-group">
            <label htmlFor="currentLevel">
              Current level
            </label>

            <select
              id="currentLevel"
              value={form.currentLevel}
              onChange={(e) =>
                updateField(
                  "currentLevel",
                  e.target.value
                )
              }
              required
            >
              <option value="">
                Select your current level
              </option>

              <option value="Beginner">
                Beginner
              </option>

              <option value="Intermediate">
                Intermediate
              </option>

              <option value="Advanced">
                Advanced
              </option>

              <option value="Working Professional">
                Working Professional
              </option>
            </select>
          </div>

          {/* EXPERIENCE */}

          <div className="form-group">
            <label htmlFor="experienceYears">
              Experience
            </label>

            <input
              id="experienceYears"
              type="number"
              min="0"
              max="50"
              value={form.experienceYears}
              onChange={(e) =>
                updateField(
                  "experienceYears",
                  e.target.value
                )
              }
              placeholder="Years of experience"
            />
          </div>

          {/* CAREER SWITCH */}

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.careerSwitch}
              onChange={(e) =>
                updateField(
                  "careerSwitch",
                  e.target.checked
                )
              }
            />

            <span>
              I am switching careers
            </span>
          </label>

          {/* DREAM ROLE */}

          <div className="form-group">
            <label htmlFor="dreamRole">
              Dream role
            </label>

            <input
              id="dreamRole"
              type="text"
              value={form.dreamRole}
              onChange={(e) =>
                updateField(
                  "dreamRole",
                  e.target.value
                )
              }
              placeholder="e.g. HR Manager, Data Scientist, Product Manager"
              required
            />
          </div>

          {/* INDUSTRY */}

          <div className="form-group">
            <label htmlFor="industry">
              Target industry
            </label>

            <input
              id="industry"
              type="text"
              value={form.industry}
              onChange={(e) =>
                updateField(
                  "industry",
                  e.target.value
                )
              }
              placeholder="e.g. Technology, HR, Finance"
            />
          </div>

          {/* SKILLS */}

          <div className="form-group">
            <label htmlFor="skills">
              Skills you already know
            </label>

            <input
              id="skills"
              type="text"
              value={form.skills}
              onChange={(e) =>
                updateField(
                  "skills",
                  e.target.value
                )
              }
              placeholder="e.g. communication, Excel, Python"
            />

            <small>
              Separate multiple skills with commas.
            </small>
          </div>

          {/* COMPANY */}

          <div className="form-group">
            <label htmlFor="targetCompany">
              Target company
            </label>

            <input
              id="targetCompany"
              type="text"
              value={form.targetCompany}
              onChange={(e) =>
                updateField(
                  "targetCompany",
                  e.target.value
                )
              }
              placeholder="Optional"
            />
          </div>

          {/* TIMELINE */}

          <div className="form-group">
            <label htmlFor="timeline">
              Target timeline
            </label>

            <select
              id="timeline"
              value={form.timeline}
              onChange={(e) =>
                updateField(
                  "timeline",
                  e.target.value
                )
              }
            >
              <option value="3">
                3 months
              </option>

              <option value="6">
                6 months
              </option>

              <option value="9">
                9 months
              </option>

              <option value="12">
                12 months
              </option>

              <option value="18">
                18 months
              </option>

              <option value="24">
                24 months
              </option>
            </select>
          </div>

          {/* HOURS */}

          <div className="form-group">
            <label htmlFor="hoursPerWeek">
              Hours available per week
            </label>

            <select
              id="hoursPerWeek"
              value={form.hoursPerWeek}
              onChange={(e) =>
                updateField(
                  "hoursPerWeek",
                  e.target.value
                )
              }
            >
              <option value="5">
                5 hours
              </option>

              <option value="10">
                10 hours
              </option>

              <option value="15">
                15 hours
              </option>

              <option value="20">
                20 hours
              </option>

              <option value="30">
                30+ hours
              </option>
            </select>
          </div>

          {/* ERROR */}

          {error && (
            <div className="onboarding-error">
              <strong>
                Roadmap generation failed
              </strong>

              <span>{error}</span>
            </div>
          )}

          {/* SUBMIT */}

          <button
            type="submit"
            className="onboarding-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-dot" />
                Building your PathForge...
              </>
            ) : (
              <>
                Generate My Career Path →
              </>
            )}
          </button>

        </form>
      </div>

      <style>{`
        .onboarding-page {
          min-height: 100vh;
          background: #020409;
          color: #f8fafc;
          padding: 70px 20px;
        }

        .onboarding-container {
          width: min(760px, 100%);
          margin: 0 auto;
        }

        .onboarding-header {
          text-align: center;
          margin-bottom: 42px;
        }

        .onboarding-kicker {
          display: inline-block;
          margin-bottom: 16px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .2em;
          color: #94a3b8;
        }

        .onboarding-header h1 {
          margin: 0;
          font-size: clamp(32px, 6vw, 58px);
          line-height: 1;
          letter-spacing: -.04em;
        }

        .onboarding-header p {
          max-width: 600px;
          margin: 20px auto 0;
          color: #94a3b8;
          line-height: 1.7;
        }

        .onboarding-form {
          display: grid;
          gap: 20px;
          padding: 30px;
          border: 1px solid rgba(148,163,184,.18);
          border-radius: 24px;
          background: rgba(5,9,18,.82);
          box-shadow: 0 30px 100px rgba(0,0,0,.35);
        }

        .form-group {
          display: grid;
          gap: 8px;
        }

        .form-group label {
          font-size: 13px;
          font-weight: 700;
          color: #e2e8f0;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 14px 15px;
          border: 1px solid rgba(148,163,184,.22);
          border-radius: 12px;
          outline: none;
          background: #080d17;
          color: #f8fafc;
          font: inherit;
          transition: border-color .2s ease, box-shadow .2s ease;
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: rgba(226,232,240,.65);
          box-shadow: 0 0 0 3px rgba(226,232,240,.08);
        }

        .form-group small {
          color: #64748b;
        }

        .checkbox-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 0;
          color: #cbd5e1;
          cursor: pointer;
        }

        .checkbox-row input {
          width: 17px;
          height: 17px;
          accent-color: #f8fafc;
        }

        .onboarding-error {
          display: grid;
          gap: 5px;
          padding: 14px 16px;
          border: 1px solid rgba(248,113,113,.3);
          border-radius: 12px;
          background: rgba(127,29,29,.15);
          color: #fecaca;
        }

        .onboarding-error span {
          color: #fca5a5;
          font-size: 14px;
        }

        .onboarding-submit {
          min-height: 54px;
          margin-top: 8px;
          border: 0;
          border-radius: 14px;
          background: #f8fafc;
          color: #020409;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          transition: transform .2s ease, box-shadow .2s ease;
        }

        .onboarding-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(255,255,255,.12);
        }

        .onboarding-submit:disabled {
          opacity: .65;
          cursor: wait;
        }

        .loading-dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          margin-right: 9px;
          border: 2px solid #64748b;
          border-top-color: #020409;
          border-radius: 50%;
          animation: pf-spin .7s linear infinite;
        }

        @keyframes pf-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 600px) {
          .onboarding-page {
            padding: 40px 14px;
          }

          .onboarding-form {
            padding: 20px;
            border-radius: 18px;
          }
        }
      `}</style>
    </div>
  );
}