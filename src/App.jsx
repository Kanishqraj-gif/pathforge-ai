import { useState } from "react";

import Landing from "./pages/landing";
import Onboarding from "./pages/onboarding";
import Journey from "./pages/journey";
import Course from "./pages/course";

const PROGRESS_KEY = "pathforge_progress";
const PROFILE_KEY = "pathforge_user_profile";

function App() {
  const [page, setPage] = useState("landing");

  const [userProfile, setUserProfile] =
    useState(() => {
      try {
        const saved =
          localStorage.getItem(PROFILE_KEY);

        return saved
          ? JSON.parse(saved)
          : null;
      } catch {
        return null;
      }
    });

  const [selectedStage, setSelectedStage] =
    useState(null);

  /*
   * Get the AI-generated roadmap.
   *
   * Gemini returns:
   *
   * roadmap
   *   └── phases
   *        └── topics
   *             └── subtopics
   *                  └── micro-topics
   */
  const getGeneratedRoadmap = () => {
    return (
      userProfile?.roadmap?.phases ||
      []
    );
  };

  /*
   * Update learning progress.
   *
   * This works with the AI-generated roadmap
   * instead of the old hardcoded ROADMAPS.
   */
  const updateProgress = (result) => {
    if (!result?.id) {
      setPage("journey");
      return;
    }

    let saved;

    try {
      saved = JSON.parse(
        localStorage.getItem(PROGRESS_KEY)
      );
    } catch {
      saved = null;
    }

    if (!saved) {
      saved = {
        completed: [],
        known: [],
        current: null,
      };
    }

    const completed = new Set(
      saved.completed || []
    );

    const known = new Set(
      saved.known || []
    );

    /*
     * Remove the current item first so that
     * the user can change their decision.
     */
    completed.delete(result.id);
    known.delete(result.id);

    /*
     * Store the user's decision.
     */
    if (result.result === "known") {
      known.add(result.id);
    } else {
      completed.add(result.id);
    }

    /*
     * Get the current AI roadmap.
     */
    const roadmap =
      getGeneratedRoadmap();

    /*
     * Flatten the hierarchy:
     *
     * Phase
     *   ↓
     * Topic
     *   ↓
     * Subtopic
     *   ↓
     * Micro-topic
     */
    const learningNodes = [];

    roadmap.forEach((phase) => {
      const topics =
        phase.children || [];

      topics.forEach((topic) => {
        learningNodes.push(topic);

        const subtopics =
          topic.children || [];

        subtopics.forEach((subtopic) => {
          learningNodes.push(subtopic);

          const microTopics =
            subtopic.children || [];

          microTopics.forEach(
            (microTopic) => {
              learningNodes.push(
                microTopic
              );
            }
          );
        });
      });
    });

    /*
     * Find the current item's position.
     */
    const currentIndex =
      learningNodes.findIndex(
        (node) =>
          node.id === result.id
      );

    /*
     * Find the next unfinished item.
     */
    let nextNode = null;

    if (currentIndex !== -1) {
      for (
        let i = currentIndex + 1;
        i < learningNodes.length;
        i++
      ) {
        const node =
          learningNodes[i];

        if (
          !completed.has(node.id) &&
          !known.has(node.id)
        ) {
          nextNode = node;
          break;
        }
      }
    }

    const nextCurrent =
      nextNode?.id ||
      result.id;

    const newProgress = {
      completed: [
        ...completed,
      ],

      known: [
        ...known,
      ],

      current: nextCurrent,
    };

    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify(
        newProgress
      )
    );

    setPage("journey");
  };

  /*
   * LANDING
   */
  if (page === "landing") {
    return (
      <Landing
        onStart={() =>
          setPage("onboarding")
        }
      />
    );
  }

  /*
   * ONBOARDING
   */
  if (page === "onboarding") {
    return (
      <Onboarding
        onComplete={(profile) => {
          /*
           * Save the complete AI-generated
           * learner profile.
           */
          setUserProfile(profile);

          localStorage.setItem(
            PROFILE_KEY,
            JSON.stringify(profile)
          );

          /*
           * Start a completely fresh
           * journey for this learner.
           */
          localStorage.removeItem(
            PROGRESS_KEY
          );

          /*
           * The old career-type system
           * is no longer required.
           */
          localStorage.removeItem(
            "pathforge_career_type"
          );

          setPage("journey");
        }}
      />
    );
  }

  /*
   * COURSE
   */
  if (page === "course") {
    return (
      <Course
        stage={selectedStage}
        userProfile={userProfile}
        roadmap={getGeneratedRoadmap()}
        onBack={() =>
          setPage("journey")
        }
        onComplete={updateProgress}
      />
    );
  }

  /*
   * JOURNEY
   */
  return (
    <Journey
      userProfile={userProfile}

      /*
       * This is the important new prop.
       *
       * Journey will now receive the roadmap
       * generated specifically for this learner.
       */
      roadmap={getGeneratedRoadmap()}

      onOpenCourse={(stage) => {
        setSelectedStage(stage);
        setPage("course");
      }}
    />
  );
}

export default App;