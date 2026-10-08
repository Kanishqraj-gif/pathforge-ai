import { useEffect, useMemo, useState } from "react";

const PROGRESS_KEY = "pathforge_progress";

const DEFAULT_PROGRESS = {
  completed: [],
  known: [],
  current: null,
};

function loadProgress(firstNodeId) {
  try {
    const saved = JSON.parse(
      localStorage.getItem(PROGRESS_KEY)
    );

    if (!saved) {
      return {
        ...DEFAULT_PROGRESS,
        current: firstNodeId,
      };
    }

    return {
      completed: saved.completed || [],
      known: saved.known || [],
      current: saved.current || firstNodeId,
    };
  } catch {
    return {
      ...DEFAULT_PROGRESS,
      current: firstNodeId,
    };
  }
}

function getChildren(node) {
  return Array.isArray(node?.children)
    ? node.children
    : [];
}

/*
 * Get every node in the AI-generated hierarchy.
 *
 * Phase
 *   └── Topic
 *        └── Subtopic
 *             └── Micro-topic
 */
function flattenRoadmap(phases) {
  const result = [];

  phases.forEach((phase) => {
    result.push({
      ...phase,
      level: "phase",
    });

    getChildren(phase).forEach((topic) => {
      result.push({
        ...topic,
        level: "topic",
        phaseId: phase.id,
      });

      getChildren(topic).forEach((subtopic) => {
        result.push({
          ...subtopic,
          level: "subtopic",
          topicId: topic.id,
          phaseId: phase.id,
        });

        getChildren(subtopic).forEach((micro) => {
          result.push({
            ...micro,
            level: "micro",
            subtopicId: subtopic.id,
            topicId: topic.id,
            phaseId: phase.id,
          });
        });
      });
    });
  });

  return result;
}

/*
 * Get only the actual learning units.
 *
 * These are the leaf nodes that contribute
 * to course completion.
 */
function getLeafNodes(phases) {
  const leaves = [];

  phases.forEach((phase) => {
    getChildren(phase).forEach((topic) => {
      getChildren(topic).forEach((subtopic) => {
        const microTopics = getChildren(subtopic);

        if (microTopics.length === 0) {
          leaves.push(subtopic);
        } else {
          microTopics.forEach((micro) => {
            leaves.push(micro);
          });
        }
      });
    });
  });

  return leaves;
}

function getTopicProgress(topic, completed, known) {
  const microTopics = [];

  getChildren(topic).forEach((subtopic) => {
    const children = getChildren(subtopic);

    if (children.length === 0) {
      microTopics.push(subtopic);
    } else {
      microTopics.push(...children);
    }
  });

  if (microTopics.length === 0) {
    if (completed.has(topic.id) || known.has(topic.id)) {
      return 100;
    }

    return 0;
  }

  const finished = microTopics.filter(
    (item) =>
      completed.has(item.id) ||
      known.has(item.id)
  ).length;

  return Math.round(
    (finished / microTopics.length) * 100
  );
}

