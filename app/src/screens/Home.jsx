import { useState } from "react";

export default function Home() {
  const user = {
    name: "Alejandro",
    level: 2,
    levelName: "Walker",
    bp: 240,
    streak: 3,
    weekGoal: 150,
    weekDone: 90,
    buddyName: "Maria",
    buddyDone: true,
    mission: "Explore the riverside zone — walk 30 min along the river this week",
    missionZone: "Riverside",
    daysLeft: 4,
  };

  const progress = Math.round((user.weekDone / user.weekGoal) * 100);

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <div style={styles.greeting}>Good morning, {user.name} 👋</div>
          <div style={styles.level}>
            {user.levelName} · {user.bp} BP
          </div>
        </div>
        <div style={styles.streak}>🔥 {user.streak}w</div>
      </div>

      {/* WEEKLY PROGRESS */}
      <div style={styles.card}>
        <div style={styles.cardLabel}>THIS WEEK</div>
        <div style={styles.progressRow}>
          <span style={styles.progressText}>
            {user.weekDone} / {user.weekGoal} min walked
          </span>
          <span style={styles.progressPct}>{progress}%</span>
        </div>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
        <div style={styles.daysLeft}>{user.daysLeft} days left to check in</div>
      </div>

      {/* BUDDY STATUS */}
      <div style={styles.card}>
        <div style={styles.cardLabel}>YOUR BUDDY</div>
        <div style={styles.buddyRow}>
          <div style={styles.buddyAvatar}>
            {user.buddyName.charAt(0)}
          </div>
          <div>
            <div style={styles.buddyName}>{user.buddyName}</div>
            <div style={user.buddyDone ? styles.buddyDone : styles.buddyPending}>
              {user.buddyDone ? "✓ Completed this week" : "⏳ Waiting for check-in"}
            </div>
          </div>
        </div>
      </div>

      {/* MISSION */}
      <div style={styles.missionCard}>
        <div style={styles.missionLabel}>WEEKLY MISSION</div>
        <div style={styles.missionZone}>📍 {user.missionZone}</div>
        <div style={styles.missionText}>{user.mission}</div>
        <button style={styles.mapBtn}>Open map →</button>
      </div>

      {/* ACTIONS */}
      <button style={styles.checkinBtn}>Weekly check-in</button>
      <button style={styles.walkBtn}>Log a walk</button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 390,
    margin: "0 auto",
    padding: "24px 16px",
    fontFamily: "Inter, system-ui, sans-serif",
    background: "#F5F0E8",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: { fontSize: 20, fontWeight: 700, color: "#1A1208" },
  level: { fontSize: 13, color: "#9C8B70", marginTop: 2 },
  streak: {
    background: "#E85D04",
    color: "white",
    padding: "6px 12px",
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 700,
  },
  card: {
    background: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    border: "1px solid rgba(232,93,4,0.1)",
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "#E85D04",
    marginBottom: 12,
  },
  progressRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressText: { fontSize: 14, color: "#1A1208", fontWeight: 600 },
  progressPct: { fontSize: 14, color: "#E85D04", fontWeight: 700 },
  progressBar: {
    height: 8,
    background: "#F5F0E8",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "#E85D04",
    borderRadius: 4,
    transition: "width 0.6s ease",
  },
  daysLeft: { fontSize: 12, color: "#9C8B70", marginTop: 8 },
  buddyRow: { display: "flex", alignItems: "center", gap: 12 },
  buddyAvatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "#1A3C2B",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    fontWeight: 700,
  },
  buddyName: { fontSize: 15, fontWeight: 600, color: "#1A1208" },
  buddyDone: { fontSize: 12, color: "#2D6A4F", marginTop: 2 },
  buddyPending: { fontSize: 12, color: "#9C8B70", marginTop: 2 },
  missionCard: {
    background: "#1A3C2B",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  missionLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "#FFD166",
    marginBottom: 8,
  },
  missionZone: { fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 6 },
  missionText: { fontSize: 14, color: "white", lineHeight: 1.5, marginBottom: 16 },
  mapBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "white",
    padding: "8px 16px",
    borderRadius: 8,
    fontSize: 13,
    cursor: "pointer",
  },
  checkinBtn: {
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
  walkBtn: {
    width: "100%",
    background: "white",
    color: "#E85D04",
    border: "1px solid rgba(232,93,4,0.3)",
    padding: "16px",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },
};
