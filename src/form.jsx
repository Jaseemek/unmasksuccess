import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/* ============== Router query helper ============== */
function useQueryMode(defaultMode = "chooser") {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const mode = params.get("mode") || defaultMode;
  const setMode = (m, replace = true) => {
    const next = new URLSearchParams(location.search);
    next.set("mode", m);
    navigate({ pathname: location.pathname, search: next.toString() }, { replace });
  };
  return [mode, setMode];
}

/* ============== UI Primitives ============== */
const Field = ({ label, children, required }) => (
  <label style={{ display: "grid", gap: 8 }}>
    <span style={{ fontWeight: 700 }}>
      {label} {required ? <span style={{ color: "#ef9a9a" }}>*</span> : null}
    </span>
    {children}
  </label>
);

const Input = ({ name, type = "text", placeholder, required = true }) => (
  <input
    className="input mobile-input"
    name={name}
    type={type}
    placeholder={placeholder}
    required={required}
    style={{ width: "100%" }}
  />
);

const Textarea = ({ name, placeholder, required = true, rows = 4 }) => (
  <textarea
    className="textarea mobile-textarea"
    name={name}
    placeholder={placeholder}
    required={required}
    rows={rows}
    style={{ width: "100%", resize: "vertical" }}
  />
);

const Select = ({ name, required = true, options = [], placeholder = "Select..." }) => (
  <select
    className="input mobile-input"
    name={name}
    required={required}
    defaultValue=""
    style={{ width: "100%" }}
  >
    <option value="" disabled>
      {placeholder}
    </option>
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
);

/* ============== Header with Back ============== */
function PageHeader({ title, onBack }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
      <button
        type="button"
        onClick={onBack}
        className="button"
        style={{
          background: "rgba(18,231,207,0.1)",
          border: "1px solid rgba(18,231,207,0.35)",
          color: "#7ff7ea",
          padding: "8px 12px",
          borderRadius: 10,
          cursor: "pointer",
        }}
      >
        ← Back
      </button>
      <h1 className="mobile-section-title" style={{ margin: 0 }}>{title}</h1>
    </div>
  );
}

/* ============== Layout ============== */
function FormLayout({ title, brief, onSubmit, onBack, children }) {
  return (
    <main className="container" style={{ padding: "40px 0" }}>
      <PageHeader title={title} onBack={onBack} />

      {brief && (
        <div
          className="service-brief"
          style={{
            border: "1px solid rgba(127,247,234,0.22)",
            background: "linear-gradient(180deg, rgba(15,25,35,0.7), rgba(11,19,25,0.6))",
            borderRadius: 14,
            padding: 16,
            marginBottom: 32,
            boxShadow: "0 18px 36px rgba(0,0,0,.28)",
          }}
        >
          {brief.title && (
            <h3 style={{ margin: "0 0 8px", fontWeight: 800 }}>{brief.title}</h3>
          )}
          {brief.lines?.length > 0 && (
            <ul style={{ margin: 0, paddingLeft: 18, color: "var(--muted,#bfe9e6)", lineHeight: 1.6 }}>
              {brief.lines.map((l, i) => (
                <li key={i} style={{ marginBottom: 6 }}>{l}</li>
              ))}
            </ul>
          )}
          {brief.note && (
            <p style={{ margin: "10px 0 0", color: "var(--muted,#bfe9e6)" }}>
              <em>{brief.note}</em>
            </p>
          )}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          onSubmit?.(fd);
        }}
        className="mobile-form"
        style={{ display: "grid", gap: 18, maxWidth: 760 }}
      >
        {children}
        <button className="button mobile-submit-button" type="submit">
          Submit
        </button>
      </form>
    </main>
  );
}

/* ============== Payment redirect helper ============== */
function useRazorpayRedirect() {
  const navigate = useNavigate();
  return ({ tag, price }) => {
    const qp = new URLSearchParams({ service: tag, price });
    navigate({ pathname: "/checkout-razorpay", search: qp.toString() });
  };
}

