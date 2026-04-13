import { useState } from 'react';
import { indiaData } from '../data/indiaData';

const TOTAL_QUESTIONS = indiaData.reduce((acc, step) => acc + step.questions.length, 0);

function RossLogo() {
  return (
    <svg width="133" height="25" viewBox="0 0 133 25" fill="none"
      xmlns="http://www.w3.org/2000/svg" style={{ width: 109, height: 20, flexShrink: 0 }}>
      <rect width="24.508" height="24.508" rx="2" fill="#FF6900" />
      <path d="M14.465 12.242C12.896 13.77 11.394 15.37 9.823 16.895C9.679 17.036 9.571 17.151 9.431 17.287C9.213 17.499 8.962 17.679 8.783 17.927H4.599L10.251 12.243L4.528 6.558L8.782 6.559V6.558L14.465 12.242ZM20.469 12.244C18.901 13.772 17.397 15.372 15.826 16.897C15.682 17.038 15.574 17.152 15.435 17.288C15.216 17.501 14.966 17.68 14.786 17.929H10.603L16.255 12.245L10.532 6.56L14.786 6.561V6.56L20.469 12.244Z" fill="#FFFFFF" />
      <path d="M35.002 5.186H37.264V8.272H37.32C38.479 5.894 40.092 4.761 42.696 4.846V7.394C38.821 7.394 37.405 9.574 37.405 13.31V19.82H35V5.186H35.002Z" fill="#F9F9F9" />
      <path d="M50.109 4.846C54.748 4.846 57.211 8.216 57.211 12.517C57.211 16.818 54.75 20.159 50.109 20.159C45.469 20.159 43.008 16.791 43.008 12.517C43.008 8.242 45.469 4.846 50.109 4.846ZM50.109 18.038C52.626 18.038 54.665 16.057 54.665 12.517C54.665 8.977 52.629 6.97 50.109 6.97C47.59 6.97 45.554 8.979 45.554 12.517C45.554 16.054 47.59 18.038 50.109 18.038Z" fill="#F9F9F9" />
      <path d="M60.805 15.206C60.89 17.356 62.786 18.038 64.738 18.038C66.237 18.038 68.275 17.698 68.275 15.858C68.275 12.093 58.713 14.641 58.713 9.006C58.713 6.063 61.598 4.846 64.173 4.846C67.456 4.846 69.944 5.864 70.172 9.431H67.766C67.626 7.561 65.928 6.967 64.372 6.967C62.929 6.967 61.259 7.363 61.259 8.837C61.259 10.536 63.805 10.876 66.04 11.385C68.445 11.923 70.821 12.742 70.821 15.545C70.821 19.056 67.568 20.159 64.597 20.159C61.317 20.159 58.543 18.828 58.402 15.206H60.808H60.805Z" fill="#F9F9F9" />
      <path d="M74.247 15.206C74.332 17.356 76.228 18.038 78.18 18.038C79.678 18.038 81.717 17.698 81.717 15.858C81.717 12.093 72.154 14.641 72.154 9.006C72.154 6.063 75.04 4.846 77.615 4.846C80.897 4.846 83.385 5.864 83.613 9.431H81.208C81.067 7.561 79.37 6.967 77.813 6.967C76.371 6.967 74.7 7.363 74.7 8.837C74.7 10.536 77.246 10.876 79.481 11.385C81.887 11.923 84.263 12.742 84.263 15.545C84.263 19.056 81.009 20.159 78.039 20.159C74.758 20.159 71.984 18.828 71.844 15.206H74.249H74.247Z" fill="#F9F9F9" />
      <path d="M86.315 4.497H88.368V19.5H86.315V4.497ZM90.631 4.497H93.031L100.609 16.651V4.497H102.54V19.5H100.262L92.571 7.356V19.5H90.631V4.497ZM110.461 17.764C111.149 17.764 111.714 17.692 112.156 17.549C112.946 17.284 113.593 16.773 114.097 16.017C114.499 15.411 114.788 14.635 114.965 13.689C115.067 13.123 115.118 12.599 115.118 12.116C115.118 10.257 114.747 8.813 114.005 7.785C113.27 6.757 112.082 6.243 110.441 6.243H106.835V17.764H110.461ZM104.793 4.497H110.87C112.933 4.497 114.533 5.229 115.67 6.692C116.684 8.013 117.192 9.705 117.192 11.768C117.192 13.362 116.892 14.802 116.293 16.089C115.238 18.363 113.423 19.5 110.849 19.5H104.793V4.497ZM120.058 19.5H117.606L122.979 11.809L117.943 4.497H120.487L124.317 10.236L128.116 4.497H130.536L125.501 11.809L130.782 19.5H128.259L124.214 13.331L120.058 19.5Z" fill="#FF6900" />
    </svg>
  );
}

