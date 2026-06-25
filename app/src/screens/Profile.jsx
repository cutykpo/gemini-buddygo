import { useState } from "react";

const BADGES = [
  { key: "first_walk", emoji: "👟", name: "First Walk", description: "Completed your first walking session", unlocked: true },
  { key: "week_one", emoji: "⭐", name: "Week One", description: "Completed your first full week", unlocked: true },
  { key: "steady", emoji: "🔥", name: "Steady", description: "4 consecutive weeks without breaking streak", unlocked: false },
  { key: "habit_formed", emoji: "🏆", name: "Habit Formed", description: "8 consecutive weeks — clinical habit established", unlocked: false },
  { key: "zone_hunter", emoji: "🗺️", name: "Zone Hunter", description: "10 zones unlocked", unlocked: false },
  { key: "city_explorer", emoji: "🌆", name: "City Explorer", description: "25 zones unlocked", unlocked: false },
  { key: "perfect_week", emoji: "💎", name: "Perfect Week", description: "100% completion in one week", unlocked: true },
  { key: "comeback", emoji: "💪", name: "Comeback", description: "Checked in after missing 2 weeks", unlocked: false },
  { key: "early_bird", emoji: "🌅", name: "Early Bird", description: "Checked in before Tuesday 4 weeks in a row", unlocked: false },
  { key: "diet_streak", emoji: "🥗", name: "Diet Streak", description: "3 weeks reporting dietary habit", unlocked: false },
];

const TEAM_BADGES = [
  { key: "duo", emoji: "👥", name: "Duo", description: "First week completed as a team", unlocked: true },
  { key: "in_sync", emoji: "🔗", name: "In Sync", description: "Both walked in the same zone same day", unlocked: false },
  { key: "perfect_duo", emoji: "🌟", name: "Perfect Duo", description: "4 perfect weeks as a team", unlocked: false },
  { key: "unbreakable", emoji: "⚡", name: "Unbreakable", description: "8 weeks without either buddy failing", unlocked: false },
];

const LEVELS = [
  { level: 1, name: "First step", emoji: "🌱", bp: 0 },
  { level: 2, name: "Walker", emoji: "🚶", bp: 200 },
  { level: 3, name: "Explorer", emoji: "🗺️", bp: 500 },
  { level: 4, name: "Pathfinder", emoji: "🧭", bp: 1000 },
  { level: 5, name: "Trailblazer", emoji: "⛰️", bp: 2000 },
  { level: 6, name: "Consistent", emoji: "🔥", bp: 4000 },
  { level: 7, name: "Habit master", emoji: "🏆", bp: 8000 },
];

