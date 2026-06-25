import { useState } from "react";

const PLANS = [
  {
    id: "solo",
    label: "Individual",
    name: "Solo plan",
    price: 4,
    sub: "AI coach only, no buddy matching",
    features: [
      "Gemini-powered weekly plan",
      "Dietary habit recommendations",
      "Progress tracking",
      "Gamified city map",
      "BuddyPoints & badges",
    ],
    featured: false,
  },
  {
    id: "buddy",
    label: "Individual",
    name: "Buddy plan",
    price: 6,
    sub: "AI coach + accountability buddy",
    features: [
      "Everything in Solo",
      "Buddy matching by goal and area",
      "Shared missions and achievements",
      "Weekly buddy check-in",
      "Team badges & TeamPoints",
    ],
    featured: true,
  },
  {
    id: "clinic",
    label: "Professional",
    name: "Clinic plan",
    price: 49,
    sub: "Up to 20 patients",
    features: [
      "Everything in Buddy",
      "Patient dashboard for clinicians",
      "Adherence reports per patient",
      "Custom protocol configuration",
      "Priority support",
    ],
    featured: false,
  },
];

export default function Subscription({ onComplete }) {
  const [selected, setSelected] = useState("buddy");
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    setLoading(true);
    // Stripe integration point
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    onComplete({ plan: selected });
  }

  const selectedPlan = PLANS.find((p) => p.id === selected);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Choose your plan</h1>
        <p style={styles.subtitle}>Less than a coffee. Every month.</p>
      </div>

      {/* PLANS */}
      <div style={styles.plansList}>
        {PLANS.map((plan) => (
          <button
            key={plan.id}
            style={{
              ...styles.planCard,
              ...(selected === plan.id ? styles.planCardSelected : {}),
              ...(plan.featured ? styles.planCardFeatured : {}),
            }}
            onClick={() => setSelected(plan.id)}
          >
            {plan.featured && (
              <div style={styles.featuredBadge}>Most popular</div>
            )}
            <div style={styles.planTop}>
              <div>
                <div style={styles.planLabel}>{plan.label}</div>
                <div style={styles.planName}>{plan.name}</div>
              </div>
              <div style={styles.planPriceBlock}>
                <span style={styles.planPrice}>€{plan.price}</span>
                <span style={styles.planPeriod}>/mo</span>
              </div>
            </div>
            <div style={styles.planSub}>{plan.sub}</div>
            <ul style={styles.featureList}>
              {plan.features.map((f) => (
                <li key={f} style={styles.featureItem}>
                  <span style={styles.featureCheck}>✓</span>
                  <span style={styles.featureText}>{f}</span>
                </li>
              ))}
            </ul>
            <div style={styles.selectIndicator}>
              {selected === plan.id ? "✓ Selected" : "Select"}
            </div>
          </button>
        ))}
      </div>

      {/* SUMMARY */}
      <div style={styles.summary}>
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>Selected plan</span>
          <span style={styles.summaryValue}>{selectedPlan?.name}</span>
        </div>
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>Billed monthly</span>
          <span style={styles.summaryValue}>€{selectedPlan?.price}/month</span>
        </div>
        <div style={styles.summaryNote}>
          Cancel anytime. No contracts. No hidden fees.
        </div>
      </div>

      {/* CTA */}
      <button
        style={{
          ...styles.subscribeBtn,
          ...(loading ? styles.subscribeBtnLoading : {}),
        }}
        onClick={handleSubscribe}
        disabled={loading}
      >
        {loading ? "Processing..." : `Start for €${selectedPlan?.price}/month →`}
      </button>

      <p style={styles.legal}>
        By subscribing you agree to our Terms of Service and Privacy Policy.
        BuddyGo is a wellness app, not a medical device.
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 390,
    margin: "0 auto",
    padding: "28px 16px 40px",
    fontFamily: "Inter, system-ui, sans-serif",
    background: "#F5F0E8",
    minHeight: "100vh",
  },
  header: {
    textAlign: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 800,
    color: "#1A1208",
    letterSpacing: "-0.5px",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#5C4A2A",
  },
  plansList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 20,
  },
  planCard: {
    background: "white",
    borderRadius: 16,
    padding: 18,
    border: "1.5px solid rgba(232,93,4,0.12)",
    cursor: "pointer",
    textAlign: "left",
    position: "relative",
    transition: "all 0.15s ease",
  },
  planCardSelected: {
    border: "1.5px solid #E85D04",
    boxShadow: "0 0 0 3px rgba(232,93,4,0.1)",
  },
  planCardFeatured: {
    border: "1.5px solid #E85D04",
  },
  featuredBadge: {
    position: "absolute",
    top: -11,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#E85D04",
    color: "white",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.06em",
    padding: "3px 12px",
    borderRadius: 20,
    whiteSpace: "nowrap",
    textTransform: "uppercase",
  },
  planTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  planLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "#E85D04",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  planName: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1A1208",
  },
  planPriceBlock: {
    textAlign: "right",
  },
  planPrice: {
    fontSize: 28,
    fontWeight: 800,
    color: "#1A1208",
    letterSpacing: "-1px",
  },
  planPeriod: {
    fontSize: 13,
    color: "#9C8B70",
  },
  planSub: {
    fontSize: 12,
    color: "#9C8B70",
    marginBottom: 12,
  },
  featureList: {
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginBottom: 14,
  },
  featureItem: {
    display: "flex",
    gap: 8,
    alignItems: "flex-start",
  },
  featureCheck: {
    color: "#E85D04",
    fontWeight: 700,
    fontSize: 13,
    flexShrink: 0,
    marginTop: 1,
  },
  featureText: {
    fontSize: 13,
    color: "#5C4A2A",
    lineHeight: 1.4,
  },
  selectIndicator: {
    fontSize: 12,
    fontWeight: 700,
    color: "#E85D04",
    textAlign: "right",
  },
  summary: {
    background: "white",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    border: "1px solid rgba(232,93,4,0.1)",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: { fontSize: 13, color: "#9C8B70" },
  summaryValue: { fontSize: 13, fontWeight: 700, color: "#1A1208" },
  summaryNote: {
    fontSize: 11,
    color: "#9C8B70",
    marginTop: 4,
    textAlign: "center",
  },
  subscribeBtn: {
    width: "100%",
    background: "#E85D04",
    color: "white",
    border: "none",
    padding: "16px",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    marginBottom: 12,
  },
  subscribeBtnLoading: {
    background: "#D4C5B0",
    cursor: "not-allowed",
  },
  legal: {
    fontSize: 11,
    color: "#9C8B70",
    textAlign: "center",
    lineHeight: 1.6,
    padding: "0 8px",
  },
};
