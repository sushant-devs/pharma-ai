export interface Message {
  role: 'user' | 'assistant';
  content?: string;
  stepId?: string;
}

export const INVOLEAD_DEMO_DATA = {
  steps: [
    // ─────────────────────────────────────────────────────────────
    // STEP 1 — Quarterly Overview
    // ─────────────────────────────────────────────────────────────
    {
      id: "quarterly-overview",
      userPrompt: "Give me a quarterly overview of Tecentriq's performance",
      aiResponse:
        "Here's a summary of the key performance indicators for Tecentriq for Q2 2026 across priority oncology markets. The data shows concerning trends across all major metrics with an 11% decline in prescriptions and 19% drop in new patient starts.",
      hasAlert: {
        type: "critical",
        text: "Tecentriq is losing ground across all key metrics. Prescriptions down 11%, new patient starts down 19%, Share of Voice vs. Keytruda declining. Immediate action required.",
      },
      hasDiagnosis:
        "InvoLead has detected critical misalignments in your marketing strategy. Navigate to the MARS module to see detailed channel efficiency analysis, or visit Content Effectiveness to understand persona-content mismatches affecting your highest-value HCPs.",
      tableData: [
        { metric: "Total Prescriptions (TRx)",      target: "48,500",   actual: "43,200",   var: "-10.9%" },
        { metric: "Revenue (USD)",                   target: "$385M",    actual: "$347M",    var: "-9.9%"  },
        { metric: "New Patient Starts (NBRx)",       target: "12,800",   actual: "10,400",   var: "-18.8%" },
        { metric: "Email Open Rate",                 target: "32%",      actual: "24%",      var: "-25.0%" },
        { metric: "Rep-Triggered Email CTR",         target: "4.8%",     actual: "3.1%",     var: "-35.4%" },
        { metric: "Congress Engagement Score",       target: "78/100",   actual: "62/100",   var: "-20.5%" },
        { metric: "HCP Digital Portal Visits",      target: "95,000",   actual: "71,000",   var: "-25.3%" },
        { metric: "Share of Voice vs. Keytruda",     target: "42%",      actual: "34%",      var: "-19.0%" },
      ],
      insightDashboard: {
        tiles: [
          { label: "Total Prescriptions (TRx)",  value: "43,200",  target: "48,500",  variance: "-10.9%", color: "#EF4444" },
          { label: "Revenue (USD)",               value: "$347M",   target: "$385M",   variance: "-9.9%",  color: "#F97316" },
          { label: "New Patient Starts (NBRx)",   value: "10,400",  target: "12,800",  variance: "-18.8%", color: "#EF4444" },
          { label: "Email Open Rate",             value: "24%",     target: "32%",     variance: "-25.0%", color: "#EF4444" },
          { label: "Rep-Triggered Email CTR",     value: "3.1%",    target: "4.8%",    variance: "-35.4%", color: "#DC2626" },
          { label: "Congress Engagement Score",   value: "62/100",  target: "78/100",  variance: "-20.5%", color: "#EF4444" },
        ],
        charts: [
          {
            type: "line",
            title: "Prescription Trend (TRx)",
            strokeColor: "#EF4444",
            data: [
              { m: "Nov", v: 45000 },
              { m: "Dec", v: 44800 },
              { m: "Jan", v: 44200 },
              { m: "Feb", v: 43200 },
            ],
          },
          {
            type: "line",
            title: "Revenue Trend ($M)",
            strokeColor: "#F97316",
            data: [
              { m: "Nov", v: 385 },
              { m: "Dec", v: 375 },
              { m: "Jan", v: 365 },
              { m: "Feb", v: 347 },
            ],
          },
        ],
      },
      suggestions: [
        "What is driving the decline?",
        "Where are our marketing budgets invested?",
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // STEP 2 — Budget & Channel Efficiency (Market Mix Modelling)
    // ─────────────────────────────────────────────────────────────
    {
      id: "budget-efficiency",
      userPrompt:
        "What is driving the decline, Where are our marketing budget being invested heavily?",
      aiResponse:
        "I've completed extracting the Market Mix Modeling insights for Tecentriq across your top 15 markets. Total marketing-attributed revenue stands at approximately 38% of total sales, with Base Sales accounting for the remaining 62%. Here's the channel-level decomposition with our new Efficiency Index. Anything above 0.50 is efficient — below that you are overspending.",
      findings: [
        {
          type: "green",
          text: "Rep-Triggered Email has the highest efficiency (0.93) but declining performance — this is a content quality problem, not a channel problem.",
          module: "Market Mix Modelling",
        },
        {
          type: "yellow",
          text: "Digital Advertising (0.30) and Peer-to-Peer (0.27) have hit saturation. 18% of budget is generating diminishing returns.",
          module: "Market Mix Modelling",
        },
        {
          type: "yellow",
          text: "Market Performance insights reveal a 28% surge in oncologist portal searches and social discussions around combination therapy tolerability over 90 days. Current campaign messaging does not address this topic.",
          module: "Market Performance",
        },
      ],
      aiRecommendation:
        "Shift 35% of Digital Advertising and P2P budgets into Rep-Triggered Email and HCP Portal Content. But first your content needs to be fixed. This reallocation could improve marketing-attributed revenue by 8–12%.",
      tableData: [
        { channel: "Face-to-Face Detailing",           contribution: "11.8%", spendShare: "28%", efficiency: "0.42" },
        { channel: "Rep-Triggered Email",              contribution: "7.4%",  spendShare: "8%",  efficiency: "0.93" },
        { channel: "Medical Science Liaison (MSL)",    contribution: "5.2%",  spendShare: "12%", efficiency: "0.43" },
        { channel: "Sponsored Events & Congresses",    contribution: "4.6%",  spendShare: "15%", efficiency: "0.31" },
        { channel: "Digital Advertising",              contribution: "3.3%",  spendShare: "11%", efficiency: "0.30" },
        { channel: "Non-Personal Promotion (NPP)",     contribution: "2.8%",  spendShare: "6%",  efficiency: "0.47" },
        { channel: "Promotional Emails",               contribution: "2.1%",  spendShare: "5%",  efficiency: "0.42" },
        { channel: "Peer-to-Peer Programs",            contribution: "1.9%",  spendShare: "7%",  efficiency: "0.27" },
        { channel: "HCP Portal Content",               contribution: "1.2%",  spendShare: "4%",  efficiency: "0.30" },
        { channel: "Competitor Impact (Keytruda + Opdivo)", contribution: "5.6%", spendShare: "—", efficiency: "—" },
        { channel: "Base Sales",                       contribution: "62%",   spendShare: "—",   efficiency: "—" },
      ],
      insightDashboard: {
        tiles: [
          { label: "Rep Email Efficiency",   value: "0.93", target: "0.90", variance: "+3.3%",  color: "#10B981" },
          { label: "Digital Ads Efficiency", value: "0.30", target: "0.50", variance: "-40%",   color: "#EF4444" },
          { label: "Events Efficiency",      value: "0.31", target: "0.50", variance: "-38%",   color: "#F97316" },
          { label: "P2P Efficiency",         value: "0.27", target: "0.40", variance: "-32.5%", color: "#DC2626" },
        ],
        charts: [
          {
            type: "bar-compare",
            title: "Optimized Budget Reallocation (%)",
            currentColor: "#A4A4A8",
            optimizedColor: "#3B82F6",
            data: [
              { name: "F2F\nDetailing",  current: 28, optimized: 21 },
              { name: "Rep\nEmail",      current: 8,  optimized: 14 },
              { name: "MSL",             current: 12, optimized: 11 },
              { name: "Events",          current: 15, optimized: 12 },
              { name: "Digital\nAds",   current: 11, optimized: 7  },
              { name: "Promo\nEmail",   current: 5,  optimized: 10 },
              { name: "P2P",             current: 7,  optimized: 4  },
              { name: "Portal",          current: 4,  optimized: 9  },
            ],
          },
          {
            type: "horizontal-bar",
            title: "Channel Decomposition (Market Mix Model)",
            colors: {
              "F2F Detailing": "#1E40AF",
              "Rep Email":     "#3B82F6",
              "MSL":           "#60A5FA",
              "Events":        "#93C5FD",
              "Digital Ads":   "#BFDBFE",
              "Promo Email":   "#DBEAFE",
            },
            data: [
              { name: "F2F Detailing", actual: 11.8, potential: 22 },
              { name: "Rep Email",     actual: 7.4,  potential: 14 },
              { name: "MSL",           actual: 5.2,  potential: 10 },
              { name: "Events",        actual: 4.6,  potential: 12 },
              { name: "Digital Ads",   actual: 3.3,  potential: 7  },
              { name: "Promo Email",   actual: 2.1,  potential: 4  },
            ],
          },
        ],
      },
      suggestions: [
        "Show me the performance of content engagement KPI",
        "Compare channel performance",
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // STEP 3 — Content Performance
    // ─────────────────────────────────────────────────────────────
    {
      id: "content-performance",
      userPrompt: "Show me the performance of content engagement KPI",
      aiResponse:
        "I have analyzed your 47 active Tecentriq campaign assets and cross-referenced them with digital engagement signals across all channels. The 90-day trend analysis shows a concerning 28% surge in oncologist portal searches around combination therapy tolerability, yet your current content portfolio doesn't address this demand.",
      hasAlert: {
        type: "critical",
        text: "Critical content gap: 28% surge in combination therapy tolerability searches. Your current messaging does not address this topic. 73% of portal queries are unaddressed.",
      },
      aiInsight:
        "73% of portal search queries in the last 30 days contain keywords your content does not address. Competitor content on the same topics is being shared 4.2x more between HCPs on medical forums.",
      tableData: [
        { metric: "Email CTR",                  threeMoAgo: "4.8%",      current: "3.1%",       signal: "HCPs clicking but bouncing in <10 sec" },
        { metric: "Avg Time on Content",        threeMoAgo: "2.4 min",   current: "1.1 min",    signal: "Scroll abandonment at paragraph 2" },
        { metric: "Content Share Rate",         threeMoAgo: "8.2%",      current: "3.7%",       signal: "Peer sharing shifted to Competitor assets" },
        { metric: "Banner Interaction",         threeMoAgo: "1.9%",      current: "0.8%",       signal: "Ad fatigue – same creative >90 days" },
        { metric: "Portal Downloads",           threeMoAgo: "4,200/mo",  current: "1,800/mo",   signal: "Search queries = tolerability, no matching content" },
        { metric: "Conversion to Sample Req.",  threeMoAgo: "6.1%",      current: "4.3%",       signal: "Drop-off at clinical data page – too dense" },
      ],
      insightDashboard: {
        tiles: [
          { label: "Total Searches (90d)", value: "26,850", trend: "+28%",    color: "#3B82F6" },
          { label: "Forum Mentions",       value: "18,420", trend: "+31%",    color: "#8B5CF6" },
          { label: "Content Gap",          value: "73%",    trend: "Critical", color: "#EF4444" },
        ],
        charts: [
          {
            type: "line",
            title: "90-Day Trend: HCP Portal Searches & Forum Mentions",
            seriesColors: {
              "Portal Searches": "#3B82F6",
              "Forum Mentions":  "#8B5CF6",
            },
            data: [
              { w: "W2",  portal: 1200, forum: 980  },
              { w: "W4",  portal: 1500, forum: 1150 },
              { w: "W6",  portal: 1890, forum: 1520 },
              { w: "W8",  portal: 2300, forum: 1850 },
              { w: "W10", portal: 2750, forum: 2150 },
              { w: "W12", portal: 3000, forum: 2400 },
            ],
          },
          {
            type: "pie",
            title: "Top Search Topics (Last 30 Days)",
            data: [
              { name: "Combination Therapy Tolerability", value: 28, color: "#EF4444" },
              { name: "Overall Survival Data",            value: 22, color: "#F97316" },
              { name: "Treatment Guidelines",             value: 17, color: "#8B5CF6" },
              { name: "Safety Profile",                   value: 15, color: "#22C55E" },
              { name: "Patient Quality of Life",          value: 16, color: "#3B82F6" },
            ],
          },
          {
            type: "horizontal-bar",
            title: "Content Archetype Analysis",
            colors: {
              "Current %":   "#EF4444",
              "Benchmark %": "#22C55E",
            },
            data: [
              { archetype: "Monotone",    current: 68, benchmark: 25 },
              { archetype: "Structured",  current: 17, benchmark: 35 },
              { archetype: "Informative", current: 9,  benchmark: 25 },
              { archetype: "Expressive",  current: 6,  benchmark: 15 },
            ],
          },
          {
            type: "scatter",
            title: "Portfolio Imbalance vs Benchmark Deviation",
            data: [
              { x: 25, y: 43,  size: 68, name: "Monotone",    color: "#22C55E" },
              { x: 35, y: -18, size: 17, name: "Structured",  color: "#3B82F6" },
              { x: 25, y: -16, size: 9,  name: "Informative", color: "#F97316" },
              { x: 15, y: -9,  size: 6,  name: "Expressive",  color: "#EF4444" },
            ],
          },
        ],
      },
      suggestions: [
        "Compare our content archetype with the recommended benchmark",
        "How is the audience tagged within the content?",
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // STEP 4 — Content vs Benchmark
    // ─────────────────────────────────────────────────────────────
    {
      id: "content-benchmark",
      userPrompt: "Compare our content archetype with the recommended benchmark",
      aiResponse:
        "Content Archetype Analysis reveals your portfolio is heavily skewed toward monotone layouts (68% vs. 25% benchmark), indicating low design diversity that may limit engagement and comprehension for HCP audiences. Underinvestment in structured and informative assets suggests a missed opportunity to deliver clinically rich, decision-support content aligned with industry standards.",
      aiInsight:
        "Content portfolio is heavily skewed toward monotone layouts (68% vs. 25% benchmark). Underinvestment in structured and informative assets suggests a missed opportunity to deliver clinically rich, decision-support content aligned with industry standards.",
      tableData: [
        { archetype: "Monotone Layout",     currentAssets: "68% (32 assets)", benchmark: "25%", gap: "Over-indexed by 43pts"  },
        { archetype: "Structured Layout",   currentAssets: "17% (8 assets)",  benchmark: "35%", gap: "Under-indexed by 18pts" },
        { archetype: "Informative Layout",  currentAssets: "9% (4 assets)",   benchmark: "25%", gap: "Under-indexed by 16pts" },
        { archetype: "Expressive Layout",   currentAssets: "6% (3 assets)",   benchmark: "15%", gap: "Under-indexed by 9pts"  },
      ],
      insightDashboard: {
        tiles: [
          { label: "Monotone Assets",    value: "68%",  target: "25%", variance: "+43pts Over",  color: "#EF4444" },
          { label: "Structured Assets",  value: "17%",  target: "35%", variance: "-18pts Under", color: "#DC2626" },
          { label: "Informative Assets", value: "9%",   target: "25%", variance: "-16pts Under", color: "#F97316" },
          { label: "Expressive Assets",  value: "6%",   target: "15%", variance: "-9pts Under",  color: "#EA580C" },
        ],
        charts: [
          {
            type: "bar-compare",
            title: "Content Archetype: Current vs Benchmark (%)",
            currentColor: "#EF4444",
            optimizedColor: "#22C55E",
            data: [
              { name: "Monotone",    current: 68, optimized: 25 },
              { name: "Structured",  current: 17, optimized: 35 },
              { name: "Informative", current: 9,  optimized: 25 },
              { name: "Expressive",  current: 6,  optimized: 15 },
            ],
          },
        ],
      },
      suggestions: [
        "How is the audience tagged within the content?",
        "Check messaging & tone of the content",
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // STEP 5 — Audience Tagging
    // ─────────────────────────────────────────────────────────────
    {
      id: "audience-tagging",
      userPrompt: "How is the audience tagged within the content?",
      aiResponse:
        "Auto Tag Audience Alignment analysis shows content targeting is misaligned with influence — high-prescribing oncology specialists (45% of Rx value) are under-targeted while lower-impact general prescribers receive the majority of content. KOLs and thought leaders remain significantly underserved, limiting opportunities to influence clinical opinion and drive broader adoption.",
      aiInsight:
        "Content targeting is misaligned with influence. High-prescribing oncology specialists (45%) are under-targeted while lower-impact general prescribers receive the majority of content. KOLs and thought leaders remain significantly underserved.",
      tableData: [
        { audience: "General Prescribers",      contentRelevance: "52%", prescribingPower: "22%", misalignment: "Over-targeted by 30pts"  },
        { audience: "Oncology Specialists",      contentRelevance: "18%", prescribingPower: "45%", misalignment: "Under-targeted by 27pts" },
        { audience: "KOLs / Thought Leaders",    contentRelevance: "8%",  prescribingPower: "20%", misalignment: "Under-targeted by 12pts" },
        { audience: "Healthcare Support Staff",  contentRelevance: "22%", prescribingPower: "13%", misalignment: "Over-targeted by 9pts"   },
      ],
      insightDashboard: {
        tiles: [
          { label: "Oncology Specialists Content", value: "18%",  target: "45%", variance: "-27pts Under", color: "#EF4444" },
          { label: "KOL Content Coverage",         value: "8%",   target: "20%", variance: "-12pts Under", color: "#DC2626" },
          { label: "General Prescribers Content",  value: "52%",  target: "22%", variance: "+30pts Over",  color: "#F97316" },
        ],
        charts: [
          {
            type: "bar-compare",
            title: "Audience Targeting: Content Share vs Prescribing Power (%)",
            currentColor: "#EF4444",
            optimizedColor: "#3B82F6",
            data: [
              { name: "General\nPrescribers",  current: 52, optimized: 22 },
              { name: "Oncology\nSpecialists", current: 18, optimized: 45 },
              { name: "KOLs /\nLeaders",       current: 8,  optimized: 20 },
              { name: "Support\nStaff",        current: 22, optimized: 13 },
            ],
          },
        ],
      },
      suggestions: [
        "Check messaging & tone of the content",
        "Show me HCP engagement  ",
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // STEP 6 — Messaging & Tone Analysis
    // ─────────────────────────────────────────────────────────────
    {
      id: "messaging-tone",
      userPrompt: "Check messaging & tone of the content",
      aiResponse:
        "Content Feature List analysis reveals significant gaps in scientific innovation messaging and treatment experience narratives, suggesting the brand is not fully communicating its differentiating science. Engagement may be limited by weak persuasive tone — action-oriented, evidence-based messaging scores far below target, indicating missed opportunities to drive physician action.",
      aiInsight:
        "While core clinical value messaging is close to target, significant gaps in scientific innovation and treatment experience narratives suggest the brand is not fully communicating its differentiating science. Action-oriented messaging scores far below target.",
      tableData: [
        { tagSource: "Key Messages", derivedFeature: "Core Clinical Value & Patient Benefit",         score: 72, target: 80, status: "Near target"    },
        { tagSource: "Key Messages", derivedFeature: "Scientific Innovation & Novel Mechanisms",       score: 31, target: 75, status: "CRITICAL GAP"   },
        { tagSource: "Key Messages", derivedFeature: "Enhanced Treatment Experience & Safety",         score: 28, target: 70, status: "CRITICAL GAP"   },
        { tagSource: "Key Messages", derivedFeature: "Addressing Unmet Needs & Expanding Access",      score: 44, target: 65, status: "Below target"   },
        { tagSource: "Tone",         derivedFeature: "Action-Oriented & Evidence-Based Persuasive",    score: 22, target: 70, status: "CRITICAL GAP"   },
        { tagSource: "Tone",         derivedFeature: "Evidence-Driven & Foundational",                 score: 78, target: 75, status: "On target"      },
        { tagSource: "Tone",         derivedFeature: "Relationship-Building & Empathetic",             score: 35, target: 55, status: "Below target"   },
        { tagSource: "Tone",         derivedFeature: "Value-Oriented & Educational",                   score: 67, target: 65, status: "On target"      },
      ],
      insightDashboard: {
        tiles: [
          { label: "Scientific Innovation Gap", value: "75 vs 31", trend: "CRITICAL GAP", color: "#DC2626" },
          { label: "Treatment Experience Gap",  value: "70 vs 28", trend: "CRITICAL GAP", color: "#DC2626" },
          { label: "Action-Oriented Tone Gap",  value: "70 vs 22", trend: "CRITICAL GAP", color: "#DC2626" },
          { label: "Core Clinical Value",       value: "80 vs 72", trend: "Near Target",  color: "#22C55E" },
        ],
        charts: [
          {
            type: "horizontal-bar",
            title: "Key Message Scores: Current vs Target",
            colors: {
              "Current Score": "#3B82F6",
              "Target Score":  "#22C55E",
            },
            data: [
              { name: "Core Clinical Value",          current: 80, target: 72 },
              { name: "Scientific Innovation",        current: 75, target: 31 },
              { name: "Treatment Experience & Safety",current: 70, target: 28 },
              { name: "Unmet Needs & Access",         current: 65, target: 44 },
            ],
          },
          {
            type: "horizontal-bar",
            title: "Tone Scores: Current vs Target",
            colors: {
              "Current Score": "#8B5CF6",
              "Target Score":  "#22C55E",
            },
            data: [
              { name: "Action-Oriented Persuasive", current: 70, target: 22 },
              { name: "Evidence-Driven Foundational",current: 75, target: 78 },
              { name: "Relationship-Building",       current: 55, target: 35 },
              { name: "Value-Oriented Educational",  current: 65, target: 67 },
            ],
          },
        ],
      },
      suggestions: [
        "Show me HCP engagement  ",
        "Simulate optimal strategy",
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // STEP 7 — HCP Persona Engagement
    // ─────────────────────────────────────────────────────────────
    {
      id: "persona-engagement",
      userPrompt: "Show me HCP engagement  ",
      aiResponse:
        "High-prescribing personas show the lowest engagement and longest CRM gaps, indicating the most valuable HCP are significantly under-engaged. Innovative Leaders, who drive 31% of prescriptions, have only 41% engagement — a critical gap that demands immediate strategic intervention.",
      findings: [
        {
          type: "yellow",
          text: "Innovative Leaders (31% of Rx value) show lowest engagement at 41%. This is your highest-value, most under-engaged segment.",
          module: "Persona Analytics",
        },
        {
          type: "yellow",
          text: "Healthcare Leaders have 18% population but drive 27% of revenue — average CRM engagement is only 38%.",
          module: "CRM Analysis",
        },
        {
          type: "green",
          text: "Conventional Practitioners show highest engagement (67%) but only drive 18% of value — current focus is misaligned.",
          module: "Engagement Metrics",
        },
      ],
      aiRecommendation:
        "Redirect 40% of engagement resources from Conventional Practitioners to Innovative Leaders and Healthcare Leaders. Implement high-touch digital strategy for top prescribers. Projected engagement improvement: +25% for high-value personas, +18% revenue uplift.",
      tableData: [
        { persona: "Conventional Practitioner", population: "34% (17,000)", rxValue: "18%", engagement: "67%", daSenseActivity: "Low digital; prefers F2F",          crmLastTouch: "Avg 12 days", priority: "Medium"   },
        { persona: "Compassionate Partner",      population: "26% (13,000)", rxValue: "24%", engagement: "58%", daSenseActivity: "Moderate; email-responsive",         crmLastTouch: "Avg 18 days", priority: "High"     },
        { persona: "Innovative Leader",          population: "22% (11,000)", rxValue: "31%", engagement: "41%", daSenseActivity: "High digital; portal-heavy",          crmLastTouch: "Avg 34 days", priority: "Critical" },
        { persona: "Healthcare Leader",          population: "18% (9,000)",  rxValue: "27%", engagement: "38%", daSenseActivity: "High digital; congress-focused",      crmLastTouch: "Avg 41 days", priority: "Critical" },
      ],
      insightDashboard: {
        tiles: [
          { label: "Innovative Leaders Rx Value", value: "31%", target: "20%", variance: "+Rx Value", color: "#EF4444" },
          { label: "Their Engagement",            value: "41%", target: "65%", variance: "-Gap",       color: "#DC2626" },
          { label: "Healthcare Leaders Rx Value", value: "27%", target: "20%", variance: "+Rx Value",  color: "#F97316" },
          { label: "Their Engagement",            value: "38%", target: "60%", variance: "-Gap",       color: "#EA580C" },
        ],
        charts: [
          {
            type: "bubble",
            title: "Persona Influence vs Engagement Gap",
            data: [
              { x: 34, y: 67, z: 18, name: "Conventional",   color: "#10B981" },
              { x: 26, y: 58, z: 24, name: "Compassionate",  color: "#3B82F6" },
              { x: 22, y: 41, z: 31, name: "Innovative",     color: "#EF4444" },
              { x: 18, y: 38, z: 27, name: "Healthcare Ldr", color: "#F97316" },
            ],
          },
          {
            type: "bar",
            title: "Engagement Gap by Persona (Target vs Current)",
            colors: {
              "Current": "#A4A4A8",
              "Target":  "#3B82F6",
            },
            data: [
              { persona: "Conventional",    current: 67, target: 65 },
              { persona: "Compassionate",   current: 58, target: 62 },
              { persona: "Innovative",      current: 41, target: 65 },
              { persona: "Healthcare Ldr",  current: 38, target: 62 },
            ],
          },
        ],
      },
      suggestions: [
        "Simulate an optimal strategy",
        "View CRM recommendations",
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // STEP 8 — Simulate Optimal Strategy
    // ─────────────────────────────────────────────────────────────
    {
      id: "simulate-strategy",
      userPrompt: "Simulate an optimal strategy",
      aiResponse:
        "Simulation suggests performance gains could come from shifting focus toward specialists and KOLs while diversifying content beyond survival messaging to include tolerability, combination therapy, and QoL narratives. A balanced content archetype and more action-oriented tone, combined with rep-triggered email and portal engagement, could better align messaging with high-value physician behavior.",
      aiInsight:
        "A balanced content archetype mix and more action-oriented tone, combined with rep-triggered email and portal engagement, aligns better with high-value physician behavior and could yield significant uplift.",
      tableData: [
        { parameter: "Content Focus",    currentState: "Overall Survival only",                    simulatedChange: "Add Tolerability, Combination Therapy, QoL (DA Sense signals)" },
        { parameter: "Archetype Mix",    currentState: "68% Monotone",                             simulatedChange: "30% Monotone, 35% Informative, 20% Engaging, 15% Structured" },
        { parameter: "Audience Targeting", currentState: "52% Conventional Practitioner",          simulatedChange: "45% Specialists, 25% KOLs, 20% Prescribers, 10% Support" },
        { parameter: "Tone",             currentState: "Evidence-Driven dominant",                 simulatedChange: "Add Action-Oriented, Relationship-Building tones" },
        { parameter: "Key Messages",     currentState: "Core Clinical Value only",                 simulatedChange: "Add Scientific Innovation, Treatment Experience & Safety" },
        { parameter: "Channel Mix",      currentState: "Heavy Digital Ads + P2P",                  simulatedChange: "Shift to Rep-Triggered Email + HCP Portal Content" },
      ],
      insightDashboard: {
        tiles: [
          { label: "Projected TRx Uplift",     value: "+9.0%",  trend: "Simulated",  color: "#10B981" },
          { label: "Projected Revenue Uplift",  value: "+8.1%",  trend: "Simulated",  color: "#10B981" },
          { label: "Projected NBRx Uplift",     value: "+10.0%", trend: "Simulated",  color: "#10B981" },
          { label: "Marketing ROI (Simulated)", value: "3.5x",   trend: "vs 3.2x now", color: "#3B82F6" },
        ],
        charts: [
          {
            type: "bar-compare",
            title: "Simulated vs Current: Key Metrics",
            currentColor: "#A4A4A8",
            optimizedColor: "#10B981",
            data: [
              { name: "TRx",             current: 43200, optimized: 47088 },
              { name: "Revenue ($M)",    current: 347,   optimized: 375   },
              { name: "NBRx",            current: 10400, optimized: 11440 },
              { name: "Email CTR (%)",   current: 3.2,   optimized: 3.6   },
              { name: "Portal Visits",   current: 71000, optimized: 78000 },
            ],
          },
          {
            type: "radar",
            title: "Strategy Alignment: Current vs Simulated",
            data: [
              { axis: "Content Relevance", current: 27, simulated: 73 },
              { axis: "Persona Targeting", current: 41, simulated: 70 },
              { axis: "Channel Efficiency",current: 38, simulated: 65 },
              { axis: "Tone Alignment",    current: 22, simulated: 60 },
              { axis: "Archetype Diversity",current: 32, simulated: 68 },
            ],
          },
        ],
      },
      suggestions: [
        "Show next best action for HCP",
        "Generate content based on recommendations",
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // STEP 9 — Next Best Action
    // ─────────────────────────────────────────────────────────────
    {
      id: "next-best-action",
      userPrompt: "Show next best action for HCP",
      aiResponse:
        "Here are the Next-Best-Action recommendations for all 50,000 HCPs. AI-driven next-best-action engagement for each physician combines CRM history, prescribing behavior, and digital signals. Matching channel, timing, and content archetype to individual physician personas significantly increases the likelihood of meaningful engagement.",
      aiInsight:
        "Next Best Action uses CRM interaction history, market performance digital signals, prescribing patterns, and persona classification. Each HCP receives a unique next-best-action — not a segment-level campaign.",
      tableData: [
        {
          hcp: "Dr. Klaus Weber",
          persona: "Innovative Leader",
          recommendation: "Tolerability email",
          channel: "Rep-Triggered Email",
          content: "Insightful archetype",
          timing: "Tue 8 AM peak open",
        },
        {
          hcp: "Dr. Amara Singh",
          persona: "Healthcare Leader",
          recommendation: "KOL roundtable invite",
          channel: "Event + Portal",
          content: "Congress follow-up",
          timing: "Within 48hrs of ESMO",
        },
        {
          hcp: "Dr. Elena Rossi",
          persona: "Compassionate Partner",
          recommendation: "QoL leave-behind",
          channel: "F2F + Digital",
          content: "Engaging archetype",
          timing: "Next call cycle",
        },
        {
          hcp: "Dr. Jean Dupont",
          persona: "Conventional Practitioner",
          recommendation: "Safety data update",
          channel: "Promo Email",
          content: "Factual archetype",
          timing: "Thu 10 AM routine",
        },
        {
          hcp: "Dr. Yuki Tanaka",
          persona: "Innovative Leader",
          recommendation: "Portal push notification",
          channel: "HCP Portal + Ad",
          content: "Insightful archetype",
          timing: "Immediate",
        },
      ],
      insightDashboard: {
        tiles: [
          { label: "HCPs with NBA",          value: "50,000",  trend: "All segmented",    color: "#3B82F6" },
          { label: "Avg CRM Gap – Innovative",value: "34 days", trend: "vs 12d Conventional", color: "#EF4444" },
          { label: "Avg CRM Gap – Healthcare",value: "41 days", trend: "Highest gap",        color: "#DC2626" },
        ],
        charts: [
          {
            type: "bar",
            title: "Next Best Action Distribution by Channel",
            colors: { "HCP Count": "#3B82F6" },
            data: [
              { channel: "Rep-Triggered Email", count: 18500 },
              { channel: "HCP Portal + Ad",     count: 12000 },
              { channel: "Event + Portal",      count: 8000  },
              { channel: "F2F + Digital",       count: 7200  },
              { channel: "Promo Email",         count: 4300  },
            ],
          },
        ],
      },
      suggestions: [
        "Generate content based on recommendations",
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // STEP 10 — Generate Content
    // ─────────────────────────────────────────────────────────────
    {
      id: "generate-content",
      userPrompt: "Generate content based on recommendations",
      aiResponse:
        "MLR-pre-checked assets generated in under 4 minutes. Each pre-routed to Personify for individual HCP distribution. MLR Pre-Check: 94/100 | Brand Guidelines: 100% | All 23 citations verified.",
      aiInsight:
        "Generated assets are tailored to close content gaps identified by DA Sense — tolerability, combination therapy, and QoL narratives for high-prescribing specialist and KOL personas.",
      tableData: [
        { asset: "Email",                  archetype: "Informative Layout", audience: "55% Spec, 30% KOL", personaTarget: "Innovator + Leader", personifyDist: "8,400 "     },
        { asset: "Banner",                 archetype: "Expressive Layout",  audience: "50% Spec, 50% KOL", personaTarget: "Innovator",          personifyDist: "6,200 "     },
        { asset: "Interactive Infographic",archetype: "Expressive Layout",  audience: "60% KOL, 40% Spec", personaTarget: "Leader",             personifyDist: "4,800 "     },
        { asset: "Portal Article",         archetype: "Informative Layout", audience: "45% Spec, 35% KOL", personaTarget: "All personas",       personifyDist: "Portal feature" },
      ],
      mlrCheck: {
        score: "94/100",
        brandGuidelines: "100%",
        citationsVerified: 23,
        generationTime: "< 4 minutes",
      },
    
      // ── Full generated e-mail (Image 1) ──────────────────────────
      generatedEmail: {
        subject: "Redefining Resilience: Why Eccentric is the Unconventional Edge Your Patients Deserve",
        preview:
          "As a leader shaping the future of psychiatric care, you've likely seen the data: 70% of patients with treatment-resistant depression cycle through three or more therapies before finding relief…",
        body: `Dear Dr. [Last Name],
    
    As a leader shaping the future of psychiatric care, you've likely seen the data: 70% of patients with treatment-resistant depression cycle through three or more therapies before finding relief, yet innovation often lags behind the urgency of their stories. What if the next breakthrough wasn't about brute-force chemistry, but about harnessing the brain's own eccentric rhythms—the subtle, non-linear patterns that conventional SSRIs and SNRIs overlook?
    
    Enter Eccentric: the first neuromodulatory agent designed to amplify neural eccentricity, those vital "outlier" signals that foster adaptability and emotional agility. Backed by Phase III trials in *The Lancet Psychiatry* (showing 52% remission rates in TRD patients vs. 28% for standard care), Eccentric doesn't just suppress symptoms; it recalibrates the mind's inherent chaos into structured resilience. Imagine patients not merely surviving episodes, but thriving through them—regaining the innovative spark that defines leaders like yourself.
    
    For specialists navigating complex cases and KOLs influencing guidelines, Eccentric stands apart:
    - **Precision Targeting**: Utilizes AI-driven pharmacogenomics to personalize dosing, reducing side-effect dropout by 40% and aligning with your innovator ethos.
    - **Real-World Impact**: Early adopters report 65% faster return-to-function, freeing you to focus on holistic leadership rather than reactive management.
    - **Evidence Ecosystem**: Integrated with our Eccentric Insights Platform, offering anonymized cohort analytics to fuel your research and protocols.
    
    This isn't incremental—it's the paradigm shift from symptom-chasing to eccentricity-embracing. As one of your visionary peers noted, "Eccentric turns the brain's quirks from liabilities into superpowers."
    
    I'd value 15 minutes of your time next week to explore how Eccentric integrates into your practice. Reply with your availability, or book directly here: [Calendar Link].
    
    Empowering your leadership,
    Dr. Elena Vasquez
    Chief Medical Strategist, Neurovance Therapeutics
    elena.vasquez@neurovance.com | (555) 123-4567
    
    P.S. Attached: A one-pager on the "Eccentricity Quotient" model—your edge in tomorrow's consultations.`,
        sender: {
          name: "Dr. Elena Vasquez",
          title: "Chief Medical Strategist, Neurovance Therapeutics",
          email: "elena.vasquez@neurovance.com",
          phone: "(555) 123-4567",
        },
      },
    
      // ── Generated portal article (Image 1) ───────────────────────
      generatedPortalArticle: {
        title: "Embracing Neural Eccentricity: The Future of Mental Health Resilience",
        body: `In the evolving landscape of psychiatric care, where 70% of treatment-resistant depression (TRD) patients endure prolonged cycles of inadequate therapies, a paradigm shift is underway. Enter Eccentric, the pioneering neuromodulatory agent that doesn't merely suppress symptoms—it amplifies the brain's innate "eccentric rhythms," those outlier signals fostering adaptability and emotional agility.
    
    Backed by Phase III data in The Lancet Psychiatry, Eccentric delivers 52% remission rates in TRD cases, doubling standard care's 28%. For innovators pushing boundaries, its AI-driven pharmacogenomics ensures precision dosing, slashing side-effect dropouts by 40%. Leaders shaping protocols will appreciate the 65% accelerated return-to-function, empowering holistic patient journeys.
    
    Whether you're a specialty physician optimizing complex cases or a KOL influencing guidelines, Eccentric transforms quirks into superpowers. Integrated with the Eccentric Insights Platform, it equips you with anonymized analytics for evidence-based evolution. In mental health's chaotic symphony, Eccentric conducts harmony—recalibrating minds for thriving, not just surviving.`,
      },
    
      // ── Generated banner metadata (Image 2) ──────────────────────
      generatedBanner: {
        headline: "Innovation in Pharmaceuticals",
        subheadline: "Driving the Future of Medicine",
        cta: "Explore Our Solutions",
        style: "Expressive Layout — gradient blue/purple, molecular background, physician illustration",
        targetPersona: "Innovator",
        hcpReach: "6,200 HCPs",
      },
    
      // ── Generated interactive infographic metadata (Image 2) ──────
      generatedInfographic: {
        title: "Desyrel — Structured Information for Healthcare Professionals",
        sections: [
          {
            label: "Key Opinion Leaders (KOLs)",
            bullets: [
              "Influential in shaping clinical guidelines",
              "High credibility in medical community",
              "Targeted for broad dissemination",
            ],
          },
          {
            label: "Specialty Care HCP (SPCs)",
            bullets: [
              "Focused expertise in specific conditions",
              "Tailored clinical insights",
              "Niche market engagement",
            ],
            donutData: [
              { segment: "KOL",  value: 60, color: "#1E3A5F" },
              { segment: "SPC",  value: 40, color: "#3B82F6" },
            ],
          },
        ],
        style: "Structured Layout — navy header, two-column comparison, donut chart",
        targetPersona: "Leader",
        hcpReach: "4,800 HCPs",
      },
    
      // insightDashboard intentionally omitted — no insights panel for this step
      suggestions: [
        "Show post-campaign performance vs baseline",
      ],
    },
    
    
    // ─────────────────────────────────────────────────────────────
    // STEP 11 — Post-Campaign Performance vs Baseline  (UPDATED)
    // ─────────────────────────────────────────────────────────────
    // Key changes:
    //   • insightDashboard tiles updated from Image 3
    //     (TRx +10.6%, NBRx +24.0%, Revenue +$34M, Email CTR +74.2%,
    //      ROI 4.7x, NBA Acc. 74%)
    //   • charts updated:
    //       – country-level performance (dual-axis bar) from Image 3
    //       – persona recovery (two-series line) from Image 3
    // ─────────────────────────────────────────────────────────────
    {
      id: "post-campaign-performance",
      userPrompt: "Show post-campaign performance vs baseline",
      aiResponse:
        "Results across all 6 modules show meaningful improvement after implementing the recommended strategy changes. Prescription growth, revenue recovery, and HCP engagement are all trending positively.",
      aiInsight:
        "Consistent gains across all key metrics confirm the strategy reallocation is working. Marketing ROI has jumped from 3.2x to 4.7x. NBRx growth of +24% and Email CTR uplift of +74.2% are outpacing projections. Further headroom exists especially in Share of Voice and CRM last-touch improvement for high-value personas.",
      tableData: [
        { metric: "Total Prescriptions (TRx)",           before: "42,200",  after: "46,000",  change: "+10.6%", note: "Market Mix Model — highest contributor"          },
        { metric: "New Patient Starts (NBRx)",            before: "10,400",  after: "12,896",  change: "+24.0%", note: "Market Mix Model — new content driving uplift"   },
        { metric: "Revenue",                              before: "$347M",   after: "$381M",   change: "+$34M",  note: "Market Mix Model — stable contribution"          },
        { metric: "Email CTR",                            before: "3.2%",    after: "5.6%",    change: "+74.2%", note: "Engagement Insights — action-oriented tone shift" },
        { metric: "Marketing ROI",                        before: "3.2x",    after: "4.7x",    change: "+46.9%", note: "Market Mix Model — significant uplift"           },
        { metric: "NBA Acceptance Rate",                  before: "N/A",     after: "74%",     change: "—",      note: "Next Best Action — first measurement period"    },
        { metric: "HCP Portal Visits",                    before: "71,000",  after: "78,000",  change: "+9.9%",  note: "Headroom on response curve"                     },
        { metric: "Innovative Leader Engagement",         before: "41%",     after: "46%",     change: "+12.2%", note: "New content to deploy"                          },
        { metric: "Healthcare Leader Engagement",         before: "38%",     after: "43%",     change: "+13.2%", note: "Low efficiency at 0.27"                         },
        { metric: "Share of Voice vs. Competitor",        before: "34%",     after: "37%",     change: "+8.8%",  note: "Significant headroom remains"                   },
        { metric: "CRM Last Touch (Innovative Leader)",   before: "34 days", after: "31 days", change: "-8.8%",  note: "Significant headroom"                           },
        { metric: "CRM Last Touch (Healthcare Leader)",   before: "41 days", after: "35 days", change: "-14.6%", note: "Significant headroom"                           },
      ],
      insightDashboard: {
        // ── Tiles — sourced directly from Image 3 ────────────────
        tiles: [
          { label: "TRx",       value: "+10.6%", source: "Market Mix Model",  color: "#10B981" },
          { label: "NBRx",      value: "+24.0%", source: "Market Mix Model",  color: "#10B981" },
          { label: "Revenue",   value: "+$34M",  source: "Market Mix Model",  color: "#10B981" },
          { label: "Email CTR", value: "+74.2%", source: "Engagement Insights", color: "#10B981" },
          { label: "ROI",       value: "4.7x",   source: "Market Mix Model",  color: "#10B981" },
          { label: "NBA Acc.",  value: "74%",    source: "Next Best Action",  color: "#F97316" },
        ],
    
        charts: [
          // ── Chart 1: Country-Level Performance (dual-axis bar) — Image 3 ──
          {
            type: "dual-axis-bar",
            title: "Country-Level Performance",
            leftAxisLabel: "Prescriptions (TRx)",
            rightAxisLabel: "Engagement %",
            barColor: "#3B82F6",
            lineColor: "#10B981",
            data: [
              { country: "United States", trx: 8500, engagement: 64 },
              { country: "Germany",       trx: 6500, engagement: 61 },
              { country: "France",        trx: 8400, engagement: 59 },
              { country: "United Kingdom",trx: 4900, engagement: 69 },
              { country: "Japan",         trx: 7700, engagement: 54 },
              { country: "Italy",         trx: 5900, engagement: 50 },
              { country: "Spain",         trx: 6400, engagement: 62 },
              { country: "Canada",        trx: 2900, engagement: 66 },
            ],
          },
    
          // ── Chart 2: Persona Recovery line — Image 3 ─────────────
          {
            type: "line",
            title: "Persona Recovery",
            tabs: ["Content Effectiveness", "Persona Recovery"],
            seriesColors: {
              "Content Effectiveness": "#8B5CF6",
              "Persona Recovery":      "#F97316",
            },
            data: [
              { w: "W1", contentEffectiveness: 45, personaRecovery: 41 },
              { w: "W2", contentEffectiveness: 49, personaRecovery: 44 },
              { w: "W3", contentEffectiveness: 52, personaRecovery: 49 },
              { w: "W4", contentEffectiveness: 55, personaRecovery: 52 },
              { w: "W5", contentEffectiveness: 57, personaRecovery: 55 },
              { w: "W6", contentEffectiveness: 60, personaRecovery: 58 },
              { w: "W7", contentEffectiveness: 62, personaRecovery: 61 },
              { w: "W8", contentEffectiveness: 66, personaRecovery: 63 },
            ],
          },
        ],
      },
    },
  ],
};