export default function Profile({ userProfile }) {
  const [tab, setTab] = useState("stats");

  const user = {
    name: userProfile?.name || "Alejandro",
    totalBP: 240,
    currentLevel: 2,
    currentStreak: 3,
    longestStreak: 3,
    zonesUnlocked: 2,
    missionsCompleted: 1,
    weeksActive: 2,
    teamTP: 120,
  };

  const currentLevel = LEVELS[user.currentLevel - 1];
  const nextLevel = LEVELS[user.currentLevel] || null;
  const progressToNext = nextLevel
    ? Math.round(((user.totalBP - currentLevel.bp) / (nextLevel.bp - currentLevel.bp)) * 100)
    : 100;

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.avatar}>
          {user.name.charAt(0)}
        </div>
        <div style={styles.userInfo}>
          <div style={styles.userName}>{user.name}</div>
          <div style={styles.userLevel}>
            {currentLevel.emoji} {currentLevel.name}
          </div>
        </div>
        <div style={styles.bpBadge}>
          <div style={styles.bpValue}>{user.totalBP}</div>
          <div style={styles.bpLabel}>BP</div>
        </div>
      </div>

      {/* LEVEL PROGRESS */}
      <div style={styles.levelCard}>
        <div style={styles.levelRow}>
          <span style={styles.levelCurrent}>
            Level {user.currentLevel} — {currentLevel.name}
          </span>
          {nextLevel && (
            <span style={styles.levelNext}>
              Next: {nextLevel.name} ({nextLevel.bp} BP)
            </span>
          )}
        </div>
        <div style={styles.levelBar}>
          <div style={{ ...styles.levelFill, width: `${progressToNext}%` }} />
        </div>
        <div style={styles.levelSub}>
          {nextLevel
            ? `${nextLevel.bp - user.totalBP} BP to next level`
            : "Maximum level reached 🏆"}
        </div>
      </div>

      {/* TABS */}
      <div style={styles.tabs}>
        {["stats", "badges", "team"].map((t) => (
          <button
            key={t}
            style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }}
            onClick={() => setTab(t)}
          >
            {t === "stats" ? "Stats" : t === "badges" ? "Badges" : "Team"}
          </button>
        ))}
      </div>

      {/* STATS TAB */}
      {tab === "stats" && (
        <div style={styles.tabContent}>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{user.currentStreak}w</div>
              <div style={styles.statLabel}>Current streak</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{user.longestStreak}w</div>
              <div style={styles.statLabel}>Longest streak</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{user.zonesUnlocked}</div>
              <div style={styles.statLabel}>Zones unlocked</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{user.missionsCompleted}</div>
              <div style={styles.statLabel}>Missions done</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{user.weeksActive}w</div>
              <div style={styles.statLabel}>Weeks active</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{user.teamTP}</div>
              <div style={styles.statLabel}>Team points</div>
            </div>
          </div>

          <div style={styles.clinicalNote}>
            🩺 Clinical habit formation requires 8 consecutive weeks.
            You're on week {user.weeksActive}. Keep going.
          </div>
        </div>
      )}

      {/* BADGES TAB */}
      {tab === "badges" && (
        <div style={styles.tabContent}>
          <div style={styles.badgesSection}>
            <div style={styles.badgesSectionTitle}>Individual badges</div>
            <div style={styles.badgesGrid}>
              {BADGES.map((badge) => (
                <div
                  key={badge.key}
                  style={{
                    ...styles.badgeCard,
                    ...(!badge.unlocked ? styles.badgeLocked : {}),
                  }}
                  title={badge.description}
                >
                  <div style={styles.badgeEmoji}>{badge.emoji}</div>
                  <div style={styles.badgeName}>{badge.name}</div>
                  {!badge.unlocked && <div style={styles.badgeLockIcon}>🔒</div>}
                </div>
              ))}
            </div>
          </div>

          <div style={styles.badgesSection}>
            <div style={styles.badgesSectionTitle}>Team badges</div>
            <div style={styles.badgesGrid}>
              {TEAM_BADGES.map((badge) => (
                <div
                  key={badge.key}
                  style={{
                    ...styles.badgeCard,
                    ...(!badge.unlocked ? styles.badgeLocked : {}),
                  }}
                  title={badge.description}
                >
                  <div style={styles.badgeEmoji}>{badge.emoji}</div>
                  <div style={styles.badgeName}>{badge.name}</div>
                  {!badge.unlocked && <div style={styles.badgeLockIcon}>🔒</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TEAM TAB */}
      {tab === "team" && (
        <div style={styles.tabContent}>
          <div style={styles.teamCard}>
            <div style={styles.teamHeader}>
              <div style={styles.teamAvatars}>
                <div style={{ ...styles.teamAvatar, background: "#E85D04" }}>
                  {user.name.charAt(0)}
                </div>
                <div style={{ ...styles.teamAvatar, background: "#1A3C2B", marginLeft: -12 }}>
                  M
                </div>
              </div>
              <div>
                <div style={styles.teamName}>You + Maria</div>
                <div style={styles.teamSince}>Together since week 1</div>
              </div>
            </div>

            <div style={styles.teamStats}>
              <div style={styles.teamStat}>
                <div style={styles.teamStatValue}>{user.teamTP}</div>
                <div style={styles.teamStatLabel}>Team Points</div>
              </div>
              <div style={styles.teamStat}>
                <div style={styles.teamStatValue}>2</div>
                <div style={styles.teamStatLabel}>Perfect weeks</div>
              </div>
              <div style={styles.teamStat}>
                <div style={styles.teamStatValue}>1</div>
                <div style={styles.teamStatLabel}>Shared zones</div>
              </div>
            </div>
          </div>

          <div style={styles.teamBadgesUnlocked}>
            <div style={styles.badgesSectionTitle}>Unlocked together</div>
            {TEAM_BADGES.filter((b) => b.unlocked).map((badge) => (
              <div key={badge.key} style={styles.teamBadgeRow}>
                <span style={styles.teamBadgeEmoji}>{badge.emoji}</span>
                <div>
                  <div style={styles.teamBadgeName}>{badge.name}</div>
                  <div style={styles.teamBadgeDesc}>{badge.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 390,
    margin: "0 auto",
    fontFamily: "Inter, system-ui, sans-serif",
    background: "#F5F0E8",
    minHeight: "100vh",
    paddingBottom: 32,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "28px 20px 16px",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "#E85D04",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    fontWeight: 800,
    flexShrink: 0,
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 20, fontWeight: 800, color: "#1A1208", letterSpacing: "-0.3px" },
  userLevel: { fontSize: 14, color: "#5C4A2A", marginTop: 2 },
  bpBadge: {
    background: "#E85D04",
    borderRadius: 12,
    padding: "8px 14px",
    textAlign: "center",
    flexShrink: 0,
  },
  bpValue: { fontSize: 20, fontWeight: 800, color: "white", letterSpacing: "-0.5px" },
  bpLabel: { fontSize: 10, color: "rgba(255,255,255,0.8)", fontWeight: 700, letterSpacing: "0.06em" },
  levelCard: {
    margin: "0 16px 16px",
    background: "white",
    borderRadius: 16,
    padding: 16,
    border: "1px solid rgba(232,93,4,0.1)",
  },
  levelRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  levelCurrent: { fontSize: 13, fontWeight: 700, color: "#1A1208" },
  levelNext: { fontSize: 12, color: "#9C8B70" },
  levelBar: {
    height: 8,
    background: "#F5F0E8",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 6,
  },
  levelFill: {
    height: "100%",
    background: "#E85D04",
    borderRadius: 4,
    transition: "width 0.5s ease",
  },
  levelSub: { fontSize: 12, color: "#9C8B70" },
  tabs: {
    display: "flex",
    margin: "0 16px 16px",
    background: "white",
    borderRadius: 12,
    padding: 4,
    border: "1px solid rgba(232,93,4,0.1)",
  },
  tab: {
    flex: 1,
    padding: "10px",
    borderRadius: 10,
    border: "none",
    background: "transparent",
    fontSize: 13,
    fontWeight: 600,
    color: "#9C8B70",
    cursor: "pointer",
  },
  tabActive: {
    background: "#E85D04",
    color: "white",
  },
  tabContent: { padding: "0 16px" },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    background: "white",
    borderRadius: 12,
    padding: "14px 10px",
    textAlign: "center",
    border: "1px solid rgba(232,93,4,0.08)",
  },
  statValue: { fontSize: 22, fontWeight: 800, color: "#E85D04", letterSpacing: "-0.5px" },
  statLabel: { fontSize: 11, color: "#9C8B70", marginTop: 2, lineHeight: 1.3 },
  clinicalNote: {
    background: "rgba(45,106,79,0.08)",
    borderRadius: 12,
    padding: "12px 14px",
    fontSize: 13,
    color: "#2D6A4F",
    lineHeight: 1.5,
  },
  badgesSection: { marginBottom: 24 },
  badgesSectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#9C8B70",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  badgesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 10,
  },
  badgeCard: {
    background: "white",
    borderRadius: 12,
    padding: "12px 6px",
    textAlign: "center",
    border: "1px solid rgba(232,93,4,0.1)",
    position: "relative",
  },
  badgeLocked: {
    opacity: 0.4,
    filter: "grayscale(1)",
  },
  badgeEmoji: { fontSize: 24, marginBottom: 4 },
  badgeName: { fontSize: 10, fontWeight: 600, color: "#1A1208", lineHeight: 1.2 },
  badgeLockIcon: {
    position: "absolute",
    top: 4,
    right: 4,
    fontSize: 10,
  },
  teamCard: {
    background: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    border: "1px solid rgba(232,93,4,0.1)",
  },
  teamHeader: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  teamAvatars: { display: "flex", flexShrink: 0 },
  teamAvatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    fontWeight: 700,
    border: "2px solid white",
  },
  teamName: { fontSize: 16, fontWeight: 700, color: "#1A1208" },
  teamSince: { fontSize: 12, color: "#9C8B70", marginTop: 2 },
  teamStats: {
    display: "flex",
    justifyContent: "space-around",
    paddingTop: 16,
    borderTop: "1px solid rgba(232,93,4,0.08)",
  },
  teamStat: { textAlign: "center" },
  teamStatValue: { fontSize: 20, fontWeight: 800, color: "#E85D04" },
  teamStatLabel: { fontSize: 11, color: "#9C8B70", marginTop: 2 },
  teamBadgesUnlocked: { marginTop: 8 },
  teamBadgeRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "white",
    borderRadius: 12,
    padding: "12px 14px",
    marginBottom: 8,
    border: "1px solid rgba(232,93,4,0.08)",
  },
  teamBadgeEmoji: { fontSize: 24, flexShrink: 0 },
  teamBadgeName: { fontSize: 14, fontWeight: 700, color: "#1A1208" },
  teamBadgeDesc: { fontSize: 12, color: "#9C8B70", marginTop: 2 },
};
