import { useState } from "react";
import { analyzeCheckin } from "../services/gemini";

export default function Checkin({ userPlan, userProfile, onComplete }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    minutesWalked: 0,
    dietFollowed: null,
    missionCompleted: null,
    freeText: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const goal = userPlan?.walkingMinutesPerWeek || 150;

  async function handleSubmit() {
    setLoading(true);
    try {
      const analysis = await analyzeCheckin({
        ...data,
        minutesGoal: goal,
        streak: userProfile?.streak || 0,
        buddyCompleted: true,
        hasCardiacCondition: userProfile?.hasCardiacCondition || false,
        hasPhysicalLimitation: userProfile?.hasPhysicalLimitation || false,
      });
      setResult(analysis);
      setStep(4);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  const canProceed = () => {
    if (step === 1) return data.minutesWalked >= 0;
    if (step === 2) return data.dietFollowed !== null;
    if (step === 3) return data.missionCompleted !== null;
    return false;
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      {step < 4 && (
        <>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${(step / 3) * 100}%` }} />
          </div>
          <div style={styles.stepLabel}>Step {step} of 3</div>
        </>
      )}

      {/* STEP 1: minutos caminados */}
      {step === 1 && (
        <div style={styles.stepContainer}>
          <div style={styles.emoji}>🚶</div>
          <h2 style={styles.title}>How many minutes did you walk this week?</h2>
          <p style={styles.subtitle}>Your goal was {goal} minutes.</p>

          <div style={styles.sliderContainer}>
            <div style={styles.sliderValue}>{data.minutesWalked} min</div>
            <input
              type="range"
              min="0"
              max={Math.max(goal * 1.5, 300)}
              value={data.minutesWalked}
              onChange={(e) =>
                setData({ ...data, minutesWalked: parseInt(e.target.value) })
              }
              style={styles.slider}
            />
            <div style={styles.sliderLabels}>
              <span>0</span>
              <span>Goal: {goal}</span>
              <span>{Math.round(goal * 1.5)}</span>
            </div>
          </div>

          <div style={styles.progressCard}>
            <div style={styles.progressRow}>
              <span style={styles.progressLabel}>Progress toward goal</span>
              <span style={styles.progressPct}>
                {Math.min(100, Math.round((data.minutesWalked / goal) * 100))}%
              </span>
            </div>
            <div style={styles.progressBar2}>
              <div
                style={{
                  ...styles.progressFill2,
                  width: `${Math.min(100, (data.minutesWalked / goal) * 100)}%`,
                  background:
                    data.minutesWalked >= goal ? "#2D6A4F" : "#E85D04",
                }}
              />
            </div>
            {data.minutesWalked >= goal && (
              <p style={styles.goalMet}>🎉 Goal completed!</p>
            )}
            {data.minutesWalked > 0 && data.minutesWalked < goal * 0.6 && (
              <p style={styles.goalPartial}>
                Every minute counts. Partial progress still earns points.
              </p>
            )}
          </div>
        </div>
      )}

      {/* STEP 2: hábito dietético */}
      {step === 2 && (
        <div style={styles.stepContainer}>
          <div style={styles.emoji}>🥗</div>
          <h2 style={styles.title}>Did you follow your dietary habit?</h2>
          <p style={styles.subtitle}>
            This week's habit: {userPlan?.dietaryHabit || "Eat one extra vegetable per day"}
          </p>

          <div style={styles.optionList}>
            {[
              { id: true, emoji: "✅", label: "Yes, I followed it" },
              { id: "partial", emoji: "🟡", label: "Partially" },
              { id: false, emoji: "❌", label: "Not this week" },
            ].map((opt) => (
              <button
                key={String(opt.id)}
                style={{
                  ...styles.optionCard,
                  ...(data.dietFollowed === opt.id ? styles.optionSelected : {}),
                }}
                onClick={() => setData({ ...data, dietFollowed: opt.id })}
              >
                <span style={styles.optionEmoji}>{opt.emoji}</span>
                <span style={styles.optionLabel}>{opt.label}</span>
              </button>
            ))}
          </div>

          {data.dietFollowed === false && (
            <p style={styles.encouragement}>
              No worries — next week is a fresh start. Every small step matters.
            </p>
          )}
        </div>
      )}

      {/* STEP 3: misión + nota al buddy */}
      {step === 3 && (
        <div style={styles.stepContainer}>
          <div style={styles.emoji}>🗺️</div>
          <h2 style={styles.title}>Did you complete this week's mission?</h2>
          <p style={styles.subtitle}>
            Mission: {userPlan?.missionTitle || "Explore the riverside zone"}
          </p>

          <div style={styles.optionList}>
            {[
              { id: true, emoji: "🏆", label: "Yes, mission complete!" },
              { id: false, emoji: "⏳", label: "Not this time" },
            ].map((opt) => (
              <button
                key={String(opt.id)}
                style={{
                  ...styles.optionCard,
                  ...(data.missionCompleted === opt.id ? styles.optionSelected : {}),
                }}
                onClick={() => setData({ ...data, missionCompleted: opt.id })}
              >
                <span style={styles.optionEmoji}>{opt.emoji}</span>
                <span style={styles.optionLabel}>{opt.label}</span>
              </button>
            ))}
          </div>

          <div style={styles.noteContainer}>
            <label style={styles.noteLabel}>
              Leave a note for your buddy (optional)
            </label>
            <textarea
              style={styles.textarea}
              placeholder="How was your week? Any wins to share?"
              value={data.freeText}
              onChange={(e) => setData({ ...data, freeText: e.target.value })}
              rows={3}
            />
          </div>
        </div>
      )}

      {/* STEP 4: RESULTADO */}
      {step === 4 && result && (
        <div style={styles.resultContainer}>
          <div style={styles.resultHeader}>
            <div style={styles.resultIcon}>
              {result.emotionalTone === "positive" ? "🎉" : "💪"}
            </div>
            <h2 style={styles.resultTitle}>Week complete!</h2>
            <p style={styles.resultMessage}>{result.feedbackMessage}</p>
          </div>

          <div style={styles.pointsCard}>
            <div style={styles.pointsLabel}>POINTS EARNED</div>
            <div style={styles.pointsValue}>+{result.pointsEarned} BP</div>
          </div>

          {result.badgeUnlocked && (
            <div style={styles.badgeCard}>
              <div style={styles.badgeIcon}>🏅</div>
              <div>
                <div style={styles.badgeTitle}>Badge unlocked!</div>
                <div style={styles.badgeName}>{result.badgeUnlocked}</div>
              </div>
            </div>
          )}

          <div style={styles.nextWeekCard}>
            <div style={styles.nextWeekLabel}>NEXT WEEK</div>
            <div style={styles.nextWeekGoal}>
              🚶 {result.nextWalkingMinutes} min walking goal
            </div>
            <div style={styles.nextWeekHabit}>
              🥗 {result.nextDietaryHabit}
            </div>
            <div style={styles.nextWeekMission}>
              🗺️ {result.nextMissionTitle}
            </div>
          </div>

          <button style={styles.doneBtn} onClick={() => onComplete(result)}>
            Back to home →
          </button>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingBox}>
            <div style={styles.loadingEmoji}>🤖</div>
            <p style={styles.loadingText}>Gemini is analyzing your week...</p>
          </div>
        </div>
      )}

      {/* NAVEGACIÓN */}
      {step < 4 && !loading && (
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
            onClick={step === 3 ? handleSubmit : () => setStep(step + 1)}
            disabled={!canProceed()}
          >
            {step === 3 ? "Submit check-in ✓" : "Next →"}
          </button>
        </div>
      )}
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
    fontSize: 22,
    fontWeight: 800,
    color: "#1A1208",
    letterSpacing: "-0.5px",
    marginBottom: 8,
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: 14,
    color: "#5C4A2A",
    marginBottom: 28,
    lineHeight: 1.5,
  },
  sliderContainer: {
    background: "white",
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    border: "1px solid rgba(232,93,4,0.1)",
  },
  sliderValue: {
    fontSize: 48,
    fontWeight: 800,
    color: "#1A1208",
    letterSpacing: "-2px",
    textAlign: "center",
    marginBottom: 16,
  },
  slider: {
    width: "100%",
    accentColor: "#E85D04",
    marginBottom: 8,
  },
  sliderLabels: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 11,
    color: "#9C8B70",
  },
  progressCard: {
    background: "white",
    borderRadius: 16,
    padding: 16,
    border: "1px solid rgba(232,93,4,0.1)",
  },
  progressRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: { fontSize: 13, color: "#5C4A2A" },
  progressPct: { fontSize: 13, fontWeight: 700, color: "#E85D04" },
  progressBar2: {
    height: 8,
    background: "#F5F0E8",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill2: {
    height: "100%",
    borderRadius: 4,
    transition: "width 0.4s ease",
  },
  goalMet: { fontSize: 13, color: "#2D6A4F", fontWeight: 600 },
  goalPartial: { fontSize: 13, color: "#9C8B70", fontStyle: "italic" },
  optionList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 16,
  },
  optionCard: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "16px",
    borderRadius: 12,
    border: "1.5px solid rgba(232,93,4,0.15)",
    background: "white",
    cursor: "pointer",
    textAlign: "left",
  },
  optionSelected: {
    background: "#E85D04",
    border: "1.5px solid #E85D04",
  },
  optionEmoji: { fontSize: 22, flexShrink: 0 },
  optionLabel: { fontSize: 14, fontWeight: 500, color: "#1A1208" },
  encouragement: {
    fontSize: 13,
    color: "#2D6A4F",
    fontStyle: "italic",
    textAlign: "center",
    padding: "0 8px",
  },
  noteContainer: { marginTop: 8 },
  noteLabel: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#5C4A2A",
    marginBottom: 8,
  },
  textarea: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 12,
    border: "1.5px solid rgba(232,93,4,0.2)",
    background: "white",
    fontSize: 14,
    color: "#1A1208",
    outline: "none",
    resize: "none",
    boxSizing: "border-box",
    fontFamily: "Inter, system-ui, sans-serif",
    lineHeight: 1.5,
  },
  resultContainer: { flex: 1 },
  resultHeader: { textAlign: "center", marginBottom: 24 },
  resultIcon: { fontSize: 56, marginBottom: 12 },
  resultTitle: {
    fontSize: 26,
    fontWeight: 800,
    color: "#1A1208",
    marginBottom: 8,
  },
  resultMessage: {
    fontSize: 15,
    color: "#5C4A2A",
    lineHeight: 1.6,
    fontStyle: "italic",
  },
  pointsCard: {
    background: "#E85D04",
    borderRadius: 16,
    padding: 20,
    textAlign: "center",
    marginBottom: 12,
  },
  pointsLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "rgba(255,255,255,0.7)",
    marginBottom: 4,
  },
  pointsValue: {
    fontSize: 40,
    fontWeight: 800,
    color: "white",
    letterSpacing: "-1px",
  },
  badgeCard: {
    background: "#FFD166",
    borderRadius: 16,
    padding: 16,
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 12,
  },
  badgeIcon: { fontSize: 32, flexShrink: 0 },
  badgeTitle: { fontSize: 11, fontWeight: 700, color: "#9D2C00", letterSpacing: "0.08em", textTransform: "uppercase" },
  badgeName: { fontSize: 16, fontWeight: 700, color: "#1A1208" },
  nextWeekCard: {
    background: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    border: "1px solid rgba(232,93,4,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  nextWeekLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "#E85D04",
  },
  nextWeekGoal: { fontSize: 14, color: "#1A1208", fontWeight: 600 },
  nextWeekHabit: { fontSize: 14, color: "#1A1208" },
  nextWeekMission: { fontSize: 14, color: "#1A1208" },
  doneBtn: {
    width: "100%",
    background: "#E85D04",
    color: "white",
    border: "none",
    padding: "16px",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
  loadingOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(26,18,8,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  loadingBox: {
    background: "white",
    borderRadius: 20,
    padding: 32,
    textAlign: "center",
    maxWidth: 280,
  },
  loadingEmoji: { fontSize: 40, marginBottom: 12 },
  loadingText: { fontSize: 15, color: "#5C4A2A", lineHeight: 1.5 },
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
