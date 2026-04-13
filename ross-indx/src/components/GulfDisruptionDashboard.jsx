import React, { useState, useEffect, useRef } from "react";
import { LENSES, TOTAL_QUESTIONS } from "../data/lensData";

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const BackArrow = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
  </svg>
);
const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3C3C3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ─── Logo ─────────────────────────────────────────────────────────────────────
const RossLogo = () => (
  <div style={{ backgroundImage: "url(https://workers.paper.design/file-assets/01KKVB9FZ0STTPG2JC2C0ZKDT5/01KM2MK8Y13SXP05BA89ARWEFN.png)", backgroundPosition: "0%", backgroundRepeat: "no-repeat", backgroundSize: "contain", flexShrink: 0, height: "42px", width: "35px" }} />
);

// ─── Chip (horizontal / grid) ─────────────────────────────────────────────────
function Chip({ label, selected, anySelected, onClick, multi }) {
  const dim = anySelected && !selected;
  return (
    <button
      onClick={onClick}
      style={{
        alignItems: "center",
        backgroundColor: selected ? "#1F1F1F" : "#FFFFFF",
        border: selected ? "1px solid #000" : "1px solid #C2C2C2",
        borderRadius: "10px",
        boxShadow: selected
          ? "rgba(0,0,0,0.25) 0px 1px 4px"
          : "rgba(0,0,0,0.06) 0px 1px 3px",
        boxSizing: "border-box",
        color: selected ? "#FFFFFF" : "#1F1F1F",
        cursor: "pointer",
        display: "flex",
        gap: multi ? "8px" : "0",
        fontFamily: '"Helvetica", system-ui, sans-serif',
        fontSize: "14px",
        fontWeight: selected ? 600 : 400,
        letterSpacing: "0.01em",
        lineHeight: "18px",
        opacity: dim ? 0.4 : 1,
        outline: "none",
        padding: "11px 20px",
        transition: "all 0.18s ease",
        whiteSpace: "nowrap",
      }}
    >
      {multi && selected && <span style={{ display: "flex", alignItems: "center" }}><CheckIcon /></span>}
      {label}
    </button>
  );
}

// ─── Card (2-column) ──────────────────────────────────────────────────────────
function OptionCard({ label, sub, selected, anySelected, onClick, accentColor }) {
  const dim = anySelected && !selected;
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        alignItems: "flex-start",
        backgroundColor: selected ? "#1F1F1F" : hovered ? "#F5F5F5" : "#FFFFFF",
        border: selected ? `1.5px solid ${accentColor || "#1F1F1F"}` : "1px solid #DCDCDC",
        borderRadius: "12px",
        boxShadow: selected
          ? `${accentColor || "#1F1F1F"}30 0px 0px 0px 3px, rgba(0,0,0,0.1) 0px 2px 6px`
          : "rgba(0,0,0,0.05) 0px 1px 3px",
        boxSizing: "border-box",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        opacity: dim ? 0.4 : 1,
        outline: "none",
        padding: "14px 16px",
        textAlign: "left",
        transition: "all 0.18s ease",
        width: "100%",
      }}
    >
      <span style={{
        color: selected ? "#FFFFFF" : "#1F1F1F",
        fontFamily: '"Helvetica", system-ui, sans-serif',
        fontSize: "14px",
        fontWeight: 700,
        letterSpacing: "0.01em",
        lineHeight: "18px",
      }}>
        {label}
      </span>
      {sub && (
        <span style={{
          color: selected ? "rgba(255,255,255,0.7)" : "#6B6B6B",
          fontFamily: '"Helvetica", system-ui, sans-serif',
          fontSize: "12px",
          lineHeight: "16px",
          letterSpacing: "0.02em",
        }}>
          {sub}
        </span>
      )}
    </button>
  );
}

