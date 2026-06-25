import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import SafetyCheck from "./screens/SafetyCheck";
import Onboarding from "./screens/Onboarding";
import PlanGeneration from "./screens/PlanGeneration";
import BuddyMatching from "./screens/BuddyMatching";
import Home from "./screens/Home";

function App() {
  const [screen, setScreen] = useState("safety");
  const [safetyData, setSafetyData] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [plan, setPlan] = useState(null);

  return (
    <div>
      {screen === "safety" && (
        <SafetyCheck
          onComplete={(data) => {
            setSafetyData(data);
            setScreen("onboarding");
          }}
        />
      )}

      {screen === "onboarding" && (
        <Onboarding
          safetyData={safetyData}
          onComplete={(data) => {
            setUserProfile(data);
            setScreen("plan");
          }}
        />
      )}

      {screen === "plan" && (
        <PlanGeneration
          userProfile={userProfile}
          onComplete={(generatedPlan) => {
            setPlan(generatedPlan);
            setScreen("buddy");
          }}
        />
      )}

      {screen === "buddy" && (
        <BuddyMatching
          userProfile={userProfile}
          onComplete={() => setScreen("home")}
        />
      )}

      {screen === "home" && (
        <Home />
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