/* ============== Briefs ============== */
const BRIEFS = {
  coc: {
    title: "Who is Code of Consistency for?",
    lines: [
      "Traders who want to learn proper, accountable trading with step‑by‑step structure.",
      "Ideal for building a serious side‑hustle or growing into a full‑time trading career.",
      "Focus on execution discipline, risk control, journaling, and a repeatable process.",
    ],
    note: "Education-first: coaching, routines, Q&As, and process enforcement to make consistency inevitable.",
  },
  edge: {
    title: "Who is The Guaranteed Edge for?",
    lines: [
      "Working professionals who want a time‑light, structured approach (~10–20 minutes/day).",
      "Mathematical, rule‑based cycles with pre‑defined risk and profit booking logic.",
      "No education curriculum—this is a plug‑in method, not a teaching program.",
    ],
    note: "Education excluded: this is a mathematical approach to trading, focused on execution of the model.",
  },
  discord: {
    title: "Discord Premium Membership Access",
    lines: [
      "Perfect for traders who want daily accountability, live rooms, premium calls, and resources.",
      "Stay connected to structured routines, weekly reviews, and community challenges.",
      "Great companion for both learners and busy professionals who need guidance momentum.",
    ],
    note: "Premium gives access and support—not a standalone full education program.",
  },
  live: {
    title: "Live Trades Callouts & Investment Insights",
    lines: [
      "Curated FX callouts and investment ideas with risk, context, and cycle structure.",
      "Meant for those who prefer guided signals and higher‑level insights over DIY discovery.",
      "Pairs well with proper risk management and a clear journaling routine.",
    ],
    note: "This is not an education service; it delivers actionable ideas with structured context.",
  },
};

/* ============== Common Questions ============== */
function CommonQuestions() {
  return (
    <>
      <Field label="Full Name" required>
        <Input name="fullName" placeholder="Jane Doe" />
      </Field>

      <Field label="Email Address" required>
        <Input name="email" type="email" placeholder="jane@email.com" />
      </Field>

      <Field label="Country/Time Zone" required>
        <Input name="countryTz" placeholder="India / IST" />
      </Field>

      <Field label="Have you ever traded before?" required>
        <Select
          name="tradedBefore"
          options={[
            { label: "Nope, I'm brand new", value: "brand_new" },
            { label: "I tried demo once", value: "demo_once" },
            { label: "Yes, but still learning basics", value: "learning_basics" },
          ]}
        />
      </Field>

      <Field label="How did you come to know about Silent Equity?" required>
        <Select
          name="heardFrom"
          options={[
            { label: "Instagram", value: "instagram" },
            { label: "Friends", value: "friends" },
            { label: "Events", value: "events" },
          ]}
        />
      </Field>

      <Field label="What’s your biggest concern about trading?" required>
        <Select
          name="biggestConcern"
          options={[
            { label: "Losing money", value: "losing_money" },
            { label: "Not knowing where to start", value: "where_to_start" },
            { label: "Too complicated", value: "too_complicated" },
            { label: "Staying consistent", value: "staying_consistent" },
          ]}
        />
      </Field>
    </>
  );
}

/* ============== Service-specific (Code of Consistency) ============== */
function COCSpecific() {
  return (
    <>
      <Field label="Why do you want to learn trading?" required>
        <Select
          name="coc_reason"
          options={[
            { label: "Earn a side income", value: "side_income" },
            { label: "Become a full-time trader", value: "full_time" },
            { label: "Learn for knowledge/Interest", value: "knowledge_interest" },
          ]}
        />
      </Field>

      <Field label="Are you ready to invest a year or more to find the profitability edge?" required>
        <Select
          name="coc_commit"
          options={[
            { label: "Yes, am born ready", value: "born_ready" },
            { label: "1 year is too long, still I think I should be motivated for that challenge.", value: "one_year_long_but_try" },
          ]}
        />
      </Field>

      <Field label="Have you ever studied from any trading institution?" required>
        <Select
          name="coc_studied_institution"
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
      </Field>

      <Field label="Are you aware of the basics of forex?" required>
        <Select
          name="coc_forex_basics"
          options={[
            { label: "Yes, I have referred videos / I have studied from others", value: "aware" },
            { label: "No, I need to start fresh", value: "start_fresh" },
          ]}
        />
      </Field>

      <Field label="Current Struggles" required>
        <Textarea
          name="coc_current_struggles"
          placeholder="Share details: execution discipline, overtrading, FOMO, risk management, journaling…"
        />
      </Field>

      <Field label="Hours available per week" required>
        <Input name="coc_hours_per_week" type="number" placeholder="e.g., 5–10" />
      </Field>
    </>
  );
}