function RadioOption({ label, sublabel, selected, onClick, multi }) {
  return (
    <div
      className={`radio-option ${selected ? 'selected' : 'unselected'}`}
      onClick={onClick}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', justifyContent: 'space-between' }}>
        <span 
          className="option-label"
          style={{
            fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif',
            fontSize: 16, fontWeight: 500, letterSpacing: '0.01em', lineHeight: '1.4',
            transition: 'color 0.2s',
          }}
        >
          {label}
        </span>
        <div style={{ position: 'relative', flexShrink: 0, width: 20, height: 20 }}>
          <div className="radio-dot-outer" style={{
            width: 20, height: 20, borderRadius: multi ? '4px' : '50%',
            backgroundColor: '#FFFFFF',
            border: `1.5px solid ${selected ? '#1A1A1A' : '#EAEAEA'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s'
          }}>
            {multi && selected && (
              <svg width="12" height="10" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {!multi && (
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                backgroundColor: '#1A1A1A',
                opacity: selected ? 1 : 0,
                transition: 'opacity 0.2s ease',
              }} />
            )}
          </div>
        </div>
      </div>
      {sublabel && (
        <div style={{ 
          color: selected ? '#5F5F5F' : '#B2B2B2', 
          fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif', 
          fontSize: 13, letterSpacing: '0.02em', lineHeight: '18px', 
          marginTop: 12, transition: 'color 0.2s' 
        }}>
          {sublabel}
        </div>
      )}
    </div>
  );
}

function StageProgressBar({ progress = 0 }) {
  const steps = indiaData.map(s => s.name);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
      <div style={{ position: 'relative', width: '100%', height: 18 }}>
        {steps.map((s, i) => (
          <span key={s} style={{
            position: 'absolute',
            left: `${i * (100 / steps.length)}%`,
            color: '#5F5F5F', fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif',
            fontSize: 14, letterSpacing: '0.02em', lineHeight: '18px',
          }}>{s}</span>
        ))}
      </div>

      <div style={{
        position: 'relative',
        width: '100%', height: 12,
        backgroundColor: '#E5E5E5',
        borderRadius: 4,
        boxShadow: '0 0 2px #00000005',
      }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${i * (100 / steps.length)}%`,
            top: 2, width: 1, height: 8,
            backgroundColor: '#A6A6A6',
            borderRadius: 9999,
          }} />
        ))}
        <div style={{
          position: 'absolute', right: 0, top: 2, width: 1, height: 8,
          backgroundColor: '#A6A6A6', borderRadius: 9999,
        }} />

        <div style={{
          position: 'absolute', left: 0, top: 0,
          width: `${progress}%`, height: '100%',
          backgroundImage: 'linear-gradient(90deg, #3d3d3d -3.6%, #1a1a1a 97.94%)',
          borderRadius: 4,
          overflow: 'hidden',
          transition: 'width 0.3s ease',
        }}>
          {progress > 0 && (
            <div style={{
              position: 'absolute', right: 3, top: 2,
              width: 2, height: 8,
              backgroundColor: '#FFFFFF',
              borderRadius: 1,
            }} />
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        {Array.from({ length: 128 }, (_, i) => {
          const filledDashes = Math.round((progress / 100) * 128);
          const isFilled = i < filledDashes;
          const isLead = i === filledDashes - 1;
          const bgColor = isLead ? '#000000' : isFilled ? '#1F1F1F' : '#DCDCDC';
          return (
            <div key={i} style={{ width: 1, height: 9, backgroundColor: bgColor, flexShrink: 0, transition: 'background-color 0.3s ease' }} />
          );
        })}
      </div>
    </div>
  );
}

