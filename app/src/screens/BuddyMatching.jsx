import { useState } from "react";

export default function BuddyMatching({ userProfile, onComplete }) {
  const [mode, setMode] = useState(null); // 'auto' | 'invite'
  const [email, setEmail] = useState("");
  const [searching, setSearching] = useState(false);
  const [matched, setMatched] = useState(null);

  async function handleAutoMatch() {
    setSearching(true);
    // Simula búsqueda de buddy por Gemini
    await new Promise((r) => setTimeout(r, 2500));
    setMatched({
      name: "Maria",
      age: 48,
      goal: "Feel better overall",
      zone: "Riverside",
      compatibilityScore: 91,
      matchReason: "Same goal, similar age, same neighborhood zone.",
    });
    setSearching(false);
  }

  function handleInvite() {
    if (!email.trim()) return;
    onComplete({ buddyMode: "invite", buddyEmail: email });
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.icon}>🤝</div>
        <h1 style={styles.title}>Find your buddy</h1>
        <p style={styles.subtitle}>
          Your buddy never sees your health data. They only see whether you
          completed your week.
        </p>
      </div>

      {/* SELECCIÓN DE MODO */}
      {!mode && (
        <div style={styles.modeContainer}>
          <button
            style={styles.modeCard}
            onClick={() => {
              setMode("auto");
              handleAutoMatch();
            }}
          >
            <span style={styles.modeEmoji}>🤖</span>
            <div>
              <div style={styles.modeTitle}>Let Gemini match me</div>
              <div style={styles.modeSub}>
                Find someone nearby with the same goal
              </div>
            </div>
            <span style={styles.modeArrow}>→</span>
          </button>

          <div style={styles.orDivider}>or</div>

          <button
            style={styles.modeCard}
            onClick={() => setMode("invite")}
          >
            <span style={styles.modeEmoji}>💌</span>
            <div>
              <div style={styles.modeTitle}>Invite someone I know</div>
              <div style={styles.modeSub}>
                A friend, partner, or family member
              </div>
            </div>
            <span style={styles.modeArrow}>→</span>
          </button>
        </div>
      )}

      {/* AUTO MATCH: BUSCANDO */}
      {mode === "auto" && searching && (
        <div style={styles.searchingContainer}>
          <div style={styles.searchingIcon}>🔍</div>
          <h2 style={styles.searchingTitle}>Gemini is finding your buddy</h2>
          <p style={styles.searchingText}>
            Matching by goal, age, and neighborhood...
          </p>
          <div style={styles.dots}>
            <span style={styles.dot} />
            <span style={styles.dot} />
            <span style={styles.dot} />
          </div>
        </div>
      )}

      {/* AUTO MATCH: RESULTADO */}
      {mode === "auto" && matched && (
        <div>
          <div style={styles.matchCard}>
            <div style={styles.matchHeader}>
              <div style={styles.matchAvatar}>
                {matched.name.charAt(0)}
              </div>
              <div>
                <div style={styles.matchName}>{matched.name}, {matched.age}</div>
                <div style={styles.matchZone}>📍 {matched.zone}</div>
              </div>
              <div style={styles.matchScore}>
                {matched.compatibilityScore}%
                <div style={styles.matchScoreLabel}>match</div>
              </div>
            </div>

            <div style={styles.matchGoalRow}>
              <span style={styles.matchGoalLabel}>Goal</span>
              <span style={styles.matchGoalValue}>{matched.goal}</span>
            </div>

            <div style={styles.matchReason}>
              🤖 {matched.matchReason}
            </div>
          </div>

          <div style={styles.privacyNote}>
            🔒 {matched.name} will only see your name and whether you
            completed each week. No health data is ever shared.
          </div>

          <button
            style={styles.acceptBtn}
            onClick={() => onComplete({ buddyMode: "auto", buddy: matched })}
          >
            Accept this buddy →
          </button>

          <button
            style={styles.rematchBtn}
            onClick={() => {
              setMatched(null);
              setSearching(true);
              handleAutoMatch();
            }}
          >
            Find a different buddy
          </button>
        </div>
      )}

      {/* INVITE MODE */}
      {mode === "invite" && (
        <div>
          <div style={styles.inviteCard}>
            <div style={styles.inviteIcon}>💌</div>
            <h2 style={styles.inviteTitle}>Invite your buddy</h2>
            <p style={styles.inviteText}>
              We'll send them an invitation to join BuddyGo and walk with you.
            </p>
            <input
              style={styles.input}
              type="email"
              placeholder="buddy@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={styles.privacyNote}>
            🔒 Your buddy will only see your name and weekly completion.
            No health data is ever shared.
          </div>

          <button
            style={{
              ...styles.acceptBtn,
              ...(!email.trim() ? styles.btnDisabled : {}),
            }}
            onClick={handleInvite}
            disabled={!email.trim()}
          >
            Send invitation →
          </button>

          <button
            style={styles.rematchBtn}
            onClick={() => setMode(null)}
          >
            ← Back
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
    padding: "32px 20px 40px",
    fontFamily: "Inter, system-ui, sans-serif",
    background: "#F5F0E8",
    minHeight: "100vh",
  },
  header: {
    textAlign: "center",
    marginBottom: 32,
  },
  icon: { fontSize: 48, marginBottom: 12 },
  title: {
    fontSize: 26,
    fontWeight: 800,
    color: "#1A1208",
    letterSpacing: "-0.5px",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#5C4A2A",
    lineHeight: 1.6,
    padding: "0 8px",
  },
  modeContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  modeCard: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "18px 16px",
    borderRadius: 16,
    border: "1.5px solid rgba(232,93,4,0.15)",
    background: "white",
    cursor: "pointer",
    textAlign: "left",
  },
  modeEmoji: { fontSize: 28, flexShrink: 0 },
  modeTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "#1A1208",
    marginBottom: 2,
  },
  modeSub: { fontSize: 13, color: "#9C8B70" },
  modeArrow: {
    fontSize: 18,
    color: "#E85D04",
    marginLeft: "auto",
    flexShrink: 0,
  },
  orDivider: {
    textAlign: "center",
    fontSize: 13,
    color: "#9C8B70",
    padding: "8px 0",
  },
  searchingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "60px 0",
    textAlign: "center",
  },
  searchingIcon: { fontSize: 48, marginBottom: 20 },
  searchingTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: "#1A1208",
    marginBottom: 8,
  },
  searchingText: {
    fontSize: 14,
    color: "#5C4A2A",
    marginBottom: 24,
  },
  dots: { display: "flex", gap: 8 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#E85D04",
    opacity: 0.5,
  },
  matchCard: {
    background: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    border: "1px solid rgba(232,93,4,0.1)",
  },
  matchHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  matchAvatar: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    background: "#1A3C2B",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: 700,
    flexShrink: 0,
  },
  matchName: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1A1208",
  },
  matchZone: { fontSize: 13, color: "#9C8B70", marginTop: 2 },
  matchScore: {
    marginLeft: "auto",
    textAlign: "center",
    fontSize: 22,
    fontWeight: 800,
    color: "#E85D04",
    flexShrink: 0,
  },
  matchScoreLabel: {
    fontSize: 10,
    fontWeight: 600,
    color: "#9C8B70",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  matchGoalRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderTop: "1px solid rgba(232,93,4,0.08)",
    borderBottom: "1px solid rgba(232,93,4,0.08)",
    marginBottom: 12,
  },
  matchGoalLabel: { fontSize: 13, color: "#9C8B70" },
  matchGoalValue: { fontSize: 13, fontWeight: 600, color: "#1A1208" },
  matchReason: {
    fontSize: 13,
    color: "#5C4A2A",
    lineHeight: 1.5,
    fontStyle: "italic",
  },
  privacyNote: {
    fontSize: 12,
    color: "#2D6A4F",
    background: "rgba(45,106,79,0.08)",
    borderRadius: 10,
    padding: "10px 14px",
    marginBottom: 16,
    lineHeight: 1.5,
  },
  acceptBtn: {
    width: "100%",
    background: "#E85D04",
    color: "white",
    border: "none",
    padding: "16px",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    marginBottom: 8,
  },
  btnDisabled: {
    background: "#D4C5B0",
    cursor: "not-allowed",
  },
  rematchBtn: {
    width: "100%",
    background: "transparent",
    color: "#5C4A2A",
    border: "1.5px solid rgba(92,74,42,0.2)",
    padding: "14px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  inviteCard: {
    background: "white",
    borderRadius: 16,
    padding: 24,
    marginBottom: 12,
    border: "1px solid rgba(232,93,4,0.1)",
    textAlign: "center",
  },
  inviteIcon: { fontSize: 40, marginBottom: 12 },
  inviteTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#1A1208",
    marginBottom: 8,
  },
  inviteText: {
    fontSize: 14,
    color: "#5C4A2A",
    lineHeight: 1.6,
    marginBottom: 16,
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 12,
    border: "1.5px solid rgba(232,93,4,0.2)",
    background: "#F5F0E8",
    fontSize: 15,
    color: "#1A1208",
    outline: "none",
    boxSizing: "border-box",
    textAlign: "center",
  },
};