// ─── Question Renderer ────────────────────────────────────────────────────────
function QuestionBlock({ question, answer, onAnswer, accentColor }) {
  const anySelected = Array.isArray(answer) ? answer.length > 0 : !!answer;

  const handleChipClick = (opt) => {
    if (question.multi) {
      const cur = answer || [];
      const next = cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt];
      onAnswer(next);
    } else {
      onAnswer(opt);
    }
  };

  const handleCardClick = (opt) => {
    const val = typeof opt === "string" ? opt : opt.label;
    onAnswer(val);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
      {/* Question text + hint */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h2 style={{
          color: "#1F1F1F",
          fontFamily: '"Helvetica", system-ui, sans-serif',
          fontSize: "20px",
          fontWeight: 700,
          letterSpacing: "0.02em",
          lineHeight: "26px",
          margin: 0,
        }}>
          {question.text}
        </h2>
        {question.hint && (
          <div style={{
            alignItems: "flex-start",
            backgroundColor: "rgba(0,128,128,0.07)",
            borderLeft: "3px solid rgba(0,128,128,0.65)",
            borderRadius: "7px",
            display: "flex",
            padding: "9px 13px",
            width: "fit-content",
            maxWidth: "100%",
          }}>
            <span style={{
              color: "#3C3C3C",
              fontFamily: '"Helvetica", system-ui, sans-serif',
              fontSize: "12px",
              letterSpacing: "0.025em",
              lineHeight: "17px",
            }}>
              {question.hint}
            </span>
          </div>
        )}
      </div>

      {/* Options */}
      {(question.type === "chips-horizontal") && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {question.options.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              selected={answer === opt}
              anySelected={anySelected}
              onClick={() => handleChipClick(opt)}
              multi={false}
            />
          ))}
        </div>
      )}

      {(question.type === "chips-grid") && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {question.options.map((opt) => {
            const sel = Array.isArray(answer) && answer.includes(opt);
            return (
              <Chip
                key={opt}
                label={opt}
                selected={sel}
                anySelected={anySelected}
                onClick={() => handleChipClick(opt)}
                multi={true}
              />
            );
          })}
        </div>
      )}

      {(question.type === "cards-2col") && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          width: "100%",
        }}>
          {question.options.map((opt) => {
            const val = typeof opt === "string" ? opt : opt.label;
            return (
              <OptionCard
                key={val}
                label={val}
                sub={typeof opt === "object" ? opt.sub : null}
                selected={answer === val}
                anySelected={anySelected}
                onClick={() => handleCardClick(opt)}
                accentColor={accentColor}
              />
            );
          })}
        </div>
      )}

      {/* Multi-select confirm note */}
      {question.multi && anySelected && (
        <p style={{
          color: "#888",
          fontFamily: '"Helvetica", system-ui, sans-serif',
          fontSize: "12px",
          letterSpacing: "0.02em",
          margin: 0,
        }}>
          {(answer || []).length} selected — click Next to continue
        </p>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function GulfDisruptionDashboard() {
  const [lensIdx, setLensIdx] = useState(0);           // 0-based lens index
  const [qIdx, setQIdx] = useState(0);                 // question within lens
  const [answers, setAnswers] = useState({});           // key: "L{l}Q{q}" → value
  const [animKey, setAnimKey] = useState(0);           // triggers slide animation
  const [direction, setDirection] = useState("forward"); // "forward" | "back"
  const prevAnswerRef = useRef(null);

  const lens = LENSES[lensIdx];
  const question = lens.questions[qIdx];
  const answerKey = question.id;
  const currentAnswer = answers[answerKey];

  // ── Compute completion stats ──────────────────────────────────────────────
  const totalAnswered = Object.keys(answers).length;
  const completionPct = Math.round((totalAnswered / TOTAL_QUESTIONS) * 100);

  const lensAnsweredCount = (l) =>
    l.questions.filter((q) => answers[q.id] !== undefined && (Array.isArray(answers[q.id]) ? answers[q.id].length > 0 : true)).length;

  const lensQCount = (l) => l.questions.length;

  // Progress within current lens for the bar
  const lensProgress = (lensIdx * 0 + qIdx) / lens.questions.length; // fraction within lens
  // Global bar: what fraction of all questions answered
  const globalFrac = totalAnswered / TOTAL_QUESTIONS;

  // ── Auto-advance on single-select ─────────────────────────────────────────
  const handleAnswer = (val) => {
    const isMulti = question.multi;
    setAnswers((prev) => ({ ...prev, [answerKey]: val }));
    if (!isMulti) {
      // Slight delay so user sees the selection flash
      setTimeout(() => goNext(), 380);
    }
  };

  // ── Navigation ────────────────────────────────────────────────────────────
  const goNext = () => {
    if (qIdx < lens.questions.length - 1) {
      setDirection("forward");
      setAnimKey((k) => k + 1);
      setQIdx((q) => q + 1);
    } else if (lensIdx < LENSES.length - 1) {
      setDirection("forward");
      setAnimKey((k) => k + 1);
      setLensIdx((l) => l + 1);
      setQIdx(0);
    }
  };

  const goBack = () => {
    if (qIdx > 0) {
      setDirection("back");
      setAnimKey((k) => k + 1);
      setQIdx((q) => q - 1);
    } else if (lensIdx > 0) {
      setDirection("back");
      setAnimKey((k) => k + 1);
      setLensIdx((l) => l - 1);
      setQIdx(LENSES[lensIdx - 1].questions.length - 1);
    }
  };

  const goNextLens = () => {
    if (lensIdx < LENSES.length - 1) {
      setDirection("forward");
      setAnimKey((k) => k + 1);
      setLensIdx((l) => l + 1);
      setQIdx(0);
    }
  };

  const goPrevLens = () => {
    if (lensIdx > 0) {
      setDirection("back");
      setAnimKey((k) => k + 1);
      setLensIdx((l) => l - 1);
      setQIdx(0);
    }
  };

  const canGoNext = currentAnswer !== undefined && (Array.isArray(currentAnswer) ? currentAnswer.length > 0 : true);
  const isLastQuestion = qIdx === lens.questions.length - 1 && lensIdx === LENSES.length - 1;

  // ── Segment positions for progress bar ───────────────────────────────────
  // The bar is split into 4 lens segments. Each segment width = 25% of total.
  // Fill = how many questions answered globally as pct.
  const barFill = `${globalFrac * 100}%`;

  // ── Lens selector tabs ───────────────────────────────────────────────────
  const tabs = LENSES.map((l) => l.tab);

  return (
    <>
      <style>{`
        @keyframes slideInForward {
          from { opacity: 0; transform: translateX(28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInBack {
          from { opacity: 0; transform: translateX(-28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .q-enter-forward { animation: slideInForward 0.28s cubic-bezier(0.22,1,0.36,1) both; }
        .q-enter-back    { animation: slideInBack    0.28s cubic-bezier(0.22,1,0.36,1) both; }

        button { cursor: pointer; font-family: inherit; }
        *      { box-sizing: border-box; }
      `}</style>

      <div style={{
        alignItems: "start",
        backgroundColor: "#F0F0F0",
        display: "flex",
        flexDirection: "column",
        fontFamily: '"Helvetica", system-ui, sans-serif',
        fontSize: "12px",
        gap: 0,
        minHeight: "100vh",
        WebkitFontSmoothing: "antialiased",
        width: "100%",
      }}>

        {/* ── TOP NAV ───────────────────────────────────────────────────────── */}
        <header style={{
          alignItems: "center",
          backgroundColor: "#F9F9F9",
          boxSizing: "border-box",
          display: "flex",
          height: "64px",
          justifyContent: "space-between",
          outline: "1px solid #EAEAEA",
          padding: "0 48px",
          width: "100%",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}>
          {/* Left */}
          <div style={{ alignItems: "center", display: "flex", gap: "16px" }}>
            <RossLogo />
            <div style={{ backgroundColor: "#DDDDDD", height: "12px", width: "1px" }} />
            <span style={{ color: "#1A1A1A", fontSize: "12px", lineHeight: "16px" }}>
              Stage 0 • Diagnostic
            </span>
          </div>
          {/* Right: User pill */}
          <div style={{
            alignItems: "center",
            backgroundColor: "#FFFFFF",
            borderRadius: "11px",
            display: "flex",
            gap: "12px",
            outline: "1px solid #E6E6E6",
            padding: "6px 16px 6px 6px",
          }}>
            <div style={{
              alignItems: "center",
              backgroundColor: "#DDEFFF",
              borderRadius: "50%",
              display: "flex",
              flexShrink: 0,
              height: "26px",
              justifyContent: "center",
              width: "26px",
            }}>
              <span style={{ color: "#079CEE", fontSize: "11px", fontWeight: 700 }}>AB</span>
            </div>
            <span style={{ color: "#1A1A1A", fontSize: "13px", fontWeight: 700, lineHeight: "16px" }}>Alex Baker</span>
            <ChevronDown />
          </div>
        </header>

        {/* ── PAGE BODY ─────────────────────────────────────────────────────── */}
        <main style={{ display: "flex", padding: "36px 64px 60px", width: "100%", gap: "32px", maxWidth: "1440px", margin: "0 auto" }}>

          {/* ── LEFT COLUMN ─────────────────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: "24px", minWidth: 0 }}>

            {/* Breadcrumb row */}
            <div style={{ alignItems: "center", display: "flex", gap: "10px" }}>
              <button onClick={goBack} title="Back" style={{
                alignItems: "center",
                background: "linear-gradient(90deg,#fff 0%,#f7f7f7 100%)",
                border: "1px solid #C2C2C2",
                borderRadius: "8px",
                boxShadow: "0 2px 3px rgba(0,0,0,0.05)",
                display: "flex",
                height: "28px",
                justifyContent: "center",
                outline: "none",
                width: "28px",
                flexShrink: 0,
              }}>
                <BackArrow />
              </button>
              <span style={{ color: "#B2B2B2", fontSize: "12px", letterSpacing: "0.02em", lineHeight: "16px" }}>
                Dashboard&nbsp;&nbsp;/
              </span>
              <span style={{ color: "#3C3C3C", fontSize: "12px", letterSpacing: "0.02em", lineHeight: "16px" }}>
                Gulf Disruption Rebalancing
              </span>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {LENSES.map((l, i) => {
                const isActive = i === lensIdx;
                return (
                  <button
                    key={l.tab}
                    onClick={() => { setDirection(i > lensIdx ? "forward" : "back"); setAnimKey(k => k + 1); setLensIdx(i); setQIdx(0); }}
                    style={{
                      backgroundColor: isActive ? l.color : "#FFFFFF",
                      border: `1px solid ${isActive ? l.borderColor : "#9A9A9A"}`,
                      borderRadius: "4px",
                      color: isActive ? "#FFFFFF" : "#353535",
                      fontSize: "14px",
                      fontWeight: 700,
                      letterSpacing: "0.03em",
                      lineHeight: "14px",
                      outline: "none",
                      padding: "10px 24px",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {l.tab}
                  </button>
                );
              })}
            </div>

            {/* Lens labels + progress bar */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {/* Lens labels */}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {LENSES.map((l, i) => (
                  <span key={l.name} style={{
                    color: i === lensIdx ? "#1F1F1F" : "#5F5F5F",
                    fontSize: "13px",
                    fontWeight: i === lensIdx ? 700 : 400,
                    letterSpacing: "0.02em",
                    lineHeight: "18px",
                    transition: "all 0.2s ease",
                  }}>
                    {l.name}
                  </span>
                ))}
              </div>

              {/* Progress track */}
              <div style={{
                backgroundColor: "#E5E5E5",
                borderRadius: "6px",
                height: "10px",
                overflow: "clip",
                position: "relative",
                width: "100%",
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.06)",
              }}>
                {/* Segment dividers */}
                {[25, 50, 75].map((pct) => (
                  <div key={pct} style={{
                    backgroundColor: "rgba(255,255,255,0.5)",
                    height: "100%",
                    left: `${pct}%`,
                    position: "absolute",
                    top: 0,
                    width: "1px",
                    zIndex: 2,
                  }} />
                ))}
                {/* Fill */}
                <div style={{
                  background: `linear-gradient(90deg, ${lens.color} 0%, ${lens.borderColor} 100%)`,
                  borderRadius: "6px",
                  height: "100%",
                  transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)",
                  width: barFill,
                  zIndex: 1,
                }} />
              </div>

              {/* Q progress dots */}
              <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                {lens.questions.map((q, i) => {
                  const answered = answers[q.id] !== undefined && (Array.isArray(answers[q.id]) ? answers[q.id].length > 0 : true);
                  const isCurrent = i === qIdx;
                  return (
                    <div key={q.id} style={{
                      backgroundColor: answered ? lens.color : isCurrent ? "#C8C8C8" : "#E0E0E0",
                      borderRadius: "9999px",
                      flexShrink: 0,
                      height: isCurrent ? "8px" : "5px",
                      transition: "all 0.2s ease",
                      width: isCurrent ? "20px" : "5px",
                    }} />
                  );
                })}
                <span style={{ color: "#888", fontSize: "11px", marginLeft: "6px" }}>
                  Q{qIdx + 1} of {lens.questions.length}
                </span>
              </div>
            </div>

            {/* Lens title */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <h1 style={{
                color: "#1F1F1F",
                fontSize: "22px",
                fontWeight: 700,
                letterSpacing: "0.02em",
                lineHeight: "28px",
                margin: 0,
              }}>
                {lens.name} — {lens.title}
              </h1>
              <p style={{ color: "#3C3C3C", fontSize: "15px", letterSpacing: "0.02em", lineHeight: "20px", margin: 0 }}>
                {lens.subtitle}
              </p>
            </div>

            {/* ── QUESTION CARD ────────────────────────────────────────────── */}
            <div style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "24px",
              boxShadow: "rgba(224,224,224,0.5) 0px 2px 3px, #E0E0E0 0px 0px 0px 1px",
              display: "flex",
              flexDirection: "column",
              gap: "28px",
              overflow: "clip",
              padding: "28px 28px 20px",
            }}>
              {/* Question counter badge */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  alignItems: "center",
                  backgroundColor: lens.activeBg,
                  border: `1px solid ${lens.activeBorder}`,
                  borderRadius: "6px",
                  display: "flex",
                  flexShrink: 0,
                  padding: "4px 10px",
                }}>
                  <span style={{ color: lens.color, fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    Q{qIdx + 1} / {lens.questions.length}
                  </span>
                </div>
                <span style={{ color: "#AAAAAA", fontSize: "12px" }}>
                  {lens.name} — {lens.title}
                </span>
              </div>

              {/* Animated question block */}
              <div
                key={`${lensIdx}-${qIdx}-${animKey}`}
                className={direction === "forward" ? "q-enter-forward" : "q-enter-back"}
              >
                <QuestionBlock
                  question={question}
                  answer={answers[answerKey]}
                  onAnswer={handleAnswer}
                  accentColor={lens.color}
                />
              </div>

              {/* Back / Next buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", paddingTop: "4px" }}>
                <button
                  onClick={goBack}
                  disabled={lensIdx === 0 && qIdx === 0}
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #C0C0C0",
                    borderRadius: "8px",
                    boxShadow: "#E9E9E9 0px 0px 0px 1px inset, rgba(0,0,0,0.04) 0px 1px 3px",
                    color: "#3C3C3C",
                    fontSize: "14px",
                    letterSpacing: "0.02em",
                    opacity: (lensIdx === 0 && qIdx === 0) ? 0.4 : 1,
                    outline: "none",
                    padding: "11px 20px",
                  }}
                >
                  Back
                </button>
                {question.multi ? (
                  <button
                    onClick={goNext}
                    disabled={!canGoNext || isLastQuestion}
                    style={{
                      backgroundColor: canGoNext ? lens.color : "#E0E0E0",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: canGoNext ? `${lens.color}60 0px 0px 0px 1px, rgba(0,0,0,0.15) 0px 2px 6px` : "none",
                      color: canGoNext ? "#FFFFFF" : "#999",
                      fontSize: "14px",
                      fontWeight: 600,
                      letterSpacing: "0.02em",
                      outline: "none",
                      padding: "11px 24px",
                      transition: "all 0.18s ease",
                    }}
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={goNext}
                    disabled={isLastQuestion}
                    style={{
                      backgroundColor: "#F5F5F5",
                      border: "1px solid #DCDCDC",
                      borderRadius: "8px",
                      color: "#666",
                      fontSize: "13px",
                      letterSpacing: "0.02em",
                      opacity: isLastQuestion ? 0.4 : 1,
                      outline: "none",
                      padding: "11px 20px",
                    }}
                  >
                    Skip →
                  </button>
                )}
              </div>
            </div>

            {/* ── BOTTOM LENS NAV ──────────────────────────────────────────── */}
            <div style={{
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              borderRadius: "13px",
              boxShadow: "rgba(224,224,224,0.5) 0px 2px 3px, #E0E0E0 0px 0px 0px 1px",
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 20px",
            }}>
              <button
                onClick={goPrevLens}
                disabled={lensIdx === 0}
                style={{
                  backgroundColor: "#F3F3F3",
                  border: "1px solid #DBDBDB",
                  borderRadius: "6px",
                  boxShadow: "#E9E9E9 0px 0px 0px 1px inset, rgba(0,0,0,0.03) 0px 1px 3px",
                  color: "#3C3C3C",
                  fontSize: "14px",
                  letterSpacing: "0.02em",
                  opacity: lensIdx === 0 ? 0.4 : 1,
                  outline: "none",
                  padding: "11px 20px",
                }}
              >
                ← Previous Lens
              </button>

              <span style={{ color: "#AAAAAA", fontSize: "13px" }}>
                Lens {lensIdx + 1} of {LENSES.length}
              </span>

              <button
                onClick={goNextLens}
                disabled={lensIdx === LENSES.length - 1}
                style={{
                  backgroundImage: "linear-gradient(180deg, #3A3A3A 0%, #1A1A1A 100%)",
                  border: "none",
                  borderRadius: "6px",
                  boxShadow: "#171616 0px 0px 0px 0.5px inset, rgba(0,0,0,0.2) 0px 2px 6px",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  letterSpacing: "0.02em",
                  opacity: lensIdx === LENSES.length - 1 ? 0.4 : 1,
                  outline: "none",
                  padding: "11px 24px",
                }}
              >
                Next Lens →
              </button>
            </div>
          </div>

          {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
          <aside style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E8E8E8",
            borderRadius: "24px",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            overflow: "clip",
            width: "340px",
          }}>
            {/* Dark header */}
            <div style={{
              backgroundColor: "#1F1F1F",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              padding: "20px 22px",
            }}>
              <span style={{ color: "#B2B2B2", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", lineHeight: "16px", textTransform: "uppercase" }}>
                Journey Status
              </span>
              <span style={{ color: "#FFFFFF", fontSize: "20px", fontWeight: 700, lineHeight: "26px" }}>
                Stage 0 Progress
              </span>
            </div>

            {/* Completion */}
            <div style={{ borderBottom: "1px solid #EEEEEE", display: "flex", flexDirection: "column", gap: "14px", padding: "16px 22px" }}>
              <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#646463", fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Completion
                </span>
                <span style={{ color: "#00A82D", fontSize: "13px", fontWeight: 600 }}>
                  {completionPct}% complete
                </span>
              </div>
              {/* Progress bar */}
              <div style={{ backgroundColor: "#E5E5E5", borderRadius: "3px", height: "14px", overflow: "clip", position: "relative" }}>
                <div style={{
                  backgroundImage: "linear-gradient(90deg, #30BF4B 0%, #1DA83A 100%)",
                  border: "1px solid #28A83E",
                  borderRadius: "3px",
                  height: "100%",
                  minWidth: completionPct > 0 ? "6px" : "0px",
                  transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
                  width: `${completionPct}%`,
                }} />
              </div>
              {/* Stats */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { label: "Current Lens", value: lens.title },
                  { label: "Questions",   value: `${totalAnswered}/${TOTAL_QUESTIONS} answered` },
                ].map(({ label, value }) => (
                  <div key={label} style={{ alignItems: "flex-start", display: "flex", justifyContent: "space-between", gap: "16px" }}>
                    <span style={{ color: "#646463", flexShrink: 0, fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</span>
                    <span style={{ color: "#1A1A1A", fontSize: "13px", lineHeight: "18px", textAlign: "right" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lens Breakdown */}
            <div style={{ borderBottom: "1px solid #EEEEEE", display: "flex", flexDirection: "column", gap: "10px", padding: "14px 22px" }}>
              <span style={{ color: "#575757", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Lens Breakdown
              </span>
              {LENSES.map((l, i) => {
                const isActive = i === lensIdx;
                const answered = lensAnsweredCount(l);
                const total = lensQCount(l);
                const doneFrac = answered / total;
                return (
                  <button
                    key={l.id}
                    onClick={() => { setDirection(i > lensIdx ? "forward" : "back"); setAnimKey(k => k + 1); setLensIdx(i); setQIdx(0); }}
                    style={{
                      backgroundColor: isActive ? l.activeBg : "#FAFAFA",
                      border: `1px solid ${isActive ? l.activeBorder : "#DCDCDC"}`,
                      borderRadius: "10px",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                      opacity: isActive ? 1 : 0.65,
                      outline: "none",
                      padding: "12px 14px",
                      textAlign: "left",
                      transition: "all 0.18s ease",
                      width: "100%",
                    }}
                  >
                    <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#1A1A1A", fontSize: "14px", fontWeight: 700, letterSpacing: "0.01em", lineHeight: "18px" }}>{l.name}</span>
                      <span style={{ color: answered === total ? "#00A82D" : isActive ? l.color : "#AAAAAA", fontSize: "12px" }}>
                        {answered}/{total}
                      </span>
                    </div>
                    <span style={{ color: "#5C5C5C", fontSize: "11px", lineHeight: "15px", letterSpacing: "0.02em" }}>{l.title}</span>
                    {/* Mini progress bar */}
                    <div style={{ backgroundColor: "#E8E8E8", borderRadius: "3px", height: "3px", marginTop: "2px", overflow: "clip" }}>
                      <div style={{
                        backgroundColor: l.color,
                        borderRadius: "3px",
                        height: "100%",
                        transition: "width 0.4s ease",
                        width: `${doneFrac * 100}%`,
                      }} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "14px 22px" }}>
              <span style={{ color: "#AEAEAE", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Actions
              </span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => { setAnswers({}); setLensIdx(0); setQIdx(0); }}
                  style={{
                    backgroundColor: "#F3F3F3",
                    border: "1px solid #DBDBDB",
                    borderRadius: "6px",
                    boxShadow: "#E9E9E9 0px 0px 0px 1px inset, rgba(0,0,0,0.03) 0px 1px 3px",
                    color: "#3C3C3C",
                    flex: "1 1 0%",
                    fontSize: "13px",
                    outline: "none",
                    padding: "11px",
                  }}
                >
                  Reset
                </button>
                <button
                  style={{
                    backgroundImage: "linear-gradient(180deg, #3CA5E0 0%, #1E7EC4 100%)",
                    border: "none",
                    borderRadius: "6px",
                    boxShadow: "#067AC3 0px 0px 0px 0.5px inset, rgba(0,0,0,0.15) 0px 2px 6px, #008BDD 0px 0px 0px 1px",
                    color: "#FFFFFF",
                    flex: "2 1 0%",
                    fontSize: "13px",
                    letterSpacing: "0.02em",
                    opacity: completionPct < 100 ? 0.7 : 1,
                    outline: "none",
                    padding: "11px",
                  }}
                >
                  {completionPct === 100 ? "View diagnostic →" : `Show diagnostic (${completionPct}%)`}
                </button>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </>
  );
}
