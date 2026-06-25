const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`;

async function callGemini(prompt) {
  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

// ─────────────────────────────────────────────
// 1. PLAN SEMANAL PERSONALIZADO
// Traduce motivaciones personales en objetivos
// accionables sin mencionar patologías
// ─────────────────────────────────────────────
export async function generateWeeklyPlan(userProfile) {
  const prompt = `
You are BuddyGo's wellness AI coach. Generate a personalized weekly plan.
Never mention diseases, diagnoses, or medical conditions.
Speak in terms of energy, movement, habits, and personal goals.

User profile:
- Age: ${userProfile.age}
- How they feel today: "${userProfile.feelingToday}"
- Main goal: "${userProfile.mainGoal}"
- Current physical activity: "${userProfile.currentActivity}"
- Has cardiac condition: ${userProfile.hasCardiacCondition}
- Has physical limitation: ${userProfile.hasPhysicalLimitation}
- Doctor consulted: ${userProfile.doctorConsulted}
- Current streak: ${userProfile.streak} weeks

Rules:
- If hasCardiacCondition or hasPhysicalLimitation is true, keep walking target under 20 min/day and intensity low
- If streak is 0, start very easy to build confidence
- Always frame goals around how they will FEEL, not medical outcomes

Respond ONLY in JSON, no markdown, no explanation:
{
  "walkingMinutesPerWeek": number,
  "dailyWalkingSessions": number,
  "dietaryHabit": string,
  "missionTitle": string,
  "missionDescription": string,
  "missionZone": string,
  "coachMessage": string,
  "difficultyLevel": "easy" | "moderate" | "challenging"
}
`;
  const raw = await callGemini(prompt);
  return JSON.parse(raw.replace(/```json|```/g, "").trim());
}

// ─────────────────────────────────────────────
// 2. ANÁLISIS DE CHECK-IN SEMANAL
// Lee el reporte, ajusta el plan siguiente,
// detecta tono emocional del texto libre
// ─────────────────────────────────────────────
export async function analyzeCheckin(checkinData) {
  const prompt = `
You are BuddyGo's wellness AI coach. Analyze this weekly check-in.
Never mention diseases or diagnoses. Focus on behavior, habits, and motivation.

Check-in data:
- Minutes walked: ${checkinData.minutesWalked} of ${checkinData.minutesGoal} goal
- Dietary habit followed: ${checkinData.dietFollowed}
- Mission completed: ${checkinData.missionCompleted}
- Free text from user: "${checkinData.freeText}"
- Current streak: ${checkinData.streak} weeks
- Buddy completed their week: ${checkinData.buddyCompleted}
- Has cardiac condition: ${checkinData.hasCardiacCondition}
- Has physical limitation: ${checkinData.hasPhysicalLimitation}

Analyze the free text for emotional tone.
Adjust next week target: increase 10% if goal met, decrease 15% if under 60%, keep same if 60-99%.

Respond ONLY in JSON, no markdown:
{
  "pointsEarned": number,
  "emotionalTone": "positive" | "neutral" | "discouraged" | "distressed",
  "feedbackMessage": string,
  "nextWalkingMinutes": number,
  "nextDietaryHabit": string,
  "nextMissionTitle": string,
  "nextMissionDescription": string,
  "nextMissionZone": string,
  "badgeUnlocked": string | null,
  "abandonmentRisk": "none" | "low" | "medium" | "high"
}
`;
  const raw = await callGemini(prompt);
  return JSON.parse(raw.replace(/```json|```/g, "").trim());
}

// ─────────────────────────────────────────────
// 3. MATCHING DE BUDDIES
// Compatibilidad por objetivo, edad y zona
// ─────────────────────────────────────────────
export async function generateBuddyMatch(userProfile, candidates) {
  const prompt = `
You are BuddyGo's matching algorithm.
Select the best accountability buddy for long-term adherence.

User:
- Age: ${userProfile.age}
- Goal: "${userProfile.mainGoal}"
- City zone: "${userProfile.zone}"
- Feeling today: "${userProfile.feelingToday}"

Candidates: ${JSON.stringify(candidates)}

Prioritize: similar age range (within 10 years), same goal category, nearby zone.
Avoid matching people with very different activity levels.