function Journey({
  userProfile,
  roadmap = [],
  onOpenCourse,
}) {
  const phases = Array.isArray(roadmap)
    ? roadmap
    : [];

  /*
   * Flattened roadmap for progress/current
   * calculations.
   */
  const allNodes = useMemo(
    () => flattenRoadmap(phases),
    [phases]
  );

  /*
   * Actual course completion units.
   */
  const leafNodes = useMemo(
    () => getLeafNodes(phases),
    [phases]
  );

  const firstNodeId =
    leafNodes[0]?.id ||
    allNodes.find(
      (node) => node.level === "topic"
    )?.id ||
    null;

  const [progress, setProgress] =
    useState(() =>
      loadProgress(firstNodeId)
    );

  const [isDay, setIsDay] =
    useState(false);

  const [zoom, setZoom] =
    useState(1);

  const [pan, setPan] = useState({
    x: 0,
    y: 0,
  });

  const [dragging, setDragging] =
    useState(false);

  const [dragStart, setDragStart] =
    useState({
      x: 0,
      y: 0,
    });

  const [showIntro, setShowIntro] =
    useState(true);

  /*
   * If a new AI roadmap is generated,
   * start its progress from the beginning.
   */
  useEffect(() => {
    const savedRoadmapId =
      localStorage.getItem(
        "pathforge_roadmap_id"
      );

    const roadmapId =
      userProfile?.roadmap?.targetRole ||
      userProfile?.dreamRole ||
      "generated-roadmap";

    if (savedRoadmapId !== roadmapId) {
      const freshProgress = {
        completed: [],
        known: [],
        current: firstNodeId,
      };

      localStorage.setItem(
        PROGRESS_KEY,
        JSON.stringify(freshProgress)
      );

      localStorage.setItem(
        "pathforge_roadmap_id",
        roadmapId
      );

      setProgress(freshProgress);
    }
  }, [firstNodeId, userProfile]);

  /*
   * Save progress.
   */
  useEffect(() => {
    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify(progress)
    );
  }, [progress]);

  /*
   * Opening animation.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 1600);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  /*
   * Sets for faster lookup.
   */
  const completedSet = useMemo(
    () =>
      new Set(progress.completed || []),
    [progress.completed]
  );

  const knownSet = useMemo(
    () =>
      new Set(progress.known || []),
    [progress.known]
  );

  /*
   * Current learning objective.
   */
  const currentNode =
    leafNodes.find(
      (node) =>
        node.id === progress.current
    ) ||
    allNodes.find(
      (node) =>
        node.id === progress.current
    ) ||
    leafNodes[0] ||
    null;

  /*
   * Overall course completion.
   *
   * Only leaf nodes count.
   *
   * Example:
   * 17 / 50 = 34%
   */
  const completedLeafCount =
    leafNodes.filter(
      (node) =>
        completedSet.has(node.id) ||
        knownSet.has(node.id)
    ).length;

  const progressPercent =
    leafNodes.length === 0
      ? 0
      : Math.round(
          (completedLeafCount /
            leafNodes.length) *
            100
        );

  /*
   * Get node status.
   */
 const getNodeStatus = (node) => {
  if (completedSet.has(node.id)) {
    return "completed";
  }

  if (knownSet.has(node.id)) {
    return "known";
  }

  if (progress.current === node.id) {
    return "current";
  }

  const currentIndex = allNodes.findIndex(
    (item) => item.id === progress.current
  );

  const nodeIndex = allNodes.findIndex(
    (item) => item.id === node.id
  );

  // If the saved current node is not part of
  // the current roadmap, unlock the first node.
  if (currentIndex === -1) {
    return nodeIndex === 0 ? "available" : "locked";
  }

  // Allow the next two learning units.
  if (nodeIndex <= currentIndex + 2) {
    return "available";
  }

  return "locked";
};

  /*
   * Open a topic/course.
   */
  const handleNodeClick = (node) => {
    const status =
      getNodeStatus(node);

    if (
      status === "locked" ||
      status === "completed" ||
      status === "known"
    ) {
      return;
    }

    onOpenCourse({
      ...node,
      status,
      roadmap: phases,
    });
  };

  /*
   * Reset journey.
   */
  const resetJourney = () => {
    const freshProgress = {
      completed: [],
      known: [],
      current: firstNodeId,
    };

    setProgress(freshProgress);

    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify(freshProgress)
    );
  };

  /*
   * Start dragging roadmap.
   */
  const handlePointerDown = (event) => {
    /*
     * Don't start dragging when clicking a
     * roadmap node.
     */
    if (
      event.target.closest("button")
    ) {
      return;
    }

    setDragging(true);

    setDragStart({
      x:
        event.clientX - pan.x,
      y:
        event.clientY - pan.y,
    });
  };

  /*
   * Move roadmap.
   */
  const handlePointerMove = (event) => {
    if (!dragging) {
      return;
    }

    setPan({
      x:
        event.clientX -
        dragStart.x,
      y:
        event.clientY -
        dragStart.y,
    });
  };

  /*
   * Stop dragging.
   */
  const handlePointerUp = () => {
    setDragging(false);
  };

  /*
   * Theme.
   */
  const colors = {
    background: isDay
      ? "#f5f7fb"
      : "#02040a",

    card: isDay
      ? "rgba(255,255,255,0.94)"
      : "rgba(5,8,18,0.88)",

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

  /*
   * Star field.
   */
  const stars = useMemo(() => {
    return Array.from(
      { length: 130 },
      (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: `${Math.random() * 2 + 1}px`,
        opacity:
          Math.random() * 0.7 + 0.2,
      })
    );
  }, []);

  /*
   * Dynamic roadmap height.
   */
  const roadmapHeight =
    phases.length * 360 + 160;

  /*
   * If Gemini hasn't generated a roadmap.
   */
  if (phases.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#02040a",
          color: "#fff",
          fontFamily:
            "Inter, system-ui, sans-serif",
          padding: "30px",
          textAlign: "center",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "12px",
              letterSpacing: "3px",
              opacity: 0.6,
              marginBottom: "15px",
            }}
          >
            PATHFORGE AI
          </div>

          <h2>
            Your personalized journey
            is being prepared.
          </h2>

          <p
            style={{
              opacity: 0.6,
              maxWidth: "450px",
            }}
          >
            Complete onboarding again to
            generate your AI-powered
            career roadmap.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.background,
        color: colors.text,
        position: "relative",
        fontFamily:
          "Inter, system-ui, sans-serif",
      }}
    >
      {/* STAR FIELD */}

      {!isDay &&
        stars.map((star) => (
          <div
            key={star.id}
            style={{
              position: "fixed",
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              borderRadius: "50%",
              background: "#fff",
              opacity: star.opacity,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        ))}

      {/* INTRO */}

      {showIntro && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#000",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation:
              "pathforgeIntro 1.6s ease forwards",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "180px",
              height: "180px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* CENTRAL VOID */}

            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#fff",
                boxShadow:
                  "0 0 30px 10px rgba(255,255,255,0.7)",
                animation:
                  "corePulse 1.2s ease-out",
              }}
            />

            {/* ENERGY RINGS */}

            <div
              className="energy-ring ring-one"
            />

            <div
              className="energy-ring ring-two"
            />

            <div
              className="energy-ring ring-three"
            />

            {/* TITLE */}

            <div
              style={{
                position: "absolute",
                top: "115%",
                fontSize: "22px",
                letterSpacing: "6px",
                color: "#fff",
                whiteSpace: "nowrap",
                animation:
                  "titleReveal 1.5s ease forwards",
              }}
            >
              PATHFORGE
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}

      <header
        style={{
          position: "relative",
          zIndex: 20,
          padding: "20px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "3px",
              color: colors.muted,
              textTransform: "uppercase",
            }}
          >
            PathForge AI
          </div>

          <h1
            style={{
              margin: "5px 0 0",
              fontSize:
                "clamp(24px, 4vw, 34px)",
            }}
          >
            Your Career Journey
          </h1>

          <div
            style={{
              color: colors.muted,
              fontSize: "13px",
              marginTop: "5px",
            }}
          >
            {userProfile?.dreamRole
              ? `Personalized path to ${userProfile.dreamRole}`
              : "AI-powered personalized roadmap"}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() =>
              setZoom((value) =>
                Math.min(1.8, value + 0.1)
              )
            }
            style={buttonStyle(colors)}
          >
            +
          </button>

          <button
            onClick={() =>
              setZoom((value) =>
                Math.max(0.55, value - 0.1)
              )
            }
            style={buttonStyle(colors)}
          >
            −
          </button>

          <button
            onClick={() => {
              setZoom(1);
              setPan({
                x: 0,
                y: 0,
              });
            }}
            style={buttonStyle(colors)}
          >
            Reset View
          </button>

          <button
            onClick={() =>
              setIsDay((value) => !value)
            }
            style={buttonStyle(colors)}
          >
            {isDay ? "☀ Day" : "☾ Night"}
          </button>
        </div>
      </header>

      {/* MAIN */}

      <main
        style={{
          position: "relative",
          zIndex: 5,
          minHeight:
            "calc(100vh - 110px)",
        }}
      >
        {/* CURRENT OBJECTIVE */}

        <div
          style={{
            position: "fixed",
            left: "24px",
            top: "140px",
            zIndex: 30,
            width: "285px",
            maxWidth:
              "calc(100vw - 48px)",
            background: colors.card,
            border:
              `1px solid ${colors.border}`,
            borderRadius: "18px",
            padding: "18px",
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            style={{
              color: colors.muted,
              fontSize: "10px",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Current Objective
          </div>

          <div
            style={{
              marginTop: "8px",
              fontWeight: 700,
              fontSize: "18px",
            }}
          >
            {currentNode?.title ||
              "Journey Complete"}
          </div>

          <div
            style={{
              color: colors.muted,
              marginTop: "6px",
              fontSize: "12px",
            }}
          >
            {completedLeafCount} /{" "}
            {leafNodes.length} learning
            units completed
          </div>

          <div
            style={{
              marginTop: "12px",
              height: "5px",
              background: isDay
                ? "#e2e8f0"
                : "#1e293b",
              borderRadius: "99px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width:
                  `${progressPercent}%`,
                height: "100%",
                background: colors.text,
                transition:
                  "width 0.4s ease",
              }}
            />
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "11px",
              color: colors.muted,
            }}
          >
            {progressPercent}% complete
          </div>
        </div>

        {/* WEEKLY TASK */}

        <div
          style={{
            position: "fixed",
            right: "24px",
            top: "140px",
            zIndex: 30,
            width: "270px",
            maxWidth:
              "calc(100vw - 48px)",
            background: colors.card,
            border:
              `1px solid ${colors.border}`,
            borderRadius: "18px",
            padding: "18px",
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            style={{
              color: colors.muted,
              fontSize: "10px",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Weekly Task
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "14px",
              lineHeight: 1.5,
            }}
          >
            Complete one practical task
            related to{" "}
            <strong>
              {currentNode?.title ||
                "your current skill"}
            </strong>
            .
          </div>
        </div>

        {/* ROADMAP */}

        <div
          style={{
            width: "100%",
            height:
              "calc(100vh - 110px)",
            overflowY: "auto",
            overflowX: "hidden",
            position: "relative",
            scrollbarWidth: "thin",
          }}
        >
          <div
            style={{
              width: "100%",
              minWidth: "1000px",
              height: roadmapHeight,
              position: "relative",
            }}
          >
            <div
              onPointerDown={
                handlePointerDown
              }
              onPointerMove={
                handlePointerMove
              }
              onPointerUp={
                handlePointerUp
              }
              onPointerLeave={
                handlePointerUp
              }
              style={{
                width: "1000px",
                height: roadmapHeight,
                position: "absolute",
                left: "50%",
                top: 0,
                transform: `
                  translateX(
                    calc(-50% + ${pan.x}px)
                  )
                  translateY(${pan.y}px)
                  scale(${zoom})
                `,
                transformOrigin:
                  "top center",
                cursor: dragging
                  ? "grabbing"
                  : "grab",
                transition: dragging
                  ? "none"
                  : "transform 0.25s ease",
                touchAction: "none",
              }}
            >
              {phases.map(
                (phase, phaseIndex) => {
                  const phaseY =
                    40 +
                    phaseIndex * 360;

                  return (
                    <div
                      key={
                        phase.id ||
                        `phase-${phaseIndex}`
                      }
                      style={{
                        position:
                          "absolute",
                        left: "50%",
                        top: phaseY,
                        transform:
                          "translateX(-50%)",
                        width: "900px",
                      }}
                    >
                      {/* PHASE HEADER */}

                      <div
                        style={{
                          textAlign: "center",
                          marginBottom:
                            "28px",
                        }}
                      >
                        <div
                          style={{
                            display:
                              "inline-flex",
                            alignItems:
                              "center",
                            padding:
                              "7px 13px",
                            borderRadius:
                              "999px",
                            border:
                              `1px solid ${colors.border}`,
                            background:
                              colors.card,
                            fontSize: "10px",
                            letterSpacing:
                              "2px",
                            textTransform:
                              "uppercase",
                            color:
                              colors.muted,
                          }}
                        >
                          Phase{" "}
                          {phaseIndex + 1}
                        </div>

                        <h2
                          style={{
                            margin:
                              "12px 0 7px",
                            fontSize: "24px",
                            lineHeight: 1.2,
                          }}
                        >
                          {phase.title}
                        </h2>

                        <p
                          style={{
                            color:
                              colors.muted,
                            margin: "0 auto",
                            fontSize: "13px",
                            maxWidth: "600px",
                            lineHeight: 1.5,
                          }}
                        >
                          {
                            phase.description
                          }
                        </p>
                      </div>

                      {/* CONNECTOR */}

                      {phaseIndex <
                        phases.length - 1 && (
                        <div
                          style={{
                            position:
                              "absolute",
                            left: "50%",
                            top: "238px",
                            transform:
                              "translateX(-50%)",
                            width: "1px",
                            height: "80px",
                            background:
                              colors.border,
                          }}
                        />
                      )}

                      {/* TOPIC NODES */}

                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "center",
                          alignItems:
                            "stretch",
                          gap: "24px",
                          flexWrap:
                            "wrap",
                        }}
                      >
                        {getChildren(
                          phase
                        ).map((topic) => {
                          const topicProgress =
                            getTopicProgress(
                              topic,
                              completedSet,
                              knownSet
                            );

                          return (
                            <Node
                              key={topic.id}
                              node={topic}
                              status={
                                getNodeStatus(
                                  topic
                                )
                              }
                              progress={
                                topicProgress
                              }
                              colors={colors}
                              isDay={isDay}
                              onClick={() =>
                                handleNodeClick(
                                  topic
                                )
                              }
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* RESET */}

        <button
          onClick={resetJourney}
          style={{
            position: "fixed",
            right: "24px",
            bottom: "24px",
            zIndex: 30,
            ...buttonStyle(colors),
          }}
        >
          Reset Journey
        </button>
      </main>

      <style>
        {`
          @keyframes pathforgeIntro {
            0% {
              opacity: 1;
            }

            70% {
              opacity: 1;
            }

            100% {
              opacity: 0;
              visibility: hidden;
            }
          }

          @keyframes corePulse {
            0% {
              transform: scale(0.2);
              opacity: 0;
            }

            35% {
              transform: scale(1);
              opacity: 1;
            }

            100% {
              transform: scale(1.8);
              opacity: 0;
            }
          }

          @keyframes titleReveal {
            0% {
              opacity: 0;
              transform: translateY(15px);
            }

            55% {
              opacity: 0;
              transform: translateY(15px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .energy-ring {
            position: absolute;
            left: 50%;
            top: 50%;
            border: 1px solid rgba(255,255,255,0.7);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
          }

          .ring-one {
            width: 40px;
            height: 40px;
            animation: expandRing 1.4s ease-out 0.15s forwards;
          }

          .ring-two {
            width: 80px;
            height: 80px;
            animation: expandRing 1.4s ease-out 0.3s forwards;
          }

          .ring-three {
            width: 140px;
            height: 140px;
            animation: expandRing 1.4s ease-out 0.45s forwards;
          }

          @keyframes expandRing {
            0% {
              transform:
                translate(-50%, -50%)
                scale(0.1);
              opacity: 0.9;
            }

            100% {
              transform:
                translate(-50%, -50%)
                scale(2.2);
              opacity: 0;
            }
          }

          button {
            font-family: inherit;
          }

          button:hover:not(:disabled) {
            transform: translateY(-2px);
          }

          ::-webkit-scrollbar {
            width: 7px;
          }

          ::-webkit-scrollbar-track {
            background: transparent;
          }

          ::-webkit-scrollbar-thumb {
            background:
              rgba(148, 163, 184, 0.25);
            border-radius: 20px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background:
              rgba(148, 163, 184, 0.45);
          }
        `}
      </style>
    </div>
  );
}

/*
 * NODE COMPONENT
 */
function Node({
  node,
  status,
  progress,
  colors,
  isDay,
  onClick,
}) {
  const isLocked =
    status === "locked";

  const isCurrent =
    status === "current";

  const isCompleted =
    status === "completed";

  const isKnown =
    status === "known";

  return (
    <button
      onClick={onClick}
      disabled={
        isLocked ||
        isCompleted ||
        isKnown
      }
      style={{
        width: "210px",
        minHeight: "145px",
        padding: "18px",
        borderRadius: "18px",

        border:
          `1px solid ${
            isCurrent
              ? colors.text
              : colors.border
          }`,

        background:
          isCurrent
            ? colors.text
            : colors.card,

        color:
          isCurrent
            ? colors.background
            : colors.text,

        opacity:
          isLocked ? 0.42 : 1,

        cursor:
          isLocked ||
          isCompleted ||
          isKnown
            ? "default"
            : "pointer",

        textAlign: "left",

        transition:
          "transform 0.2s ease, opacity 0.2s ease",

        boxShadow:
          isCurrent
            ? `0 0 35px ${
                isDay
                  ? "rgba(15,23,42,0.12)"
                  : "rgba(255,255,255,0.08)"
              }`
            : "none",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          opacity: 0.65,
          marginBottom: "8px",
        }}
      >
        {isCurrent
          ? "Current"
          : isCompleted
          ? "Completed"
          : isKnown
          ? "Already Known"
          : isLocked
          ? "Locked"
          : "Available"}
      </div>

      <div
        style={{
          fontWeight: 700,
          fontSize: "16px",
          lineHeight: 1.3,
        }}
      >
        {node.title}
      </div>

      {node.description && (
        <div
          style={{
            fontSize: "11px",
            opacity: 0.65,
            marginTop: "7px",
            lineHeight: 1.4,
          }}
        >
          {node.description}
        </div>
      )}

      {/* TOPIC PROGRESS */}

      <div
        style={{
          marginTop: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            fontSize: "10px",
            opacity: 0.65,
            marginBottom: "5px",
          }}
        >
          <span>
            Topic progress
          </span>

          <span>
            {progress}%
          </span>
        </div>

        <div
          style={{
            height: "4px",
            borderRadius: "99px",
            overflow: "hidden",
            background:
              isCurrent
                ? "rgba(0,0,0,0.15)"
                : isDay
                ? "#e2e8f0"
                : "#1e293b",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background:
                isCurrent
                  ? colors.background
                  : colors.text,
              transition:
                "width 0.4s ease",
            }}
          />
        </div>
      </div>

      <div
        style={{
          fontSize: "10px",
          opacity: 0.55,
          marginTop: "9px",
          textTransform:
            "capitalize",
        }}
      >
        {node.type || "skill"}
      </div>
    </button>
  );
}

/*
 * BUTTON STYLE
 */
function buttonStyle(colors) {
  return {
    padding: "9px 13px",
    borderRadius: "10px",
    border:
      `1px solid ${colors.border}`,
    background: colors.card,
    color: colors.text,
    cursor: "pointer",
    fontSize: "12px",
    transition:
      "transform 0.2s ease",
  };
}

export default Journey;