function JourneyStatus({ answers, currentStep, activeStepIndex, onStepClick, isStepUnlocked, onFinishDiagnostic }) {
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);

  const answeredInCurrentStep = currentStep.questions.filter((q) => answers[q.id] !== undefined).length;
  const totalInCurrentStep = currentStep.questions.length;

  return (
    <div style={{
      backgroundColor: '#FFFFFF', border: '1px solid #E8E8E8',
      borderRadius: 30, width: '100%', maxWidth: 333,
      boxShadow: '0 0 0 0 #0000001F',
      overflow: 'clip', flexShrink: 0,
      height: 'fit-content'
    }}>
      <div style={{
        backgroundColor: '#1F1F1F',
        padding: '20px 24px',
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        <div style={{
          color: '#B2B2B2', fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif',
          fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
          lineHeight: '14px', textTransform: 'uppercase',
        }}>Journey Status</div>
        <div style={{
          color: '#FFFFFF', fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif',
          fontSize: 20, fontWeight: 700, lineHeight: '24px',
        }}>India Entry Progress</div>
      </div>

      <div style={{
        borderBottom: '1px solid #E8E8E8',
        padding: '24px',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            color: '#646463', fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif',
            fontSize: 13, fontWeight: 700, letterSpacing: '0.8px',
            lineHeight: '16px', textTransform: 'uppercase',
          }}>Completion</span>
          <span style={{
            color: '#00A82D', fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif',
            fontSize: 13, lineHeight: '16px',
          }}>{progressPercent}% complete</span>
        </div>

        <div style={{
          backgroundColor: '#E5E5E5', borderRadius: 2,
          height: 17, overflow: 'clip', position: 'relative',
        }}>
          <div style={{
            backgroundImage: 'linear-gradient(90deg, #32a846 32.14%, #238c36 67.86%)',
            backgroundOrigin: 'border-box',
            border: progressPercent > 0 ? '1px solid #30BF4B' : 'none',
            borderRadius: 2,
            height: '100%', width: `${progressPercent}%`,
            transition: 'width 0.3s ease',
          }} />
          {progressPercent > 0 && <div style={{
            position: 'absolute', left: `calc(${progressPercent}% - 3px)`, top: 4,
            width: 2, height: 8, backgroundColor: '#FFFFFF', borderRadius: 1,
            transition: 'left 0.3s ease',
          }} />}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{
            color: '#646463', fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif',
            fontSize: 13, fontWeight: 700, letterSpacing: '0.8px',
            lineHeight: '16px', textTransform: 'uppercase', flexShrink: 0,
          }}>Current {currentStep.name}</span>
          <span style={{
            color: '#1A1A1A', fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif',
            fontSize: 13, lineHeight: '16px', textAlign: 'right',
          }}>{currentStep.title}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            color: '#646463', fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif',
            fontSize: 13, fontWeight: 700, letterSpacing: '0.8px',
            lineHeight: '16px', textTransform: 'uppercase',
          }}>Questions</span>
          <span style={{
            color: '#1A1A1A', fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif',
            fontSize: 13, lineHeight: '16px',
          }}>{answeredCount}/{TOTAL_QUESTIONS} answered</span>
        </div>
      </div>

      <div style={{
        borderBottom: '1px solid #E8E8E8',
        padding: '24px',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <div style={{
          color: '#575757', fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif',
          fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
          lineHeight: '14px', textTransform: 'uppercase', marginBottom: 4,
        }}>Step Breakdown</div>

        {indiaData.map((step, i) => {
          const isActive = i === activeStepIndex;
          const answeredInIter = step.questions.filter((q) => answers[q.id] !== undefined).length;
          const totalInIter = step.questions.length;
          const unlocked = isStepUnlocked(i);

          if (isActive) {
            return (
              <div key={step.id} style={{
                backgroundColor: `${step.color}0D`, border: `1px solid ${step.borderColor || step.color}`,
                borderRadius: 8, padding: '14px',
                display: 'flex', flexDirection: 'column', gap: 4,
              }}>
                <div style={{
                  color: '#1A1A1A', fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif',
                  fontSize: 13, fontWeight: 700, letterSpacing: '0.02em', lineHeight: '16px',
                }}>{step.name}</div>
                <div style={{
                  color: '#3C3C3C', fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif',
                  fontSize: 12, letterSpacing: '0.03em', lineHeight: '140%',
                }}>{step.title}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{
                    color: '#888888', fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif',
                    fontSize: 12, lineHeight: '16px',
                  }}>{totalInIter} questions</span>
                  <span style={{
                    color: step.color, fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif',
                    fontSize: 12, letterSpacing: '0.02em', lineHeight: '16px', fontWeight: 700
                  }}>{answeredInIter} answered</span>
                </div>
              </div>
            );
          } else {
            return (
              <div key={step.id}
                className="step-item-inactive"
                onClick={() => { if (unlocked) onStepClick(i); }}
                style={{
                  backgroundColor: '#FFFFFF', border: '1px solid #E8E8E8',
                  borderRadius: 8, padding: '14px',
                  display: 'flex', gap: 4, justifyContent: 'space-between',
                  opacity: unlocked ? 0.6 : 0.3, cursor: unlocked ? 'pointer' : 'not-allowed',
                }}>
                <span style={{
                  color: '#1A1A1A', fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif',
                  fontSize: 13, fontWeight: 700, lineHeight: '16px',
                  display: 'flex', alignItems: 'center', gap: 6
                }}>
                  {step.name}
                  {!unlocked && (
                    <svg width="10" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  )}
                </span>
                <span style={{
                  color: '#888888', fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif',
                  fontSize: 12, lineHeight: '16px',
                }}>
                  {answeredInIter > 0 ? `${answeredInIter}/${totalInIter} answered` : `${totalInIter} questions`}
                </span>
              </div>
            );
          }
        })}
      </div>

      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{
          color: '#AEAEAE', fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif',
          fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
          lineHeight: '14px', textTransform: 'uppercase', marginBottom: 4,
        }}>Actions</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="sidebar-btn-reset" onClick={() => window.location.reload()}>Reset</button>
          <button 
            className="sidebar-btn-diagnostic"
            onClick={progressPercent === 100 ? onFinishDiagnostic : undefined}
            style={{ 
              opacity: progressPercent === 100 ? 1 : 0.5,
              cursor: progressPercent === 100 ? 'pointer' : 'not-allowed'
            }}
          >Show diagnostic</button>
        </div>
      </div>
    </div>
  );
}

