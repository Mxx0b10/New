export const indiaData = [
  {
    id: 1,
    name: "STEP 1",
    tab: "Step 1",
    title: "Does your setup match India realities?",
    subtitle: "Strategic fit assessment before committing to entry mode or investment.",
    eyebrow: "Step 1 of 6 · 13 questions",
    color: '#9A142D',       
    borderColor: '#6A081B', 
    questions: [
      {
        id: "s1q1",
        text: "What type of business are you?",
        hint: "India treats consumer, retail, B2B and electronics businesses differently at every regulatory and operational layer. Your category determines your compliance framework from day one.",
        layout: "cards",
        options: ["Consumer", "Retail", "B2B", "Electronics"]
      },
      {
        id: "s1q2",
        text: "What best describes your product category?",
        hint: "This determines your regulatory framework — BIS, WPC, or CDSCO. Getting this wrong at the start creates delays of 6–18 months before you can legally sell in India.",
        layout: "cards",
        options: ["Footwear", "Apparel / Kidswear", "Furniture", "Audio electronics", "Kitchen appliances", "Cosmetics", "Eyewear", "Watches / Wearables", "Other"]
      },
      {
        id: "s1q3",
        text: "Does your product contain wireless radio technology?",
        hint: "Bluetooth, WiFi, or both trigger mandatory WPC certification in India. This is a hard regulatory gate — no certification means no legal import or sale.",
        layout: "cards",
        options: ["Bluetooth only", "WiFi only", "Both Bluetooth and WiFi", "Neither"]
      },
      {
        id: "s1q4",
        text: "Does your product plug into mains electricity?",
        hint: "Mains-powered products require BIS certification under the Compulsory Registration Scheme. This is non-negotiable and typically takes 3–6 months to obtain.",
        layout: "cards",
        options: ["Yes", "No"]
      },
      {
        id: "s1q5",
        text: "Where does your product sit in the market?",
        hint: "Price positioning in India is not a mirror of your home market. Indian import duties of 29–35% on many categories mean your Gulf or European price architecture often needs a full rebuild.",
        layout: "cards",
        options: ["Premium", "Bridge", "Revenue driver", "Brand builder", "Sourcing play", "Strategic presence"]
      },
      {
        id: "s1q6",
        text: "What is your primary objective for India?",
        hint: "Mixed objectives with insufficient runway is the most common structural failure in India entries. One clear primary objective produces better decisions at every subsequent step.",
        layout: "cards",
        multi: true,
        options: ["Revenue", "Brand", "Sourcing", "Strategic presence"]
      },
      {
        id: "s1q7",
        text: "How much investment can you commit over 24 months?",
        hint: "India entry timelines are almost always longer than planned. Brands that enter with low runway consistently make short-term decisions that damage long-term positioning — particularly on distributor selection and pricing.",
        layout: "cards",
        options: ["Low — under €200K", "Medium — €200K–€500K", "High — over €500K"]
      },
      {
        id: "s1q8",
        text: "How tightly must you control brand presentation?",
        hint: "High brand control requirements and high partner dependence are structurally incompatible in India's distribution landscape. One of them has to give — knowing which one now saves significant governance pain later.",
        layout: "cards",
        options: ["Low — channel handles it", "Medium — brand guidelines apply", "High — we control everything"]
      },
      {
        id: "s1q9",
        text: "How much operating complexity can you absorb?",
        hint: "India's regulatory, logistics, and partner environment adds operational complexity that most European brands underestimate by a factor of 2–3x compared to other emerging markets.",
        layout: "cards",
        options: ["Low — we need simple operations", "Medium — moderate complexity is fine", "High — we can handle full complexity"]
      },
      {
        id: "s1q10",
        text: "Is your product validated for India market conditions?",
        hint: "Unclear product readiness combined with aggressive scale ambition is one of the most reliably damaging combinations in India entry. Validate readiness before committing to scale timelines.",
        layout: "cards",
        options: ["Clear — validated for India", "Unclear — not yet validated"]
      },
      {
        id: "s1q11",
        text: "How much are you willing to adapt for the Indian market?",
        hint: "No willingness to localise and unclear product readiness leaves no path to fit. India's consumer and regulatory environment rewards brands that adapt — and consistently penalises those that do not.",
        layout: "cards",
        options: ["None — product stays as is", "Some — minor adaptations acceptable", "Material — significant adaptation possible"]
      },
      {
        id: "s1q12",
        text: "How reliant do you want to be on local India partners?",
        hint: "High partner dependence with high brand control requirements creates governance friction that typically surfaces 12–18 months into the engagement — after contracts are signed and relationships are established.",
        layout: "cards",
        options: ["Low — minimal partner dependence", "Medium — balanced reliance", "High — partner-led entry"]
      },
      {
        id: "s1q13",
        text: "How aggressively do you want to scale in India?",
        hint: "Aggressive scale ambition with low operational complexity tolerance is a structural mismatch. India rewards methodical build — brands that try to compress the timeline consistently overpay for speed and underdeliver on results.",
        layout: "cards",
        options: ["Small test — cautious start", "Meaningful — measured growth", "Aggressive — rapid scale"]
      }
    ]
  },
  {
    id: 2,
    name: "STEP 2",
    tab: "Step 2",
    title: "Which entry structure fits your situation?",
    subtitle: "Entry mode determines your cost base, speed, control, and exit options for the next 5 years.",
    eyebrow: "Step 2 of 6 · 8 questions",
    color: '#1A4A7A',
    borderColor: '#0E3060',
    questions: [
      {
        id: "s2q1",
        text: "How tightly must you govern the brand in India?",
        hint: "Entry mode and brand control are directly linked. High control requirements narrow your viable entry options significantly — and increase both setup cost and timeline.",
        layout: "cards",
        options: ["Low", "Medium", "High"]
      },
      {
        id: "s2q2",
        text: "How quickly must you create India market presence?",
        hint: "Speed pressure without sufficient runway forces premature commitment — to partners, channels, and price points — that is very difficult to reverse. Build speed into the plan, not the timeline.",
        layout: "cards",
        options: ["Low — 24+ months acceptable", "Medium — 12–24 months", "High — under 12 months"]
      },
      {
        id: "s2q3",
        text: "How much budget can be ring-fenced for India specifically?",
        hint: "Ring-fenced India budget is the single strongest predictor of entry success. Budgets competing with Gulf stabilisation or other markets consistently lose to short-term pressures.",
        layout: "cards",
        options: ["Low — under €200K", "Medium — €200K–€500K", "High — over €500K"]
      },
      {
        id: "s2q4",
        text: "What is your priority India channel?",
        hint: "Channel selection at entry determines your entire cost structure, margin stack, and brand positioning for the first 3 years. Changing channel mid-entry is expensive and disruptive.",
        layout: "cards",
        multi: true,
        options: ["D2C", "Marketplaces", "Retail", "B2B", "Hybrid"]
      },
      {
        id: "s2q5",
        text: "How comfortable are you relying on India partners?",
        hint: "Partner-led entry is fast and low-cost but creates dependency that is hard to unwind. Brand-led entry is slow and expensive but builds compounding value. Know which trade-off you are making.",
        layout: "cards",
        options: ["Low — prefer direct control", "Medium — balanced approach", "High — partner-led is fine"]
      },
      {
        id: "s2q6",
        text: "How critical is pricing control to your model?",
        hint: "India's grey market and marketplace discounting culture makes pricing discipline a structural challenge. If pricing authority is critical to your brand, it must be contractually protected from day one.",
        layout: "cards",
        options: ["Low — flexible on pricing", "Medium — guidelines matter", "High — strict MRP control required"]
      },
      {
        id: "s2q7",
        text: "How heavy are your service, returns, and operations?",
        hint: "High service complexity with a partner-led entry model creates customer experience risk that is very difficult to manage remotely. India's reverse logistics infrastructure is improving but still variable.",
        layout: "cards",
        options: ["Low — simple product, simple service", "Medium — moderate service load", "High — complex service requirements"]
      },
      {
        id: "s2q8",
        text: "How much can you adapt the product or offer for India?",
        hint: "No localisation willingness in a market that structurally rewards adaptation is a strategic liability — particularly in categories where Indian consumer expectations differ significantly from Gulf or European norms.",
        layout: "cards",
        options: ["None — no adaptation", "Some — minor adaptation", "Material — significant adaptation"]
      }
    ]
  },
  {
    id: 3,
    name: "STEP 3",
    tab: "Step 3",
    title: "Can your margins survive India's cost structure?",
    subtitle: "Duty stack, discount posture, returns, and channel pressure stress test before GTM commitment.",
    eyebrow: "Step 3 of 6 · 8 questions",
    color: '#2D6A4F',
    borderColor: '#1B4332',
    questions: [
      {
        id: "s3q1",
        text: "Where do you intend to position your product in India?",
        hint: "India's luxury and premium segments are growing fast but are structurally smaller than Gulf equivalents. Value positioning on Indian marketplaces is a race to the bottom that destroys brand equity built elsewhere.",
        layout: "cards",
        options: ["Premium", "Bridge", "Revenue driver", "Brand builder", "Sourcing play", "Strategic presence"]
      },
      {
        id: "s3q2",
        text: "What is your target India retail price (MRP)?",
        hint: "India's Maximum Retail Price is legally binding — printed on every product and the highest price you can legally charge. Duty, logistics, and margin stack determine whether your target MRP is commercially viable.",
        layout: "cards",
        options: ["₹3,000 – ₹10,000", "₹10,000 – ₹50,000", "₹50,000 – ₹2,00,000", "₹2,00,000 – ₹10,00,000", "Above ₹10,00,000"]
      },
      {
        id: "s3q3",
        text: "What is your expected discounting posture in India?",
        hint: "Heavy discounting on Indian marketplaces permanently anchors consumer price expectations. Once a brand discounts heavily in India, it is structurally very difficult to reposition upward — particularly in luxury and bridge categories.",
        layout: "cards",
        options: ["None — full price always", "Light — seasonal only", "Normal — standard retail discounts", "Heavy — discount-led strategy"]
      },
      {
        id: "s3q4",
        text: "What return rate do you expect in India?",
        hint: "India's e-commerce return rates in fashion and lifestyle categories run 25–40%. This is not a risk — it is a structural cost that must be built into the unit economics from the start.",
        layout: "cards",
        options: ["Low — under 10%", "Medium — 10–25%", "High — above 25%"]
      },
      {
        id: "s3q5",
        text: "Do you know your full India duty and landed cost?",
        hint: "Unclear duty exposure combined with a low MRP target is structurally unsafe for pricing. India's effective import duty on many luxury categories runs 29–35% — this alone can make a viable Gulf price point commercially unviable in India.",
        layout: "cards",
        options: ["Clear — full landed cost modelled", "Unclear — not yet calculated"]
      },
      {
        id: "s3q6",
        text: "How heavy is your logistics and service burden?",
        hint: "High logistics complexity in India adds 8–15% to landed cost in many categories. Combined with high return rates, it can eliminate margin entirely on lower price point products.",
        layout: "cards",
        options: ["Low — simple logistics", "Medium — moderate complexity", "High — complex fulfilment"]
      },
      {
        id: "s3q7",
        text: "What is your gross margin at target India MRP?",
        hint: "Channel margin in India runs 35–55% depending on channel. A gross margin below 60% at MRP leaves very little room for channel costs, marketing, and returns — particularly in retail and marketplace channels.",
        layout: "cards",
        options: ["Above 70%", "55–70%", "40–55%", "Below 40%"]
      },
      {
        id: "s3q8",
        text: "How heavy is your India demand creation investment expected to be?",
        hint: "Brand awareness in India for most European and Gulf brands is low to minimal. Building awareness from zero requires significant sustained marketing investment — typically 20–30% of India revenue in Years 1–2.",
        layout: "cards",
        options: ["Low — brand pulls demand", "Medium — standard marketing investment", "High — significant demand creation needed"]
      }
    ]
  },
  {
    id: 4,
    name: "STEP 4",
    tab: "Step 4",
    title: "What does your first 90 days actually require?",
    subtitle: "Convert entry intent into a concrete sprint scope — modules, deliverables, and start requirements.",
    eyebrow: "Step 4 of 6 · 7 questions",
    color: '#5B2C6F',
    borderColor: '#4A235A',
    questions: [
      {
        id: "s4q1",
        text: "What stage are you aiming for with this India entry?",
        hint: "Undefined entry intent leads to undefined resource allocation. A test requires different preparation to a launch — and a launch requires fundamentally different preparation to a scale play.",
        layout: "cards",
        options: ["Test — validate before committing", "Launch — build for market entry", "Scale — accelerate existing presence"]
      },
      {
        id: "s4q2",
        text: "What is your current best guess for entry structure?",
        hint: "Distributor-led entry is the fastest and most capital-efficient path for most European brands entering India for the first time. Owned entity is the highest control option but requires 6–9 months of entity setup before a single unit can be sold.",
        layout: "cards",
        options: ["Distributor-led", "Marketplace-first", "Owned India entity", "Hybrid or unsure"]
      },
      {
        id: "s4q3",
        text: "How complex is your category from a compliance and execution standpoint?",
        hint: "High category complexity requires sequential execution — compliance first, then distribution, then marketing. Brands that try to run these in parallel consistently create compliance gaps that surface at the worst possible moment.",
        layout: "cards",
        options: ["Low — straightforward entry", "Medium — moderate gating", "High — complex compliance and execution"]
      },
      {
        id: "s4q4",
        text: "How tightly must the brand be governed during entry?",
        hint: "High brand control combined with low operational complexity tolerance requires strict sequencing — you cannot maintain control across a complex partner network without the operational capacity to enforce it.",
        layout: "cards",
        options: ["Low — brand guidelines apply loosely", "Medium — moderate governance", "High — tight brand governance required"]
      },
      {
        id: "s4q5",
        text: "How much operating complexity can you absorb during entry?",
        hint: "Underestimating operational complexity at entry is the most common cause of India entry stalls. Build operational capacity before you need it — not after the partner relationship is already under pressure.",
        layout: "cards",
        options: ["Low — keep it simple", "Medium — manageable complexity", "High — full operational build"]
      },
      {
        id: "s4q6",
        text: "How committed is your India budget posture right now?",
        hint: "Exploratory budget posture produces exploratory results. India's market rewards committed capital — partners, distributors, and retail landlords all respond differently to brands with committed versus exploratory funding.",
        layout: "cards",
        options: ["Exploratory — budget not locked", "Committed — budget confirmed", "Aggressive — fully funded build"]
      },
      {
        id: "s4q7",
        text: "How much bandwidth does your leadership team have for India?",
        hint: "India entry requires active leadership bandwidth — not delegation to a junior team member or an external consultant. Markets that receive leadership attention in the first 18 months outperform those that don't by a consistent and significant margin.",
        layout: "cards",
        options: ["Low — limited senior bandwidth", "Medium — part-time leadership attention", "High — dedicated leadership bandwidth"]
      }
    ]
  },
  {
    id: 5,
    name: "STEP 5",
    tab: "Step 5",
    title: "Where will control leak in your partner model?",
    subtitle: "Identify governance gaps before you sign. Control leaks are very difficult to fix after the contract is in place.",
    eyebrow: "Step 5 of 6 · 9 questions",
    color: '#34495E',
    borderColor: '#2C3E50',
    questions: [
      {
        id: "s5q1",
        text: "How do you expect to enter India with a partner?",
        hint: "Master franchise and JV structures in India have the highest control leak risk — and the longest and most expensive exit process. Understand the exit before you sign the entry.",
        layout: "cards",
        options: [
          { label: "Distributor", sub: "Most common first-entry structure — manageable exit if non-exclusive" },
          { label: "Master franchise", sub: "High brand risk — franchise control in India is structurally weak" },
          { label: "JV or equity partner", sub: "Complex governance — misaligned incentives emerge at 18–24 months" },
          { label: "Marketplace operator", sub: "Lowest control risk — highest price discipline challenge" },
          { label: "Sales agent or rep", sub: "Light structure — limited brand control and limited accountability" },
          { label: "Unsure", sub: "Entering without a model defined is itself a risk signal" }
        ]
      },
      {
        id: "s5q2",
        text: "How tight does brand control need to be with your partner?",
        hint: "High brand control requirements with partner-led operations is the single most common governance tension in India entries. If brand control is high, the partner contract must specify enforcement mechanisms explicitly.",
        layout: "cards",
        options: ["Low — partner has discretion", "Medium — guidelines and approvals", "High — strict brand governance"]
      },
      {
        id: "s5q3",
        text: "How strict must your pricing and MRP discipline be?",
        hint: "India's marketplace culture creates constant downward price pressure. If strict MRP discipline is non-negotiable for your brand, it must be a contractual term with financial penalties — not a brand guideline.",
        layout: "cards",
        options: ["Flexible — pricing can vary", "Moderate — guidelines with some flexibility", "Strict — MRP discipline is non-negotiable"]
      },
      {
        id: "s5q4",
        text: "How many channels will your partner run simultaneously?",
        hint: "Omni-channel partner management in India — D2C, retail, and marketplace simultaneously — is operationally very complex. Most India distributors are strong in one channel and weak in others. Know which channel is actually their strength.",
        layout: "cards",
        options: ["Single channel — focused execution", "Multi-channel — two or three channels", "Omni — D2C, retail, and marketplace together"]
      },
      {
        id: "s5q5",
        text: "Who funds inventory and working capital?",
        hint: "Brands that fund inventory risk without operational control is the most dangerous capital structure in India. If the brand is funding the inventory, the brand must control the operations — these cannot be separated.",
        layout: "cards",
        options: [
          { label: "Partner funds mostly", sub: "Best structure — partner has skin in the game" },
          { label: "Shared funding", sub: "Viable if governance is clearly defined" },
          { label: "Brand funds mostly", sub: "High risk without matching operational control" },
          { label: "Unsure", sub: "Undefined working capital structure is a contract negotiation gap" }
        ]
      },
      {
        id: "s5q6",
        text: "Who controls customer experience and service?",
        hint: "Partner-led customer operations with brand-funded working capital is the riskiest structure in India distribution. The brand carries the financial risk but cannot control the outcome.",
        layout: "cards",
        options: ["Brand-led — we control the experience", "Partner-led — they control the experience", "Shared — defined responsibilities", "Unsure"]
      },
      {
        id: "s5q7",
        text: "What rights will your partner demand?",
        hint: "Territorial exclusivity in India is very difficult to exit — legally and commercially. If exclusivity is unavoidable, ensure the contract includes performance milestones with explicit reversion clauses.",
        layout: "cards",
        options: [
          { label: "Non-exclusive", sub: "Cleanest structure — maximum flexibility" },
          { label: "Exclusive by channel", sub: "Manageable with clear channel definitions" },
          { label: "Exclusive by territory", sub: "Highest lock-in risk — ensure performance milestones and exit clauses" },
          { label: "Unsure", sub: "Exclusivity terms must be resolved before signing" }
        ]
      },
      {
        id: "s5q8",
        text: "How easy is it to change partners if needed?",
        hint: "India partner exits are typically more expensive, more time-consuming, and more disruptive than anticipated. Build exit provisions into the original contract — not as a signal of distrust but as a sign of professional governance.",
        layout: "cards",
        options: ["Easy — non-exclusive, short notice period", "Medium — some contractual complexity", "Hard — long lock-in, complex exit", "Unsure"]
      },
      {
        id: "s5q9",
        text: "What does your partner primarily optimise for?",
        hint: "Partners optimising for short-term sales volume consistently make decisions that damage brand equity — discounting, channel proliferation, and service shortcuts. Incentive alignment must be structural, not aspirational.",
        layout: "cards",
        options: [
          { label: "Brand equity", sub: "Best alignment — partner protects long-term value" },
          { label: "Balanced — brand and revenue", sub: "Viable with clear governance" },
          { label: "Short-term sales volume", sub: "Highest misalignment risk — leads to discounting and channel damage" },
          { label: "Unsure", sub: "Incentive misalignment is the root cause of most India partner failures" }
        ]
      }
    ]
  },
  {
    id: 6,
    name: "STEP 6",
    tab: "Step 6",
    title: "What are your India regulatory hard gates?",
    subtitle: "BIS, labelling, claims exposure. Identify gating requirements before making GTM commitments.",
    eyebrow: "Step 6 of 6 · 7 questions",
    color: '#0A3055',
    borderColor: '#051B30',
    questions: [
      {
        id: "s6q1",
        text: "What is your broad product type?",
        hint: "Regulatory gating in India is category-specific. Electronics, cosmetics, and food trigger mandatory certification that cannot be bypassed. Knowing your category early allows you to sequence compliance before GTM — not in parallel.",
        layout: "cards",
        options: ["Apparel / Fashion", "Footwear", "Electronics / Tech", "Cosmetics / Beauty", "Food / Beverage", "Home / Furniture", "Watches / Jewellery", "Other"]
      },
      {
        id: "s6q2",
        text: "Does your product contain any restricted or regulated elements?",
        hint: "Restricted elements — certain chemicals, materials, or functional claims — can trigger import bans or mandatory testing that adds 6–12 months to entry timelines. Identify these before any GTM commitment is made.",
        layout: "cards",
        options: ["None — no restricted elements", "Possibly — needs verification", "Yes — confirmed restricted elements", "Unsure — not yet checked"]
      },
      {
        id: "s6q3",
        text: "Do you know whether Indian standards apply to your product?",
        hint: "BIS certification under the Compulsory Registration Scheme applies to over 400 product categories. If your product falls within scope, BIS is a hard gate — you cannot legally import or sell without it.",
        layout: "cards",
        options: [
          { label: "Clear and confirmed — standards mapped", sub: "Strongest position — certification timeline can be planned" },
          { label: "Possibly applicable — needs check", sub: "Verify before any GTM commitment" },
          { label: "Likely applicable — not yet actioned", sub: "Hard gate — must be resolved before import" },
          { label: "Unclear — no standards review done", sub: "Cannot proceed without this analysis" }
        ]
      },
      {
        id: "s6q4",
        text: "Can you meet India labelling requirements quickly?",
        hint: "India's labelling rules require specific information in English and Hindi — including country of origin, importer details, MRP, and net quantity. Non-compliance at import results in customs holds and potential product destruction.",
        layout: "cards",
        options: ["Ready — labelling compliant now", "Needs work — changes required", "Unclear — labelling not yet reviewed"]
      },
      {
        id: "s6q5",
        text: "What is your marketing claims risk level?",
        hint: "Strong functional claims — particularly in cosmetics, health, and electronics — trigger ASCI scrutiny and potential CDSCO review in India. Claims that are standard in Europe can be classified as medical claims in India and require separate approval.",
        layout: "cards",
        options: ["Low — no strong functional claims", "Medium — some claims need review", "High — strong functional claims throughout"]
      },
      {
        id: "s6q6",
        text: "How complex is your product packaging?",
        hint: "Multi-language inserts, multi-component packaging, and import-specific labelling overlays all add cost and lead time to India entry. Simple packaging significantly reduces compliance friction at customs.",
        layout: "cards",
        options: ["Low — simple single-component packaging", "Medium — moderate complexity", "High — multi-component, multi-language, complex"]
      },
      {
        id: "s6q7",
        text: "How strong is your product documentation and traceability?",
        hint: "Test reports, technical files, and traceability documentation are mandatory for BIS, WPC, and CDSCO certification. Weak documentation is the single biggest cause of certification delays — typically adding 3–6 months to timelines.",
        layout: "cards",
        options: [
          { label: "Strong — test reports, technical files, full traceability", sub: "Best position — certification process can move fast" },
          { label: "Medium — partial documentation available", sub: "Gaps need to be identified and closed before applying" },
          { label: "Weak — limited documentation exists", sub: "Documentation build is required before any certification application" },
          { label: "Unclear — documentation status unknown", sub: "Audit documentation before making any GTM commitments" }
        ]
      }
    ]
  }
];