/* ============== Forms with briefs and redirect ============== */
const PRICES = { coc: "$249", edge: "$149", discord: "$13", live: "$13" };

function FormCodeOfConsistency({ back }) {
  const redirect = useRazorpayRedirect();
  return (
    <FormLayout
      title="Apply — Code of Consistency"
      brief={BRIEFS.coc}
      onSubmit={(fd) => submitAndRedirect(fd, "coc", PRICES.coc, redirect)}
      onBack={back}
    >
      <CommonQuestions />
      <COCSpecific />
    </FormLayout>
  );
}

function FormGuaranteedEdge({ back }) {
  const redirect = useRazorpayRedirect();
  return (
    <FormLayout
      title="Apply — The Guaranteed Edge"
      brief={BRIEFS.edge}
      onSubmit={(fd) => submitAndRedirect(fd, "edge", PRICES.edge, redirect)}
      onBack={back}
    >
      <CommonQuestions />
      <Field label="Daily time you can commit (minutes)" required>
        <Input name="dailyMinutes" type="number" placeholder="10–20" />
      </Field>
      <Field label="Capital to allocate (USD)" required>
        <Input name="capitalUSD" placeholder="1000–5000" />
      </Field>
      <Field label="Risk comfort and return expectations" required>
        <Textarea name="riskComfort" placeholder="Max drawdown comfort, monthly target appetite…" />
      </Field>
      <Field label="Platforms/Brokers currently used" required>
        <Textarea name="platforms" placeholder="Broker name(s), account types, tools…" />
      </Field>
    </FormLayout>
  );
}

function FormDiscordPremium({ back }) {
  const redirect = useRazorpayRedirect();
  return (
    <FormLayout
      title="Apply — Discord Premium Membership Access"
      brief={BRIEFS.discord}
      onSubmit={(fd) => submitAndRedirect(fd, "discord", PRICES.discord, redirect)}
      onBack={back}
    >
      <CommonQuestions />
      <Field label="Discord Tag" required>
        <Input name="discordTag" placeholder="username#1234" />
      </Field>
      <Field label="Focus area" required>
        <Input name="focusArea" placeholder="FX / Indices / Options / Crypto" />
      </Field>
      <Field label="What do you want from Premium?" required>
        <Textarea name="expectations" placeholder="Live rooms, reviews, resources, accountability…" />
      </Field>
    </FormLayout>
  );
}

function FormLiveTrades({ back }) {
  const redirect = useRazorpayRedirect();
  return (
    <FormLayout
      title="Apply — Live Trades Callouts & Investment Insights"
      brief={BRIEFS.live}
      onSubmit={(fd) => submitAndRedirect(fd, "live", PRICES.live, redirect)}
      onBack={back}
    >
      <CommonQuestions />
      <Field label="Experience level" required>
        <Input name="experienceLevel" placeholder="Beginner / Intermediate / Advanced" />
      </Field>
      <Field label="Risk per trade (%)" required>
        <Input name="riskPercent" type="number" placeholder="0.25–1.0" />
      </Field>
      <Field label="Markets interested" required>
        <Textarea name="markets" placeholder="Major FX, XAUUSD, indices, BTC, value equities…" />
      </Field>
      <Field label="Preferred delivery" required>
        <Textarea name="delivery" placeholder="Discord channel, concise summaries, alert style…" />
      </Field>
    </FormLayout>
  );
}

