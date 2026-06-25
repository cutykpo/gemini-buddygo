import { useState, useEffect } from "react";
import { generateWeeklyPlan } from "../services/gemini";

const LOADING_MESSAGES = [
  "Analyzing your profile...",
  "Calibrating your starting point...",
  "Designing your first mission...",
  "Almost ready...",
];

export default function PlanGeneration({ userProfile, onComplete }) {
  const [status, setStatus] = useState("loading");
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingIndex((prev) =>
        prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev
      );
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchPlan() {
      try {
        const result = await generateWeeklyPlan(userProfile);
        setPlan(result);
        setStatus("ready");
      } catch (err) {
        setError("Something went wrong. Please try again.");
        setStatus("error");
      }
    }
    fetchPlan();
  }, []);

  if (status === "loading") {
    return (
      <div style={styles.container}>
        <div style={styles.loadingCenter}>
          <div style={styles.pulseRing} />
          <div style={styles.pulseCore}>🤖</div>
          <h2 style={styles.loadingTitle}>Gemini is building your plan</h2>
          <p style={styles.loadingMsg}>{LOADING_MESSAGES[loadingIndex]}</p>
          <div style={styles.dots}>
            <span style={styles.dot} />
            <span style={styles.dot} />
            <span style={styles.dot} />
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div style={styles.container}>
        <div style={styles.errorCenter}>
          <div style={styles.errorIcon}>⚠️</div>
          <p style={styles.errorText}>{error}</p>
          <button style={styles.retryBtn} onClick={() => window.location.reload()}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.successHeader}>
        <div style={styles.successIcon}>✨</div>
        <h1 style={styles.successTitle}>Your plan is ready,{"\n"}{userProfile.name}!</h1>
        <p style={styles.coachMessage}>"{plan.coachMessage}"</p>
      </div>

      {/* PLAN CARDS */}
      <div style={styles.planCard}>
        <div style={styles.planCardLabel}>WEEKLY WALKING GOAL</div>
        <div style={styles.planCardValue}>
          {plan.walkingMinutesPerWeek}
          <span style={styles.planCardUnit}> min</span>
        </div>
        <div style={styles.planCardSub}>
          {plan.dailyWalkingSessions} sessions per week ·{" "}
          {Math.round(plan.walkingMinutesPerWeek / plan.dailyWalkingSessions)} min each
        </div>
      </div>

      <div style={styles.planCard}>
        <div style={styles.planCardLabel}>THIS WEEK'S HABIT</div>
        <div style={styles.habitText}>🥗 {plan.dietaryHabit}</div>
      </div>

      {/* MISSION */}
      <div style={styles.missionCard}>
        <div style={styles.missionLabel}>FIRST MISSION</div>
        <div style={styles.missionTitle}>{plan.missionTitle}</div>
        <div style={styles.missionZone}>📍 {plan.missionZone}</div>
        <p style={styles.missionDesc}>{plan.missionDescription}</p>
        <div style={styles.difficultyBadge}>
          {plan.difficultyLevel === "easy" && "🟢 Easy start"}
          {plan.difficultyLevel === "moderate" && "🟡 Moderate"}
          {plan.difficultyLevel === "challenging" && "🔴 Challenging"}
        </div>
      </div>

      {/* DISCLAIMER */}
      <p style={styles.disclaimer}>
        This plan is a wellness guide, not medical advice. Adjust based on how you feel.
      </p>

      {/* CTA */}
      <button style={styles.continueBtn} onClick={() => onComplete(plan)}>
        Find my buddy →
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 390,
    margin: "0 auto",
    padding: "32px 20px 40px",
    fontFamily: "Inter, system-ui, sans-serif",
    background: "#F5F0E8",
    minHeight: "100vh",
  },
  loadingCenter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    textAlign: "center",
    padding: "0 20px",
  },
  pulseRing: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    border: "3px solid rgba(232,93,4,0.3)",
    position: "absolute",
    animation: "pulse 2s infinite",
  },
  pulseCore: {
    fontSize: 48,
    marginBottom: 32,
    position: "relative",
  },
  loadingTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: "#1A1208",
    marginBottom: 12,
    letterSpacing: "-0.5px",
  },
  loadingMsg: {
    fontSize: 15,
    color: "#5C4A2A",
    marginBottom: 24,
    minHeight: 24,
    transition: "opacity 0.3s ease",
  },
  dots: {
    display: "flex",
    gap:
