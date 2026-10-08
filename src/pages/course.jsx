import { useState } from "react";

function Course({
  stage,
  userProfile,
  onBack,
  onComplete,
}) {
  const [isDay, setIsDay] =
    useState(false);

  const [completed, setCompleted] =
    useState(false);

  const [known, setKnown] =
    useState(false);

  const currentStage =
    stage || {
      id: "unknown",
      title: "Learning Skill",
      description:
        "Build this skill to move forward in your career journey.",
      skills: [],
      actions: [],
      type: "skill",
    };

  const targetRole =
    userProfile?.dreamRole ||
    "your target role";

  const targetCompany =
    userProfile?.targetCompany ||
    "your target company";

  const industry =
    userProfile?.industry ||
    "your target industry";

  const timeline =
    userProfile?.timelineMonths ||
    6;

  const interviewQuestions = [
    `Explain the most important concepts of ${currentStage.title}.`,
    `How would you use ${currentStage.title} in a real-world project?`,
    `What are common mistakes beginners make when learning ${currentStage.title}?`,
  ];

  const weekendProject = {
    title: `${currentStage.title} Weekend Project`,
    steps: [
      `Understand the core concepts of ${currentStage.title}.`,
      `Build a small practical implementation.`,
      `Document your work on GitHub.`,
      `Prepare a short explanation for interviews.`,
    ],
  };

  const handleCompleted = () => {
    setCompleted(true);
    setKnown(false);
  };

  const handleKnown = () => {
    setKnown(true);
    setCompleted(false);
  };

  const handleContinue = () => {
    const result =
      known
        ? "known"
        : "completed";

    onComplete({
      ...currentStage,
      result,
    });
  };

  const colors = {
    background: isDay
      ? "#f5f7fb"
      : "#02040a",

    card: isDay
      ? "#ffffff"
      : "#080b14",

    text: isDay
      ? "#111827"
      : "#f8fafc",

    muted: isDay
      ? "#64748b"
      : "#94a3b8",

    border: isDay
      ? "rgba(15,23,42,0.12)"
      : "rgba(148,163,184,0.16)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          colors.background,
        color: colors.text,
        padding: "24px",
        fontFamily:
          "Inter, system-ui, sans-serif",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={onBack}
          style={buttonStyle(
            colors
          )}
        >
          ← Back to Journey
        </button>

        <button
          onClick={() =>
            setIsDay(
              (value) => !value
            )
          }
          style={buttonStyle(
            colors
          )}
        >
          {isDay
            ? "☀ Day"
            : "☾ Night"}
        </button>
      </div>

      {/* CONTENT */}

      <main
        style={{
          maxWidth: "1000px",
          margin: "40px auto",
        }}
      >
        {/* TITLE */}

        <div
          style={{
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              color:
                colors.muted,
              fontSize: "11px",
              letterSpacing:
                "2px",
              textTransform:
                "uppercase",
            }}
          >
            Skill Module
          </div>

          <h1
            style={{
              fontSize:
                "clamp(32px, 6vw, 52px)",
              margin:
                "10px 0",
            }}
          >
            {currentStage.title}
          </h1>

          <p
            style={{
              color:
                colors.muted,
              maxWidth: "700px",
              lineHeight: 1.7,
              fontSize: "16px",
            }}
          >
            {currentStage.description}
          </p>
        </div>

        {/* PERSONALIZATION */}

        <div
          style={{
            ...cardStyle(colors),
            marginBottom:
              "20px",
          }}
        >
          <div
            style={{
              color:
                colors.muted,
              fontSize: "10px",
              letterSpacing:
                "2px",
              textTransform:
                "uppercase",
            }}
          >
            Personalized For You
          </div>

          <p
            style={{
              lineHeight: 1.6,
              marginBottom: 0,
            }}
          >
            Your target is{" "}
            <strong>
              {targetRole}
            </strong>
            {targetCompany !==
              "your target company" &&
              ` at ${targetCompany}`}
            {industry !==
              "your target industry" &&
              ` in ${industry}`}
            . Your planned timeline is{" "}
            <strong>
              {timeline} months
            </strong>
            .
          </p>
        </div>

        {/* WHAT TO LEARN */}

        <section
          style={{
            ...cardStyle(colors),
            marginBottom:
              "20px",
          }}
        >
          <h2>
            What You Need To Learn
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px",
              marginTop:
                "18px",
            }}
          >
            {(
              currentStage.skills ||
              []
            ).map(
              (skill, index) => (
                <div
                  key={index}
                  style={{
                    border: `1px solid ${colors.border}`,
                    borderRadius:
                      "12px",
                    padding:
                      "14px",
                  }}
                >
                  <div
                    style={{
                      color:
                        colors.muted,
                      fontSize:
                        "11px",
                      marginBottom:
                        "6px",
                    }}
                  >
                    SKILL {index + 1}
                  </div>

                  {skill}
                </div>
              )
            )}
          </div>
        </section>

        {/* ACTION PLAN */}

        <section
          style={{
            ...cardStyle(colors),
            marginBottom:
              "20px",
          }}
        >
          <h2>
            Action Plan
          </h2>

          <div
            style={{
              marginTop:
                "18px",
            }}
          >
            {(
              currentStage.actions ||
              []
            ).map(
              (action, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    gap: "15px",
                    marginBottom:
                      "15px",
                    alignItems:
                      "flex-start",
                  }}
                >
                  <div
                    style={{
                      width:
                        "28px",
                      height:
                        "28px",
                      borderRadius:
                        "50%",
                      border: `1px solid ${colors.border}`,
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </div>

                  <div
                    style={{
                      paddingTop:
                        "5px",
                    }}
                  >
                    {action}
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        {/* WEEKEND PROJECT */}

        <section
          style={{
            ...cardStyle(colors),
            marginBottom:
              "20px",
          }}
        >
          <div
            style={{
              color:
                colors.muted,
              fontSize: "10px",
              letterSpacing:
                "2px",
              textTransform:
                "uppercase",
            }}
          >
            Practical Project
          </div>

          <h2
            style={{
              marginTop:
                "8px",
            }}
          >
            {weekendProject.title}
          </h2>

          <div
            style={{
              marginTop:
                "18px",
            }}
          >
            {weekendProject.steps.map(
              (step, index) => (
                <div
                  key={index}
                  style={{
                    padding:
                      "12px 0",
                    borderBottom:
                      `1px solid ${colors.border}`,
                  }}
                >
                  <strong>
                    {index + 1}.
                  </strong>{" "}
                  {step}
                </div>
              )
            )}
          </div>
        </section>

        {/* INTERVIEW QUESTIONS */}

        <section
          style={{
            ...cardStyle(colors),
            marginBottom:
              "30px",
          }}
        >
          <h2>
            Interview Questions
          </h2>

          <div
            style={{
              marginTop:
                "18px",
            }}
          >
            {interviewQuestions.map(
              (
                question,
                index
              ) => (
                <div
                  key={index}
                  style={{
                    padding:
                      "14px",
                    border: `1px solid ${colors.border}`,
                    borderRadius:
                      "12px",
                    marginBottom:
                      "10px",
                  }}
                >
                  {question}
                </div>
              )
            )}
          </div>
        </section>

        {/* COMPLETION */}

        <section
          style={{
            ...cardStyle(colors),
            textAlign: "center",
          }}
        >
          <h2>
            Update Your Journey
          </h2>

          <p
            style={{
              color:
                colors.muted,
              marginTop:
                "8px",
            }}
          >
            Tell PathForge what you
            already know or what
            you have completed.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent:
                "center",
              gap: "12px",
              flexWrap:
                "wrap",
              marginTop:
                "22px",
            }}
          >
            <button
              onClick={
                handleKnown
              }
              style={{
                ...actionButton(
                  colors
                ),
                background:
                  known
                    ? colors.text
                    : colors.card,
                color:
                  known
                    ? colors.background
                    : colors.text,
              }}
            >
              ✓ I Already Know This
            </button>

            <button
              onClick={
                handleCompleted
              }
              style={{
                ...actionButton(
                  colors
                ),
                background:
                  completed
                    ? colors.text
                    : colors.card,
                color:
                  completed
                    ? colors.background
                    : colors.text,
              }}
            >
              ✓ I've Completed This
            </button>
          </div>

          {(known ||
            completed) && (
            <button
              onClick={
                handleContinue
              }
              style={{
                marginTop:
                  "18px",
                width: "100%",
                maxWidth:
                  "400px",
                padding:
                  "14px 20px",
                borderRadius:
                  "12px",
                border: "none",
                background:
                  colors.text,
                color:
                  colors.background,
                cursor:
                  "pointer",
                fontWeight:
                  700,
              }}
            >
              Continue Journey →
            </button>
          )}
        </section>
      </main>
    </div>
  );
}

function cardStyle(colors) {
  return {
    background:
      colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: "18px",
    padding: "24px",
  };
}

function buttonStyle(colors) {
  return {
    padding:
      "10px 15px",
    borderRadius:
      "10px",
    border: `1px solid ${colors.border}`,
    background:
      colors.card,
    color:
      colors.text,
    cursor:
      "pointer",
  };
}

function actionButton(colors) {
  return {
    padding:
      "13px 18px",
    borderRadius:
      "12px",
    border: `1px solid ${colors.border}`,
    cursor:
      "pointer",
    fontWeight:
      600,
  };
}

export default Course;