/* ============== Chooser with prices ============== */
function Chooser({ onPick }) {
  const options = [
    {
      key: "coc",
      title: "Code of Consistency",
      price: PRICES.coc,
      desc: "Learn proper trading with discipline and structure—build a reliable side hustle or a full‑time career path.",
    },
    {
      key: "edge",
      title: "The Guaranteed Edge",
      price: PRICES.edge,
      desc: "For working professionals: time‑light, mathematical cycles—no education, just a structured approach to execution.",
    },
    {
      key: "discord",
      title: "Discord Premium Membership Access",
      price: PRICES.discord,
      desc: "Live rooms, Q&As, resources, accountability—momentum and support to stay on track each day.",
    },
    {
      key: "live",
      title: "Live Trades Callouts & Investment Insights",
      price: PRICES.live,
      desc: "Actionable trade ideas and investment insights with risk context and cycle structure.",
    },
  ];

  return (
    <main className="container" style={{ padding: "40px 0" }}>
      <h1 className="mobile-section-title" style={{ marginBottom: 8 }}>Take Position💰</h1>
      <p className="mobile-section-text" style={{ marginBottom: 22 }}>
        Choose a track to proceed. A short, focused questionnaire will ensure tailored guidance and onboarding.
      </p>

      <div
        className="option-grid"
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        {options.map((o) => (
          <button
            key={o.key}
            onClick={() => onPick(o.key)}
            className="option-card"
            style={{
              textAlign: "left",
              background:
                "linear-gradient(180deg, var(--panel, #0f1923), var(--panel2, #0b1319))",
              border: "1px solid var(--border, rgba(122,255,244,.22))",
              borderRadius: 14,
              padding: 16,
              color: "var(--fg, #eafdfd)",
              boxShadow: "0 18px 36px rgba(0,0,0,.36)",
              transition: "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 22px 44px rgba(0,0,0,.42)";
              e.currentTarget.style.borderColor = "rgba(18,231,207,.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 18px 36px rgba(0,0,0,.36)";
              e.currentTarget.style.borderColor = "var(--border, rgba(122,255,244,.22))";
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
              <h3 style={{ margin: "0 0 6px", fontWeight: 800 }}>{o.title}</h3>
              <span
                style={{
                  fontWeight: 800,
                  color: "#7ff7ea",
                  background: "rgba(18,231,207,0.12)",
                  border: "1px solid rgba(18,231,207,0.35)",
                  padding: "4px 8px",
                  borderRadius: 8,
                  whiteSpace: "nowrap",
                }}
              >
                {o.price}
              </span>
            </div>
            <p style={{ margin: 0, color: "var(--muted, #bfe9e6)", lineHeight: 1.6 }}>
              {o.desc}
            </p>
          </button>
        ))}
      </div>
    </main>
  );
}

/* ============== Page Wrapper (Back to chooser) ============== */
function FormPage() {
  const [mode, setMode] = useQueryMode("chooser");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [mode]);

  const backToChooser = () => setMode("chooser");

  return (
    <>
      {mode === "chooser" && <Chooser onPick={(key) => setMode(key)} />}
      {mode === "coc" && <FormCodeOfConsistency back={backToChooser} />}
      {mode === "edge" && <FormGuaranteedEdge back={backToChooser} />}
      {mode === "discord" && <FormDiscordPremium back={backToChooser} />}
      {mode === "live" && <FormLiveTrades back={backToChooser} />}
    </>
  );
}

/* ============== Razorpay Checkout Page ============== */
function useQueryParams() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("rzp-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "rzp-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function RazorpayCheckout() {
  const params = useQueryParams();
  const service = params.get("service") || "";
  const price = params.get("price") || "";
  const labels = {
    coc: "Code of Consistency",
    edge: "The Guaranteed Edge",
    discord: "Discord Premium Membership Access",
    live: "Live Trades Callouts & Investment Insights",
  };
  const title = labels[service] || "Selected Service";

  const openRazorpay = async () => {
    const ok = await loadRazorpayScript();
    if (!ok) {
      alert("Failed to load Razorpay. Check your network.");
      return;
    }

    // NOTE: Replace these placeholders with your server-created order and key_id
    const key_id = "rzp_test_xxxxxxxxxxxxx"; // from Razorpay Dashboard (test key)
    const order_id = "order_DBJOWzybf0sJbb";   // create on your server for exact amount
    const amountPaise = 100; // e.g., 100 = ₹1.00 (replace with real)

    const options = {
      key: key_id,
      amount: amountPaise,
      currency: "INR",
      name: "Silent Equity",
      description: title,
      order_id, // REQUIRED for captured payments
      handler: function (response) {
        console.log("Razorpay success:", response);
        alert("Payment successful! We’ll reach out shortly.");
        // TODO: verify payment on server using response.razorpay_payment_id etc.
      },
      prefill: {
        name: "",
        email: "",
      },
      notes: {
        service,
      },
      theme: { color: "#12e7cf" },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      console.error("Payment failed:", response.error);
      alert("Payment failed or cancelled. Try again.");
    });
    rzp.open();
  };

  return (
    <main className="container" style={{ padding: "40px 0" }}>
      <h1 className="mobile-section-title" style={{ marginBottom: 10 }}>Checkout — Razorpay</h1>

      <div
        style={{
          border: "1px solid rgba(127,247,234,0.22)",
          background: "linear-gradient(180deg, rgba(15,25,35,0.7), rgba(11,19,25,0.6))",
          borderRadius: 14,
          padding: 16,
          marginBottom: 20,
          boxShadow: "0 18px 36px rgba(0,0,0,.28)",
        }}
      >
        <h3 style={{ margin: "0 0 8px", fontWeight: 800 }}>{title}</h3>
        <p style={{ margin: "0 0 10px", color: "var(--muted,#bfe9e6)" }}>
          Review and proceed to secure payment.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontWeight: 800,
              color: "#7ff7ea",
              background: "rgba(18,231,207,0.12)",
              border: "1px solid rgba(18,231,207,0.35)",
              padding: "6px 10px",
              borderRadius: 8,
              whiteSpace: "nowrap",
            }}
          >
            {price || "—"}
          </span>
        </div>
      </div>

      <button
        className="button"
        onClick={openRazorpay}
        style={{ padding: "12px 18px", borderRadius: 10, fontWeight: 700 }}
      >
        Pay with Razorpay (Test)
      </button>

      <p className="mobile-section-text" style={{ marginTop: 12, color: "var(--muted,#bfe9e6)" }}>
        Note: For live payments, replace the test key and provide a real order_id from your server that is created for the exact amount.
      </p>
    </main>
  );
}

/* Export both: the form page (default) and the checkout page */
async function submitAndRedirect(fd, tag, price, redirect) {
  // Convert FormData to a plain JavaScript object
  const obj = {};
  fd.forEach((v, k) => (obj[k] = v));

  console.log(`[${tag}] submission:`, obj);

  try {
    const response = await fetch("/api/save-lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj), // Send the data as a JSON string
    });

    // Check if the response was successful
    if (response.ok) {
      console.log("Form data sent to API successfully.");
      // Now that the data is saved, you can redirect the user
      redirect({ tag, price });
    } else {
      // Handle API errors
      console.error("Failed to save data to Google Sheet.");
      alert("Submission failed. Please try again.");
    }
  } catch (error) {
    // Handle network errors
    console.error("Network error during form submission:", error);
    alert("An error occurred. Check your network connection.");
  }
}

export default FormPage;
export { RazorpayCheckout };

/* For convenient import in App.jsx as Form.RazorpayCheckout */
const Form = FormPage;
Form.RazorpayCheckout = RazorpayCheckout;
export { Form };