Respond ONLY in JSON, no markdown:
{
  "matchedUserId": string,
  "compatibilityScore": number,
  "matchReason": string
}
`;
  const raw = await callGemini(prompt);
  return JSON.parse(raw.replace(/```json|```/g, "").trim());
}

// ─────────────────────────────────────────────
// 4. DETECCIÓN DE RIESGO DE ABANDONO
// Lee patrones de las últimas 3 semanas
// Asigna nivel 1, 2 o 3
// ─────────────────────────────────────────────
export async function detectAbandonmentRisk(userHistory) {
  const prompt = `
You are BuddyGo's behavioral analytics engine.
Analyze the last 3 weeks of user data and detect abandonment risk.

User history (last 3 weeks):
${JSON.stringify(userHistory, null, 2)}

Risk signals to evaluate:
- Missed 2+ check-ins in a row → high risk
- Walking minutes dropped more than 40% → medium risk
- Diet broken 2+ days in a row → medium risk
- Buddy not responded to in 5+ days → medium risk
- Emotional tone deteriorating week over week → high risk
- Free text contains discouraging words → escalate risk level

Risk levels:
- Level 1 (low): one signal, recent, isolated
- Level 2 (medium): two signals or one sustained over 2 weeks
- Level 3 (high): three or more signals, or silence + negative tone

Respond ONLY in JSON, no markdown:
{
  "riskLevel": 0 | 1 | 2 | 3,
  "signals": string[],
  "primarySignal": string,
  "weeksSinceLastCheckin": number,
  "recommendedAction": "none" | "gentle_nudge" | "impact_message" | "wellness_ping"
}
`;
  const raw = await callGemini(prompt);
  return JSON.parse(raw.replace(/```json|```/g, "").trim());
}

// ─────────────────────────────────────────────
// 5. MENSAJE DE INTERVENCIÓN CALIBRADO
// Nivel 1: cálido, enfocado en progreso
// Nivel 2: impacto familiar en positivo
// Nivel 3: sin presión, reconexión suave
// ─────────────────────────────────────────────
export async function generateInterventionMessage(riskData, userProfile) {
  const prompt = `
You are BuddyGo's wellness coach. Generate a re-engagement message.
Never mention diseases, diagnoses, or medical risks directly.
Never be aggressive or guilt-inducing.

User:
- Name: ${userProfile.name}
- Goal: "${userProfile.mainGoal}"
- Streak before drop: ${userProfile.previousStreak} weeks
- Risk level: ${riskData.riskLevel}
- Primary signal: "${riskData.primarySignal}"

Message guidelines by risk level:
- Level 1: warm, focused on what they already achieved. Short. No pressure.
- Level 2: connect to family and loved ones in a POSITIVE frame.
  Example tone: "Every step you take today is time you gain with the people who love you."
  Never use fear. Use love and future vision.
- Level 3: zero pressure. Just check in as a friend.
  Example tone: "Hey, we just wanted to know you're ok. No goals today, just checking in."

Respond ONLY in JSON, no markdown:
{
  "messageTitle": string,
  "messageBody": string,
  "callToAction": string,
  "tone": "warm" | "motivational" | "friendly",
  "includeBuddyActivation": boolean
}
`;
  const raw = await callGemini(prompt);
  return JSON.parse(raw.replace(/```json|```/g, "").trim());
}

// ─────────────────────────────────────────────
// 6. WELLNESS PING
// 72h sin respuesta: confirma bienestar
// Activa al buddy si el silencio continúa
// ─────────────────────────────────────────────
export async function generateWellnessPing(userProfile, buddyProfile, silenceHours) {
  const prompt = `
You are BuddyGo's care system. A user has been silent for ${silenceHours} hours.
Generate appropriate outreach messages. This is NOT about goals or performance.
This is about making sure the person is ok.

Silent user: ${userProfile.name}, last active ${silenceHours} hours ago.
Their buddy: ${buddyProfile.name}.

Rules:
- If silenceHours < 96: message to silent user only, very light tone
- If silenceHours >= 96: message to silent user + activation message for buddy
- Never mention failure, missed goals, or performance
- The buddy message should feel like a friend reaching out, not a system alert

Respond ONLY in JSON, no markdown:
{
  "userMessage": {
    "title": string,
    "body": string
  },
  "buddyMessage": {
    "title": string,
    "body": string,
    "shouldSend": boolean
  },
  "escalationRequired": boolean
}
`;
  const raw = await callGemini(prompt);
  return JSON.parse(raw.replace(/```json|```/g, "").trim());
}
