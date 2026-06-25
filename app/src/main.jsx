import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import SafetyCheck from "./screens/SafetyCheck";
import Onboarding from "./screens/Onboarding";
import PlanGeneration from "./screens/PlanGeneration";
import BuddyMatching from "./screens/BuddyMatching";
import Subscription from "./screens/Subscription";
import Home from "./screens/Home";
import Checkin from "./screens/Checkin";
import Map from "./screens/Map";
import Profile from "./screens/Profile";

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
          onComplete={() => setScreen("subscription")}
        />
      )}

      {screen === "subscription" && (
        <Subscription
          onComplete={() => setScreen("home")}
        />
      )}

      {screen === "home" && (
        <Home
          onCheckin={() => setScreen("checkin")}
          onMap={() => setScreen("map")}
          onProfile={() => setScreen("profile")}
        />
      )}

      {screen === "checkin" && (
        <Checkin
          userPlan={plan}
          userProfile={userProfile}
          onComplete={() => setScreen("home")}
        />
      )}

      {screen === "map" && (
        <Map
          userPlan={plan}
          onBack={() => setScreen("home")}
        />
      )}

      {screen === "profile" && (
        <Profile
          userProfile={userProfile}
          onBack={() => setScreen("home")}
        />
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
