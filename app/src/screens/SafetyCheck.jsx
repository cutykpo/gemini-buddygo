import { useState } from "react";

export default function SafetyCheck({ onComplete }) {
  const [answers, setAnswers] = useState({
    hasCardiacCondition: null,
    hasPhysicalLimitation: null,
    doctorConsulted: null,
  });
  const [showWarning, setShowWarning] = useState(false);

  const allAnswered =
    answers.hasCardiacCondition !== null &&
    answers.hasPhysicalLimitation !== null &&
    answers.doctorConsulted !== null;

  function handleAnswer(field, value) {
    setAnswers((prev) => ({ ...prev, [field]: value }));
    setShowWarning(false);
  }

  function handleContinue() {
    if (!allAnswered) return;
    if (answers.doctorConsulted === false) {
      setShowWarning(true);
      return;
    }
    onComplete(answers);
  }

  function handleContinueAnyway() {
    const consentTimestamp = new Date().toISOString();
    onComplete({ ...answers, consentTimestamp });
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.icon}>🛡️</div>
        <h1 style={styles.title}>Before we start</h1>
        <p style={styles.subtitle}>
          Three quick questions to personalize your experience safely.
        </p>
      </div>

      {/* PREGUNTA 1 */}
      <div style={styles.questionCard}>
        <p style={styles.question}>
          Do you have any known heart condition?
        </p>
        <div style={styles.options}>
          <button
            style={{
              ...styles.optionBtn,
              ...(answers.hasCardiacCondition === true ? styles.optionSelected : {}),
            }}
            onClick={() => handleAnswer("hasCardiacCondition", true)}
          >
            Yes
          </button>
          <button
            style={{
              ...styles.optionBtn,
              ...(answers.hasCardiacCondition === false ? styles.optionSelected : {}),
            }}
            onClick={() => handleAnswer("hasCardiacCondition", false)}
          >
            No
          </button>
        </div>
        {answers.hasCardiacCondition === true && (
          <p style={styles.hint}>
            No problem — we'll keep your plan gentle and progressive.
          </p>
        )}
      </div>

      {/* PREGUNTA 2 */}
      <div style={styles.questionCard}>
        <p style={styles.question}>
          Do you have any physical limitation or disability that affects your mobility?
        </p>
        <div style={styles.options}>
          <button
            style={{
              ...styles.optionBtn,
              ...(answers.hasPhysicalLimitation === true ? styles.optionSelected : {}),
            }}
            onClick={() => handleAnswer("hasPhysicalLimitation", true)}
          >
            Yes
          </button>
          <button
            style={{
              ...styles.optionBtn,
              ...(answers.hasPhysicalLimitation === false ? styles.optionSelected : {}),
            }}
            onClick={() => handleAnswer("hasPhysicalLimitation", false)}
          >
            No
          </button>
        </div>
        {answers.hasPhysicalLimitation === true && (
          <p style={styles.hint}>
            We'll adapt every mission to what works for your body.
          </p>
        )}
      </div>

      {/* PREGUNTA 3 */}
      <div style={styles.questionCard}>
        <p style={styles.question}>
          Have you consulted a doctor before starting a physical activity program?
        </p>
        <div style={styles.options}>
          <button
            style={{
              ...styles.optionBtn,
              ...(answers.doctorConsulted === true ? styles.optionSelected : {}),
            }}
            onClick={() => handleAnswer("doctorConsulted", true)}
          >
            Yes
          </button>
          <button
            style={{
              ...styles.optionBtn,
              ...(answers.doctorConsulted === false ? styles.optionSelected : {}),
            }}
            onClick={() => handleAnswer("doctorConsulted", false)}
          >
            Not yet
          </button>
        </div>
      </div>

      {/* WARNING si no consultó médico */}
      {showWarning && (
        <div style={styles.warningCard}>
          <p style={styles.warningText}>
            We recommend checking with your doctor before starting. It only takes one visit and makes everything safer.
          </p>
          <button style={styles.warningPrimary} onClick={handleContinueAnyway}>
            I understand, continue anyway
          </button>
          <button style={styles.warningSecondary} onClick={() => setShowWarning(false)}>
            I'll consult first
          </button>
        </div>
      )}

      {/* DISCLAIMER LEGAL */}
      <p style={styles.disclaimer}>
        BuddyGo is a wellness companion, not a medical device. It does not replace professional medical advice, diagnosis, or treatment.
      </p>

      {/* BOTÓN CONTINUAR */}
      {!showWarning && (
        <button
          style={{
            ...styles.continueBtn,
            ...(!allAnswered ? styles.continueBtnDisabled : {}),
          }}
          onClick={handleContinue}
          disabled={!allAnswered}
        >
          Continue →
        </button>
      )}
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
  header: {
    textAlign: "center",
    marginBottom: 32,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 800,
    color: "#1A1208",
    letterSpacing: "-0.5px",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#5C4A2A",
    lineHeight: 1.6,
  },
  questionCard: {
    background: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    border: "1px solid rgba(232,93,4,0.1)",
  },
  question: {
    fontSize: 15,
    fontWeight: 600,
    color: "#1A1208",
    lineHeight: 1.5,
    marginBottom: 16,
  },
  options: {
    display: "flex",
    gap: 10,
  },
  optionBtn: {
    flex: 1,
    padding: "12px",
    borderRadius: 10,
    border: "1.5px solid rgba(232,93,4,0.2)",
    background: "white",
    color: "#5C4A2A",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  optionSelected: {
    background: "#E85D04",
    color: "white",
    border: "1.5px solid #E85D04",
  },
  hint: {
    fontSize: 12,
    color: "#2D6A4F",
    marginTop: 10,
