# BuddyGo — Walk together. Live better.

> AI health coach with accountability buddy and gamified city map. Built for the **Build with Gemini XPRIZE 2026**.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-buddygo-orange)](https://cutykpo.github.io/gemini-buddygo)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Gemini%202.5%20Pro-blue)](https://deepmind.google/technologies/gemini/)
[![Google Cloud](https://img.shields.io/badge/Google%20Cloud-Firebase%20%2B%20Maps-yellow)](https://cloud.google.com)

---

## The problem

Metabolic diseases — type 2 diabetes, hypertension, obesity, dyslipidemia — are managed with prescriptions. The prescription is the easy part. The hard part is what happens after the patient leaves the clinic: the daily walk, the dietary habit, the discipline. No prescription covers that. No healthcare system offers meaningful support there.

Dr. Alejandro Reibaldi, specialist in Internal Medicine and Rheumatology, Emergency physician in Friuli Venezia Giulia (Italy), built BuddyGo after years of watching patients fail not at treatment compliance but at behavioral change — the part that determines long-term outcomes.

---

## What BuddyGo does

BuddyGo is an AI-powered wellness coach that pairs users with an accountability buddy and gamifies their neighborhood map to drive consistent physical activity and habit formation.

**Three layers working together:**

1. **AI-personalized weekly plan** — Gemini generates a weekly walking target and dietary habit based on the user's age, BMI, and health goal. Every Sunday, Gemini reads the check-in, adjusts next week's targets, and sends personalized feedback.

2. **Accountability buddy** — Gemini matches users with one person nearby who shares their goal and age range. Buddy status is visible: whether they completed their week. That quiet accountability is clinically proven to sustain behavior change.

3. **Gamified city map** — Neighborhood zones unlock as users walk. Each week Gemini assigns a mission tied to a specific area of the map. Completing missions earns BuddyPoints, unlocks badges, and builds team achievements with the buddy.

---

## Why it works clinically

The system rewards process, not outcomes. Users earn points for completing the check-in, finishing the weekly mission, and exploring new zones — not for losing weight. This is intentional: rewarding outcomes in metabolic disease generates anxiety and abandonment. Rewarding behavior generates habit.

The adherence threshold where clinical habit formation is considered established is 8 consecutive weeks of sustained behavior. BuddyGo's level system is designed around that milestone.

---

## How Gemini runs the business

Every decision between a user signing up and receiving their weekly report is made by the Gemini agent. No human operator touches any workflow.

| Trigger | Agent action |
|---|---|
| On sign-up | Generates personalized weekly plan from anthropometric profile |
| On matching | Selects compatible buddy by goal, age, and city. Sends invite. |
| Every Monday | Generates a gamified mission linked to an unexplored map zone |
| Every Sunday | Reads check-ins, adjusts targets, sends personalized feedback |
| Low adherence (3 weeks) | Reduces target, generates shorter mission, sends re-engagement message |
| High adherence (4+ weeks) | Increases target 10-15%, generates more ambitious mission |
| Buddy inactive 2 weeks | Sends individual mission to active buddy to maintain engagement |

---

## Tech stack

| Layer | Technology |
|---|---|
| AI agent | Gemini 2.5 Pro via Google AI Studio |
| Backend | Firebase (Firestore + Cloud Functions + Auth) |
| Maps | Google Maps API with hexagonal zone overlay |
| Frontend | React PWA (Progressive Web App) |
| Hosting | Firebase Hosting + GitHub Pages (landing) |
| Payments | Stripe |

**Google Cloud products used:** Firebase Firestore, Firebase Auth, Firebase Cloud Functions, Firebase Hosting, Google Maps API, Gemini API via AI Studio.

---

## Pricing

| Plan | Price | For |
|---|---|---|
| Solo | €4/month | AI coach only, no buddy matching |
| Buddy | €6/month | AI coach + accountability buddy + shared missions |
| Clinic | €49/month | Up to 20 patients, clinician dashboard (v2) |

---

## Points and gamification system

### BuddyPoints (individual)

| Action | Points |
|---|---|
| Weekly check-in on time | +20 BP |
| Weekly goal 100% complete | +30 BP |
| Weekly goal 75-99% complete | +15 BP |
| New zone unlocked | +25 BP |
| Weekly mission complete | +50 BP |
| 2-week streak bonus | +20 BP |
| 4-week streak bonus | +50 BP |
| 8-week streak bonus | +100 BP |
| Buddy completes their check-in | +10 BP |
| No report in 48h | -10 BP |

### User levels

| Level | BP required | Name |
|---|---|---|
| 1 | 0 | First step 🌱 |
| 2 | 200 | Walker 🚶 |
| 3 | 500 | Explorer 🗺️ |
| 4 | 1,000 | Pathfinder 🧭 |
| 5 | 2,000 | Trailblazer ⛰️ |
| 6 | 4,000 | Consistent 🔥 |
| 7 | 8,000 | Habit master 🏆 |

8,000 BP = approximately 6 months of sustained adherence = clinically established habit.

---

## Project structure

```
buddygo/
├── index.html                  # Landing page (GitHub Pages)
├── app/                        # React PWA
│   ├── src/
│   │   ├── screens/            # Onboarding, Home, Check-in, Map, Profile
│   │   ├── components/         # Reusable UI components
│   │   ├── services/           # Gemini API, Maps API, Firebase
│   │   └── store/              # App state
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── backend/                    # Firebase Cloud Functions
│   ├── functions/
│   │   ├── gemini-agent.js     # Weekly plan generation, check-in analysis
│   │   ├── buddy-matching.js   # Compatibility algorithm
│   │   ├── mission-engine.js   # Monday mission generation
│   │   └── points-engine.js    # BP/TP calculation and badge logic
│   └── firestore.rules
└── docs/
    ├── architecture.md         # System design and data flows
    ├── agent-flows.md          # Gemini agent trigger documentation
    └── data-schema.md          # Firestore collections and types
```

---

## Screens (MVP)

1. Splash / welcome
2. Basic profile (name, age, city)
3. Clinical profile (condition, weight, height)
4. Personal goal selection
5. Gemini plan generation
6. Buddy matching (auto or invite)
7. Subscription
8. Weekly home (mission, progress, buddy status, points)
9. Weekly check-in flow
10. Check-in result + next week preview
11. City map with zone overlay
12. Personal profile + badges + history
13. Buddy profile

---

## Team

**Dr. Alejandro Reibaldi** — Founder & CEO, VitalMinds SRL
Specialist in Internal Medicine and Rheumatology. Emergency physician, Friuli Venezia Giulia, Italy. Clinical design, product strategy, AI agent logic.

**Facundo** — Lead Developer
Architecture, Firebase backend, Gemini API integration, React PWA.

---

## XPRIZE submission

- **Hackathon:** Build with Gemini XPRIZE 2026
- **Category:** Education & Human Potential
- **Submission period:** May 19 – August 17, 2026
- **Live demo:** [cutykpo.github.io/gemini-buddygo](https://cutykpo.github.io/gemini-buddygo)

---

## Local development

```bash
# Clone the repo
git clone https://github.com/cutykpo/gemini-buddygo.git
cd gemini-buddygo

# Install app dependencies
cd app
npm install
npm run dev

# Install backend dependencies
cd ../backend/functions
npm install
firebase emulators:start
```

**Environment variables required:**

```
VITE_GEMINI_API_KEY=
VITE_FIREBASE_API_KEY=
VITE_GOOGLE_MAPS_API_KEY=
VITE_STRIPE_PUBLIC_KEY=
```

---

*Built with Gemini 2.5 Pro · Google Cloud · Firebase · Maps API*
*VitalMinds SRL · Friuli Venezia Giulia, Italy · 2026*