export default function IndiaDiagnosticPage({ onBack }) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportReady, setReportReady] = useState(false);

  const currentStep = indiaData[activeStepIndex];

  const isStepUnlocked = (index) => {
    if (index === 0) return true;
    for (let i = 0; i < index; i++) {
      const step = indiaData[i];
      const answeredInStep = step.questions.filter((q) => {
        const ans = answers[q.id];
        return ans !== undefined && (!q.multi || ans.length > 0);
      }).length;
      if (answeredInStep < step.questions.length) {
        return false;
      }
    }
    return true;
  };

  const currentQuestion = currentStep.questions[activeQuestionIndex];

  const handleOptionClick = (optIndex) => {
    if (currentQuestion.multi) {
      const currentAns = answers[currentQuestion.id] || [];
      const newAns = currentAns.includes(optIndex)
        ? currentAns.filter(x => x !== optIndex)
        : [...currentAns, optIndex];
      setAnswers({ ...answers, [currentQuestion.id]: newAns });
    } else {
      setAnswers({ ...answers, [currentQuestion.id]: optIndex });
      setTimeout(() => {
        handleNext();
      }, 400); 
    }
  };

  const isSelected = (optIndex) => {
    const ans = answers[currentQuestion.id];
    if (currentQuestion.multi) {
      return Array.isArray(ans) && ans.includes(optIndex);
    }
    return ans === optIndex;
  };

  const handleNext = () => {
    if (activeQuestionIndex < currentStep.questions.length - 1) {
      setActiveQuestionIndex(activeQuestionIndex + 1);
    } else {
      handleNextStep();
    }
  };

  const handleNextStep = () => {
    if (activeStepIndex < indiaData.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
      setActiveQuestionIndex(0);
    } else {
      handleFinishDiagnostic();
    }
  };

  const handleFinishDiagnostic = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      setIsGeneratingReport(false);
      setReportReady(true);
    }, 2500);
  };

  const handleBackNavigation = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(activeQuestionIndex - 1);
    } else if (activeStepIndex > 0) {
      handlePrevStep();
    } else {
      onBack();
    }
  };

  const handlePrevStep = () => {
    if (activeStepIndex > 0) {
      const prevStep = indiaData[activeStepIndex - 1];
      setActiveStepIndex(activeStepIndex - 1);
      setActiveQuestionIndex(prevStep.questions.length - 1);
    }
  };

  const globalProgress = Math.round((Object.keys(answers).length / TOTAL_QUESTIONS) * 100);

  if (isGeneratingReport) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#F0F0F0', fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif' }}>
        <div className="spinner" style={{
          width: 48, height: 48, border: '4px solid #EAEAEA', borderTopColor: '#1A1A1A', borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <h2 style={{ marginTop: 24, fontSize: 24, color: '#1A1A1A', fontWeight: 700 }}>Synthesizing Intelligence...</h2>
        <p style={{ marginTop: 8, fontSize: 16, color: '#5F5F5F' }}>Generating your custom Ross INDX boardroom report.</p>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (reportReady) {
    return (
      <div style={{ padding: 48, minHeight: '100vh', backgroundColor: '#F0F0F0', fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif' }}>
         <div style={{ maxWidth: 800, margin: '0 auto', backgroundColor: '#FFF', padding: 48, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h1 style={{ fontSize: 32, color: '#1A1A1A', fontWeight: 700, marginBottom: 16 }}>India Entry Report Complete</h1>
            <p style={{ fontSize: 16, color: '#5F5F5F', lineHeight: '24px' }}>Based on your inputs across the 6 steps, your India Market Potential & Entry Strategy footprint has been calculated. Your organization shows strong technical fit for several consumer segments, but requires a robust compliance bridge for BIS and WPC gating.</p>

            <div style={{ marginTop: 32, padding: 24, backgroundColor: '#FAFAFA', border: '1px solid #EAEAEA', borderRadius: 8 }}>
               <div style={{ color: '#1A1A1A', fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Strategic Priorities</div>
               <ul style={{ color: '#3C3C3C', margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                 <li>Initiate BIS certification sequence immediately for mains-powered units.</li>
                 <li>Prioritize distributor-led entry for the first 18-month test phase.</li>
                 <li>Verify all functional claims with CDSCO guidelines for the beauty segment.</li>
               </ul>
            </div>

            <button style={{ marginTop: 32, padding: '12px 24px', backgroundColor: '#1A1A1A', color: '#FFF', borderRadius: 8, cursor: 'pointer', border: 'none', fontWeight: 600 }} onClick={onBack}>Return to Dashboard</button>
         </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      backgroundColor: '#F8F9FA',
      minHeight: '100vh', width: '100%',
      fontSize: 12, lineHeight: '16px',
    }}>

      {/* ── TOPBAR ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #EAEAEA',
        padding: '12px 48px',
        width: '100%', flexShrink: 0,
        flexWrap: 'wrap', gap: 16,
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24.508" height="24.508" rx="2" fill="#0A3055" />
              <path d="M14.465 12.242C12.896 13.77 11.394 15.37 9.823 16.895C9.679 17.036 9.571 17.151 9.431 17.287C9.213 17.499 8.962 17.679 8.783 17.927H4.599L10.251 12.243L4.528 6.558L8.782 6.559V6.558L14.465 12.242ZM20.469 12.244C18.901 13.772 17.397 15.372 15.826 16.897C15.682 17.038 15.574 17.152 15.435 17.288C15.216 17.501 14.966 17.68 14.786 17.929H10.603L16.255 12.245L10.532 6.56L14.786 6.561V6.56L20.469 12.244Z" fill="#3AB5FF" />
            </svg>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#0A3055' }}>INDX</span>
          </div>
          <div style={{ backgroundColor: '#DDDDDD', width: 1, height: 16, flexShrink: 0 }} />
          <span style={{
            color: '#1A1A1A', fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif',
            fontSize: 12, lineHeight: '16px',
          }}>
            India Fit Filter • Diagnostic
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="user-pill" style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: '4px 12px 4px 4px', border: '1px solid #EAEAEA', borderRadius: 6 }} onClick={() => setIsProfileOpen(!isProfileOpen)}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 26, height: 26, borderRadius: '50%',
              backgroundColor: '#DDEFFF', flexShrink: 0,
            }}>
              <span style={{
                color: '#079CEE', fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif', fontSize: 11, fontWeight: 700, lineHeight: '14px',
              }}>AB</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#1A1A1A', fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif', fontSize: 13, fontWeight: 700, lineHeight: '16px' }}>Alex Baker</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="#3C3C3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: isProfileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ flex: 1, padding: '40px 5%', width: '100%', boxSizing: 'border-box' }}>
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 26,
          alignItems: 'center', width: '100%', maxWidth: 1344, margin: '0 auto'
        }}>
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 35,
            width: '100%',
          }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button 
                onClick={handleBackNavigation}
                style={{
                  width: 28, height: 28, borderRadius: 6, border: '1px solid #C2C2C2',
                  backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  padding: 0
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                  viewBox="0 0 24 24" fill="none" stroke="#1F1F1F"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{
                  color: '#B2B2B2', fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif',
                  fontSize: 12, letterSpacing: '0.02em', lineHeight: '16px',
                }}>Dashboard  /</span>
                <span style={{
                  color: '#3C3C3C', fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif',
                  fontSize: 12, letterSpacing: '0.02em', lineHeight: '16px', fontWeight: 500
                }}>India Entry Diagnostic</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%' }}>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {indiaData.map((step, i) => {
                    const unlocked = isStepUnlocked(i);
                    const isActive = activeStepIndex === i;
                    return (
                      <button
                        key={step.id}
                        style={{
                          backgroundColor: isActive ? step.color : '#FFFFFF',
                          border: `1px solid ${isActive ? step.borderColor || step.color : '#E0E0E0'}`,
                          color: isActive ? '#FFFFFF' : '#5F5F5F',
                          opacity: unlocked ? 1 : 0.5,
                          cursor: unlocked ? 'pointer' : 'not-allowed',
                          padding: '8px 24px', borderRadius: '4px',
                          fontSize: 13, fontWeight: 600,
                          display: 'flex', alignItems: 'center', gap: 8,
                          transition: 'all 0.2s',
                          boxShadow: isActive ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                        }}
                        onClick={() => {
                          if (unlocked) {
                            setActiveStepIndex(i);
                            setActiveQuestionIndex(0);
                          }
                        }}
                        disabled={!unlocked}
                      >
                        {step.tab}
                        {!unlocked && (
                          <svg width="10" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>

                <StageProgressBar progress={globalProgress} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                <h1 style={{
                  color: '#1F1F1F', fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif',
                  fontSize: 28, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: '1.2',
                }}>
                  {currentStep.name} — {currentStep.title}
                </h1>
                <p style={{
                  color: '#666666', fontFamily: '"Georgia", serif', fontStyle: 'italic',
                  fontSize: 15, letterSpacing: '0.01em', lineHeight: '1.5', width: '100%', maxWidth: '800px'
                }}>
                  {currentStep.subtitle}
                </p>
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex', gap: 32, justifyContent: 'space-between',
            paddingInline: 0, width: '100%', alignItems: 'stretch',
            flexWrap: 'wrap'
          }}>

            <div style={{
              display: 'flex', flexDirection: 'column', gap: 30,
              justifyContent: 'space-between',
              flex: '1 1 600px', minWidth: 320, paddingInline: 8,
            }}>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
                <div style={{
                  display: 'flex', gap: 24, paddingBlock: 4, width: '100%',
                }}>
                  <div style={{ width: '100%' }}>
                    <div style={{
                      backgroundColor: '#FFFFFF', borderRadius: 30,
                      border: '1px solid #EAEAEA',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                      padding: '40px 48px',
                      display: 'flex', flexDirection: 'column', gap: 32,
                      overflow: 'clip',
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'space-between' }}>
                          <p style={{
                            color: '#1F1F1F', fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif',
                            fontSize: 20, fontWeight: 500, letterSpacing: '0.01em', lineHeight: '1.4',
                          }}>
                            {activeQuestionIndex + 1}. {currentQuestion.text}
                          </p>
                        </div>

                        {currentQuestion.hint && (
                          <div style={{
                            backgroundColor: 'rgba(0,128,128,0.04)',
                            border: '1px solid rgba(0,128,128,0.1)',
                            borderRadius: 8,
                            paddingBlock: 16, paddingInline: 20,
                            display: 'flex', flexDirection: 'column',
                          }}>
                            <p style={{
                              color: '#4A4A4A', fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif',
                              fontSize: 14, letterSpacing: '0.01em', lineHeight: '1.6',
                            }}>
                              {currentQuestion.hint}
                            </p>
                          </div>
                        )}
                      </div>

                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(2, 1fr)', 
                        gap: 16, width: '100%' 
                      }}>
                        {currentQuestion.options.map((opt, i) => {
                          const label = typeof opt === 'string' ? opt : opt.label;
                          const sublabel = typeof opt === 'string' ? null : opt.sub;
                          const selected = isSelected(i);
                          
                          if (currentQuestion.layout === 'chips') {
                            return (
                              <button
                                key={`${currentQuestion.id}-${i}`}
                                onClick={() => handleOptionClick(i)}
                                style={{
                                  backgroundColor: selected ? (currentStep.color || '#1A1A1A') : '#FFFFFF',
                                  color: selected ? '#FFFFFF' : '#3C3C3C',
                                  border: `1.5px solid ${selected ? (currentStep.color || '#1A1A1A') : '#EAEAEA'}`,
                                  borderRadius: 12, padding: '14px 28px',
                                  fontSize: 15, fontWeight: 500, cursor: 'pointer',
                                  transition: 'all 0.2s',
                                  display: 'flex', alignItems: 'center', gap: 10,
                                  boxShadow: selected ? '0 4px 8px rgba(0,0,0,0.1)' : '0 1px 2px rgba(0,0,0,0.02)'
                                }}
                              >
                                {label}
                                {currentQuestion.multi && selected && (
                                  <svg width="12" height="10" viewBox="0 0 10 8" fill="none">
                                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                              </button>
                            );
                          }

                          return (
                            <RadioOption
                              key={`${currentQuestion.id}-${i}`}
                              label={label}
                              sublabel={sublabel}
                              selected={selected}
                              onClick={() => handleOptionClick(i)}
                              multi={currentQuestion.multi}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex', justifyContent: 'flex-end',
                  gap: 8, paddingBlock: 24,
                }}>
                  <button 
                    onClick={handleBackNavigation} 
                    disabled={activeStepIndex === 0 && activeQuestionIndex === 0}
                    style={{
                      padding: '10px 20px', borderRadius: 8, border: '1px solid #D1D1D1',
                      backgroundColor: '#FFFFFF', color: '#1A1A1A', fontSize: 13, fontWeight: 700,
                      cursor: 'pointer', opacity: (activeStepIndex === 0 && activeQuestionIndex === 0) ? 0.4 : 1,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      fontFamily: '"Helvetica Neue", Helvetica, sans-serif'
                    }}
                  >Back</button>
                  <button 
                    onClick={handleNext}
                    disabled={!(answers[currentQuestion.id] !== undefined && (!currentQuestion.multi || answers[currentQuestion.id].length > 0))}
                    style={{
                      padding: '10px 20px', borderRadius: 8, border: '1px solid #D1D1D1',
                      backgroundColor: '#FFFFFF', color: '#1A1A1A', fontSize: 13, fontWeight: 700,
                      cursor: 'pointer',
                      opacity: (answers[currentQuestion.id] !== undefined && (!currentQuestion.multi || answers[currentQuestion.id].length > 0)) ? 1 : 0.4,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      fontFamily: '"Helvetica Neue", Helvetica, sans-serif'
                    }}
                  >Next</button>
                </div>
              </div>

            </div>

            <div style={{ display: 'flex', justifyContent: 'center', flex: '1 1 300px', maxWidth: 333, margin: '0 auto' }}>
              <JourneyStatus 
               answers={answers} 
               currentStep={currentStep} 
               activeStepIndex={activeStepIndex}
               onStepClick={(idx) => { setActiveStepIndex(idx); setActiveQuestionIndex(0); }}
               isStepUnlocked={isStepUnlocked}
               onFinishDiagnostic={handleFinishDiagnostic}
              />
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .nav-btn-v2:hover:not(:disabled) {
           background-color: #F9F9F9 !important;
           border-color: #C0C0C0 !important;
        }
        .sidebar-btn-v2:hover:not(:disabled) {
           opacity: 0.9 !important;
        }
        .sidebar-btn-diagnostic-v2 {
           background: #73C8FF;
           color: white;
           border: none;
           border-radius: 8px;
           padding: 10px 16px;
           font-weight: 600;
           font-size: 13px;
           flex: 1;
           cursor: pointer;
           transition: all 0.2s;
           box-shadow: 0 2px 4px rgba(115, 200, 255, 0.3);
        }
        .sidebar-btn-reset-v2 {
           background: #FFFFFF;
           color: #1A1A1A;
           border: 1px solid #EAEAEA;
           border-radius: 8px;
           padding: 10px 16px;
           font-weight: 600;
           font-size: 13px;
           cursor: pointer;
           transition: all 0.2s;
        }
      `}</style>
    </div>
  );
}
