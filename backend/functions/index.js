const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// ─────────────────────────────────────────────
// TRIGGER: nuevo usuario registrado
// Crea el documento base en Firestore
// ─────────────────────────────────────────────
exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
  await db.collection("users").doc(user.uid).set({
    uid: user.uid,
    email: user.email,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    totalBP: 0,
    currentLevel: 1,
    currentStreak: 0,
    longestStreak: 0,
    zonesUnlocked: 0,
    missionsCompleted: 0,
    weekActive: 0,
    plan: null,
    buddyId: null,
    teamId: null,
  });

  console.log(`New user created: ${user.uid}`);
});

// ─────────────────────────────────────────────
// TRIGGER: check-in semanal procesado
// Calcula puntos, actualiza streak, verifica badges
// ─────────────────────────────────────────────
exports.processCheckin = functions.firestore
  .document("checkins/{checkinId}")
  .onCreate(async (snap, context) => {
    const checkin = snap.data();
    const userId = checkin.userId;

    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    const user = userDoc.data();

    let pointsEarned = 0;

    // Puntos por check-in a tiempo
    pointsEarned += 20;

    // Puntos por objetivo cumplido
    const completion = checkin.minutesWalked / checkin.minutesGoal;
    if (completion >= 1) pointsEarned += 30;
    else if (completion >= 0.75) pointsEarned += 15;

    // Puntos por misión completada
    if (checkin.missionCompleted) pointsEarned += 50;

    // Actualiza streak
    const newStreak = user.currentStreak + 1;
    const longestStreak = Math.max(newStreak, user.longestStreak);

    // Bonus por racha
    if (newStreak === 2) pointsEarned += 20;
    if (newStreak === 4) pointsEarned += 50;
    if (newStreak === 8) pointsEarned += 100;

    const newTotalBP = user.totalBP + pointsEarned;
    const newLevel = calculateLevel(newTotalBP);

    // Actualiza usuario
    await userRef.update({
      totalBP: newTotalBP,
      currentLevel: newLevel,
      currentStreak: newStreak,
      longestStreak,
      missionsCompleted: checkin.missionCompleted
        ? user.missionsCompleted + 1
        : user.missionsCompleted,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Log de puntos
    await db.collection("points_log").add({
      userId,
      delta: pointsEarned,
      action: "checkin",
      weekStart: checkin.weekStart,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Verifica badges
    await checkAndUnlockBadges(userId, newStreak, newTotalBP, user);

    console.log(`Checkin processed for ${userId}: +${pointsEarned} BP`);
  });

// ─────────────────────────────────────────────
// SCHEDULED: cada lunes a las 8am
// Genera misión semanal para todos los usuarios activos
// ─────────────────────────────────────────────
exports.generateWeeklyMissions = functions.pubsub
  .schedule("every monday 08:00")
  .timeZone("Europe/Rome")
  .onRun(async () => {
    const usersSnap = await db
      .collection("users")
      .where("plan", "!=", null)
      .get();

    const batch = db.batch();

    usersSnap.forEach((doc) => {
      const missionRef = db
        .collection("missions")
        .doc(`${doc.id}_${getWeekStart()}`);
      batch.set(missionRef, {
        userId: doc.id,
        weekStart: getWeekStart(),
        status: "active",
        generatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();
    console.log(`Weekly missions generated for ${usersSnap.size} users`);
  });

// ─────────────────────────────────────────────
// SCHEDULED: cada domingo a las 9am
// Detecta usuarios sin check-in y evalúa riesgo
// ─────────────────────────────────────────────
exports.detectAbandonmentRisk = functions.pubsub
  .schedule("every sunday 09:00")
  .timeZone("Europe/Rome")
  .onRun(async () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const usersSnap = await db
      .collection("users")
      .where("plan", "!=", null)
      .get();

    for (const doc of usersSnap.docs) {
      const user = doc.data();
      const lastCheckin = await db
        .collection("checkins")
        .where("userId", "==", doc.id)
        .orderBy("createdAt", "desc")
        .limit(1)
        .get();

      if (lastCheckin.empty) continue;

      const lastDate = lastCheckin.docs[0].data().createdAt.toDate();
      const daysSince = Math.floor((Date.now() - lastDate) / 86400000);

      let riskLevel = 0;
      if (daysSince > 14) riskLevel = 3;
      else if (daysSince > 7) riskLevel = 2;
      else if (user.currentStreak === 0) riskLevel = 1;

      if (riskLevel > 0) {
        await db.collection("interventions").add({
          userId: doc.id,
          riskLevel,
          daysSinceLastCheckin: daysSince,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          status: "pending",
        });
      }
    }

    console.log("Abandonment risk detection complete");
  });

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function calculateLevel(totalBP) {
  if (totalBP >= 8000) return 7;
  if (totalBP >= 4000) return 6;
  if (totalBP >= 2000) return 5;
  if (totalBP >= 1000) return 4;
  if (totalBP >= 500) return 3;
  if (totalBP >= 200) return 2;
  return 1;
}

function getWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split("T")[0];
}

async function checkAndUnlockBadges(userId, streak, totalBP, user) {
  const badgesRef = db.collection("badges");

  if (streak === 1) {
    await badgesRef.add({
      userId,
      badgeKey: "week_one",
      unlockedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  if (streak === 4) {
    await badgesRef.add({
      userId,
      badgeKey: "steady",
      unlockedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  if (streak === 8) {
    await badgesRef.add({
      userId,
      badgeKey: "habit_formed",
      unlockedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
}
