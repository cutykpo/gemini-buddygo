import { useState } from "react";

const FEELINGS = [
  { id: "tired", emoji: "😮‍💨", label: "I get tired more than I'd like" },
  { id: "weight", emoji: "⚖️", label: "I'm gaining weight despite eating the same" },
  { id: "heavy", emoji: "🪨", label: "I feel heavy and struggle to move" },
  { id: "pressure", emoji: "❤️‍🩹", label: "I want to control my blood pressure" },
  { id: "energy", emoji: "⚡", label: "I want more energy for my family" },
];

const GOALS = [
  { id: "walk", emoji: "🚶", label: "Walk without getting tired" },
  { id: "weight_loss", emoji: "📉", label: "Lose weight" },
  { id: "control", emoji: "🎯", label: "Control my sugar or blood pressure" },
  { id: "feel_better", emoji: "😊", label: "Feel better overall" },
  { id: "family", emoji: "👨‍👩‍👧", label: "Be there for my family" },
];

const ACTIVITY_LEVELS = [
  { id: "none", label: "I don't exercise at all" },
  { id: "light", label: "Light walks occasionally" },
  { id: "moderate", label: "I walk or move 2-3 times a week" },
  { id: "active", label: "I'm fairly active already" },
];

export default function Onboarding({ safetyData, onComplete }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    name: "",
    age: "",
    feelingToday: null,
    mainGoal: null,
    currentActivity: null,
  });

  function handleNext() {
    if (step < 4) setStep(step + 1);
    else onComplete({ ...data, ...safetyData });
  }

  const canProceed = () => {
    if (step === 1) return data.name.trim() !== "" && data.age !== "";
    if (step === 2) return data.feelingToday !== null;
    if (step === 3) return data.mainGoal !== null;
    if (step === 4) return data.currentActivity !== null;
    return false;
  };

  return (
    <div style={styles.container}>
      {/* PROGRESS BAR */}
      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${(step / 4) * 100}%` }} />
      </div>
      <div style={styles.stepLabel}>Step {step} of 4</div>

      {/* STEP 1: nombre y edad */}
      {step === 1 && (
        <div style={styles.stepContainer}>
          <div style={styles.emoji}>👋</div>
          <h2 style={styles.title}>Let's get to know you</h2>
          <p style={styles.subtitle}>Just the basics to get started.</p>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Your first name</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Alejandro"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Your age</label>
            <input
              style={styles.input}
              type="number"
              placeholder="45"
              min="18"
              max="99"
              value={data.age}
              onChange={(e) => setData({ ...data, age: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* STEP 2: cómo se siente */}
      {step === 2 && (
        <div style={styles.stepContainer}>
          <div style={styles.emoji}>🌡️</div>
          <h2 style={styles.title}>How do you feel today?</h2>
          <p style={styles.subtitle}>Choose the one that resonates most.</p>

          <div style={styles.optionList}>
            {FEELINGS.map((f) => (
              <button
                key={f.id}
                style={{
                  ...styles.optionCard,
                  ...(data.feelingToday === f.id ? styles.optionCardSelected : {}),
                }}
                onClick={() => setData({ ...data, feelingToday: f.id })}
              >
                <span style={styles.optionEmoji}>{f.emoji}</span>
                <span style={styles.optionLabel}>{f.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: objetivo */}
      {step === 3 && (
        <div style={styles.stepContainer}>
          <div style={styles.emoji}>🎯</div>
          <h2 style={styles.title}>What do you want to achieve?</h2>
          <p style={styles.subtitle}>In the next 3 months.</p>

          <div style={styles.optionList}>
            {GOALS.map((g) => (
              <button
                key={g.id}
                style={{
                  ...styles.optionCard,
                  ...(data.mainGoal === g.id ? styles.optionCardSelected : {}),
                }}
                onClick={() => setData({ ...data, mainGoal: g.id })}
              >
                <span style={styles.optionEmoji}>{g.emoji}</span>
                <span style={styles.optionLabel}>{g.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: actividad actual */}
      {step === 4 && (
        <div style={styles.stepContainer}>
          <div style={styles.emoji}>🏃</div>
          <h2 style={styles.title}>How active are you right now?</h2>
          <p style={styles.subtitle}>Be honest — this helps us start at the right level.</p>

          <div style={styles.optionList}>
            {ACTIVITY_LEVELS.map((a) => (
              <button
                key={a.id}
                style={{
                  ...styles.optionCard,
                  ...(data.currentActivity === a.id ? styles.optionCardSelected : {}),
                }}
                onClick={() => setData({ ...data, currentActivity: a.id })}
              >
                <span style={styles.optionLabel}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* NAVEGACIÓN */}
      <div style={styles.nav}>
        {step > 1 && (
          <button style={styles.backBtn} onClick={() => setStep(step - 1)}>
            ← Back
          </button>
        )}
        <button
          style={{
            ...styles.nextBtn,
            ...(!canProceed() ? styles.nextBtnDisabled : {}),
            ...(step === 1 ? { marginLeft: "auto" } : {}),
          }}
          onClick={handleNext}
          disabled={!canProceed()}
        >
          {step === 4 ? "Generate my plan ✨" : "Next →"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 390,
    margin: "0 auto",
    padding: "24px 20px 40px",
    fontFamily: "Inter, system-ui, sans-serif",
    background: "#F5F0E8",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  progressBar: {
    height: 4,
    background: "rgba(232,93,4,0.15)",
    borderRadius: 2,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "#E85D04",
    borderRadius: 2,
    transition: "width 0.3s ease",
  },
  stepLabel: {
    fontSize: 11,
    color: "#9C8B70",
    marginBottom: 32,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  stepContainer: { flex: 1 },
  emoji: { fontSize: 44, marginBottom: 16 },
  title: {
    fontSize: 24,
    fontWeight: 800,
    color: "#1A1208",
    letterSpacing: "-0.5px",
    marginBottom: 8,
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: 15,
    color: "#5C4A2A",
    marginBottom: 28,
    lineHeight: 1.5,
  },
  inputGroup: { marginBottom: 16 },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#5C4A2A",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 12,
    border: "1.5px solid rgba(232,93,4,0.2)",
    background: "white",
    fontSize: 16,
    color: "#1A1208",
    outline: "none",
    boxSizing: "border-box",
  },
  optionList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  optionCard: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "14px 16px",
    borderRadius: 12,
    border: "1.5px solid rgba(232,93,4,0.15)",
    background: "white",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.15s ease",
  },
  optionCardSelected: {
    background: "#E85D04",
    border: "1.5px solid #E85D04",
  },
  optionEmoji: { fontSize: 22, flexShrink: 0 },
  optionLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: "#1A1208",
    lineHeight: 1.4,
  },
  nav: {
    display: "flex",
    gap: 10,
    marginTop: 32,
  },
  backBtn: {
    flex: 1,
    padding: "15px",
    borderRadius: 12,
    border: "1.5px solid rgba(232,93,4,0.2)",
    background: "white",
    color: "#5C4A2A",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },
  nextBtn: {
    flex: 2,
    padding: "15px",
    borderRadius: 12,
    border: "none",
    background: "#E85D04",
    color: "white",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
  nextBtnDisabled: {
    background: "#D4C5B0",
    cursor: "not-allowed",
  },
};
