"use client";
import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { INVOLEAD_DEMO_DATA, Message } from '../data/mockData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
  LineChart, Line, PieChart, Pie,
} from 'recharts';
import {
  Send, AlertCircle, ChevronRight, ChevronLeft, X, BarChart3, Loader,
} from 'lucide-react';
import Image from 'next/image';

// ─── Types ───────────────────────────────────────────────────────────────────

interface MessageWithContent extends Message {
  displayedContent?: string;
  fullContent?: string;
  isStreaming?: boolean;
  showAlert?: boolean;
  showDiagnosis?: boolean;
  showFindings?: boolean;
  showRecommendation?: boolean;
  showTable?: boolean;
  resolvedStepId?: string;
}

// ─── Suggestion → Step ID map ────────────────────────────────────────────────
const SUGGESTION_STEP_MAP: Record<string, string> = {
  "What is driving the decline?": "budget-efficiency",
  "Where are our marketing budgets invested?": "budget-efficiency",
  "How is my content performing?": "content-performance",
  "Compare channel performance": "budget-efficiency",
  "Compare our content vs Tecentriq benchmark": "content-benchmark",
  "How is the audience tagged within the content?": "audience-tagging",
  "Check messaging & tone of the content": "messaging-tone",
  "What is the engagement of HCP personas?": "persona-engagement",
  "Simulate optimal engagement strategy": "simulate-strategy",
  "View CRM recommendations": "persona-engagement",
  "Simulate an optimal strategy": "simulate-strategy",
  "Show next best action for physicians": "next-best-action",
  "Generate content based on recommendations": "generate-content",
  "Show post-campaign performance vs baseline": "post-campaign-performance",
  "What content should I prioritize?": "content-benchmark",
  "Compare content vs benchmark": "content-benchmark",
};

function guessStepFromText(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('budget') || t.includes('spend') || t.includes('channel') || t.includes('mix'))
    return 'budget-efficiency';
  if (t.includes('benchmark') || t.includes('archetype'))
    return 'content-benchmark';
  if (t.includes('audience') || t.includes('tag'))
    return 'audience-tagging';
  if (t.includes('tone') || t.includes('messaging') || t.includes('message'))
    return 'messaging-tone';
  if (t.includes('content') || t.includes('material') || t.includes('asset'))
    return 'content-performance';
  if (t.includes('persona') || t.includes('hcp') || t.includes('engagement'))
    return 'persona-engagement';
  if (t.includes('simulat') || t.includes('strategy') || t.includes('optimal'))
    return 'simulate-strategy';
  if (t.includes('next best') || t.includes('nba') || t.includes('action'))
    return 'next-best-action';
  if (t.includes('generat') || t.includes('content creat'))
    return 'generate-content';
  if (t.includes('post') || t.includes('baseline') || t.includes('result'))
    return 'post-campaign-performance';
  return 'quarterly-overview';
}

// ─── Skeleton helpers ────────────────────────────────────────────────────────

const SkeletonTile = () => (
  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 animate-pulse">
    <div className="h-3 bg-blue-200 rounded mb-2 w-16" />
    <div className="h-6 bg-blue-300 rounded mb-2" />
    <div className="h-2 bg-blue-200 rounded w-20" />
  </div>
);

const SkeletonChart = () => (
  <div className="bg-white rounded-lg border border-slate-200 p-3 animate-pulse">
    <div className="h-4 bg-slate-200 rounded mb-4 w-32" />
    <div className="h-40 bg-slate-100 rounded" />
  </div>
);

const SkeletonTable = () => (
  <div className="border border-slate-200 rounded-lg overflow-hidden animate-pulse">
    <div className="h-10 bg-slate-100 border-b border-slate-200" />
    <div className="p-4 space-y-3">
      {[1, 2, 3].map(i => <div key={i} className="h-8 bg-slate-100 rounded" />)}
    </div>
  </div>
);

// ─── Chart block component ────────────────────────────────────────────────────

function ChartBlock({ chart, stepId }: { chart: any; stepId: string }) {
  if (!chart?.data) return null;
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3 animate-fadeIn">
      <h4 className="text-xs font-semibold text-slate-700 mb-3">{chart.title}</h4>

      {chart.type === 'line' && (
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey={Object.keys(chart.data[0])[0]} stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '10px' }} />
              {Object.keys(chart.data[0]).slice(1).map((key, ki) => (
                <Line key={ki} type="monotone" dataKey={key}
                  stroke={chart.seriesColors?.[key] ?? chart.strokeColor ?? '#3b82f6'}
                  dot={{ fill: chart.seriesColors?.[key] ?? '#3b82f6', r: 3 }} strokeWidth={2} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {chart.type === 'bar-compare' && (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 9 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: '10px' }} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Bar dataKey="current"   fill={chart.currentColor   ?? '#94a3b8'} name="Current"   />
              <Bar dataKey="optimized" fill={chart.optimizedColor ?? '#3b82f6'} name="Optimized" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {chart.type === 'bar' && (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey={Object.keys(chart.data[0])[0]} stroke="#94a3b8" tick={{ fontSize: 9 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: '10px' }} />
              {Object.keys(chart.data[0]).slice(1).map((key, ki) => (
                <Bar key={ki} dataKey={key} fill={chart.colors?.[key] ?? '#3b82f6'} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {chart.type === 'horizontal-bar' && (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart.data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey={Object.keys(chart.data[0])[0]} stroke="#94a3b8" tick={{ fontSize: 9 }} width={80} />
              <Tooltip contentStyle={{ fontSize: '10px' }} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              {Object.keys(chart.data[0]).slice(1).map((key, ki) => (
                <Bar key={ki} dataKey={key}
                  fill={chart.colors?.[key] ?? (ki === 0 ? '#3b82f6' : '#22c55e')} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {chart.type === 'pie' && (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chart.data} cx="50%" cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.value}%`}
                outerRadius={65} dataKey="value">
                {chart.data.map((entry: any, i: number) => (
                  <Cell key={i} fill={entry.color ?? '#3b82f6'} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any, n: any) => [`${v}%`, n]} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {chart.type === 'bubble' && (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 9 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: '10px' }} />
              <Bar dataKey="y" name="Engagement %">
                {chart.data.map((entry: any, i: number) => (
                  <Cell key={i} fill={entry.color ?? '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ChatbotWorkshop() {
  const [messages, setMessages] = useState<MessageWithContent[]>([]);

  // Ordered list of step IDs visited — drives Prev/Next in the panel
  const [visitedStepIds, setVisitedStepIds] = useState<string[]>([]);
  // Which index into visitedStepIds is displayed in the panel right now
  const [panelIndex, setPanelIndex] = useState<number>(-1);

  const [inputValue, setInputValue] = useState('');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const streamingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const userName = 'Sarah';

  // The step currently shown in the panel
  const panelStep = panelIndex >= 0
    ? INVOLEAD_DEMO_DATA.steps.find(s => s.id === visitedStepIds[panelIndex]) ?? null
    : null;

  // ── Auto-scroll ──
  useEffect(() => {
    if (messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last.role === 'user' || (last.role === 'assistant' && !last.isStreaming)) {
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
    }
  }, [messages.length]);

  // ── Word-by-word streaming ──
  useEffect(() => {
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role !== 'assistant' || !lastMsg.fullContent || !lastMsg.isStreaming) return;

    const words = lastMsg.fullContent.split(' ');
    const displayedWords = (lastMsg.displayedContent || '').trim().split(' ').filter(Boolean);

    if (displayedWords.length >= words.length) {
      setMessages(prev => {
        const updated = [...prev];
        const m = updated[updated.length - 1];
        m.isStreaming = false;
        m.showAlert = true; m.showDiagnosis = true;
        m.showFindings = true; m.showRecommendation = true; m.showTable = true;
        return updated;
      });
      return;
    }

    if (streamingIntervalRef.current) clearTimeout(streamingIntervalRef.current);
    streamingIntervalRef.current = setTimeout(() => {
      setMessages(prev => {
        const updated = [...prev];
        const m = updated[updated.length - 1];
        const nextIdx = displayedWords.length;
        m.displayedContent = words.slice(0, nextIdx + 1).join(' ');
        if (nextIdx > 50)  m.showAlert          = true;
        if (nextIdx > 100) m.showDiagnosis      = true;
        if (nextIdx > 150) m.showFindings       = true;
        if (nextIdx > 200) m.showRecommendation = true;
        if (nextIdx > 250) m.showTable          = true;
        return updated;
      });
    }, 50);

    return () => { if (streamingIntervalRef.current) clearTimeout(streamingIntervalRef.current); };
  }, [messages]);

  // ── Core dispatcher ──
  const dispatchStep = (stepId: string) => {
    const step = INVOLEAD_DEMO_DATA.steps.find(s => s.id === stepId);
    if (!step) return;

    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        stepId,
        resolvedStepId: stepId,
        content: step.aiResponse,
        fullContent: step.aiResponse,
        displayedContent: '',
        isStreaming: true,
        showAlert: false, showDiagnosis: false,
        showFindings: false, showRecommendation: false, showTable: false,
      }]);

      // Append to visited list and jump to newest
      setVisitedStepIds(prev => {
        const updated = [...prev, stepId];
        setPanelIndex(updated.length - 1);
        return updated;
      });
      setIsPanelOpen(true);
    }, 1500);
  };

  const handleAction = (stepId: string) => {
    const step = INVOLEAD_DEMO_DATA.steps.find(s => s.id === stepId);
    if (!step) return;
    setMessages(prev => [...prev, { role: 'user', content: step.userPrompt }]);
    dispatchStep(stepId);
  };

  const handleSuggestion = (suggestionText: string) => {
    const stepId = SUGGESTION_STEP_MAP[suggestionText] ?? guessStepFromText(suggestionText);
    const step = INVOLEAD_DEMO_DATA.steps.find(s => s.id === stepId);
    if (!step) return;
    setMessages(prev => [...prev, { role: 'user', content: suggestionText }]);
    dispatchStep(stepId);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const userInput = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', content: userInput }]);
    setInputValue('');
    setIsFocused(false);
    dispatchStep(SUGGESTION_STEP_MAP[userInput] ?? guessStepFromText(userInput));
  };

  // ── Panel navigation ──
  const canGoPrev = panelIndex > 0;
  const canGoNext = panelIndex < visitedStepIds.length - 1;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-white font-sans text-slate-900 overflow-hidden">
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(-5px); } to { opacity:1; transform:translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-in; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        .animate-pulse { animation: pulse 2s cubic-bezier(.4,0,.6,1) infinite; }
      `}</style>

      {/* ══════════════════════════════════════════
          MAIN CHAT AREA
      ══════════════════════════════════════════ */}
      <div className={`flex flex-col transition-all duration-300 ${isPanelOpen ? 'w-[60%]' : 'flex-1'}`}>

        {/* Navbar — logo + panel toggle + avatar only */}
        <header className="h-14 border-b border-slate-200 bg-white flex items-center px-6 justify-between shrink-0">
          <span className="font-semibold text-slate-800">
          <Image
            src="logo.svg"
            alt="Logo"
            height={8}
            width={110}
            priority
          /></span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPanelOpen(!isPanelOpen)}
              className={`p-2 hover:bg-slate-100 rounded-lg transition-colors ${isPanelOpen ? 'bg-blue-100' : ''}`}
            >
              <BarChart3 size={18} className={isPanelOpen ? 'text-blue-600' : 'text-slate-600'} />
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold select-none">
              S
            </div>
          </div>
        </header>

        {/* Chat feed */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {messages.length === 0 ? (

            /* ── Welcome screen ── */
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              <div className="text-center max-w-2xl w-full">
                <h1 className="text-4xl font-light mb-8">
                  Hi <span className="text-blue-500 font-semibold">{userName}</span>,<br />
                  <span className="text-slate-900">How can I help you?</span>
                </h1>

                <div className={`bg-white rounded-lg p-4 mb-12 transition-all ${isFocused ? 'border-blue-500 ring-2 ring-blue-500' : 'border border-slate-200'}`}>
                  <input type="text" placeholder="Ask anything..."
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                    className="w-full outline-none bg-transparent text-slate-700 placeholder-slate-400 text-sm"
                  />
                  <div className="flex justify-end mt-4 pt-4 border-t border-slate-100">
                    <button onClick={handleSendMessage} disabled={!inputValue.trim()}
                      className="p-2 hover:bg-slate-100 disabled:opacity-50 rounded-lg transition-colors">
                      <Send size={16} className="text-slate-600" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    { label: 'Get Quarterly Overview', id: 'quarterly-overview'  },
                    { label: 'Budget Analysis',         id: 'budget-efficiency'   },
                    { label: 'Content Review',          id: 'content-performance' },
                    { label: 'Persona Analysis',        id: 'persona-engagement'  },
                  ].map(btn => (
                    <button key={btn.id} onClick={() => handleAction(btn.id)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors">
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          ) : (

            /* ── Message list ── */
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto w-full p-6 space-y-6 pb-96">
                {messages.map((msg, idx) => {
                  const messageStep = msg.resolvedStepId
                    ? INVOLEAD_DEMO_DATA.steps.find(s => s.id === msg.resolvedStepId)
                    : undefined;

                  return (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xl rounded-lg p-4 ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-50 border border-slate-200 text-slate-900'
                      }`}>

                        {msg.role === 'user' && (
                          <p className="leading-relaxed text-sm">{msg.content}</p>
                        )}

                        {msg.role === 'assistant' && (
                          <div className="space-y-4">
                            <p className="leading-relaxed text-sm whitespace-pre-wrap min-h-[1.5rem]">
                              {msg.displayedContent || (messageStep?.aiResponse ?? msg.content)}
                              {msg.isStreaming && (
                                <span className="inline-block w-1 h-4 bg-slate-900 ml-1 animate-pulse" />
                              )}
                            </p>

                            {msg.showAlert && messageStep?.hasAlert && (
                              <div className="flex gap-3 bg-red-50 border border-red-200 p-4 rounded-lg animate-fadeIn">
                                <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={16} />
                                <p className="text-xs text-red-800">{messageStep.hasAlert.text}</p>
                              </div>
                            )}

                            {msg.showDiagnosis && messageStep?.hasDiagnosis && (
                              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-xs text-blue-900 animate-fadeIn">
                                {messageStep.hasDiagnosis}
                              </div>
                            )}

                            {msg.showDiagnosis && !messageStep?.findings && messageStep?.aiInsight && (
                              <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg text-xs text-purple-900 animate-fadeIn">
                                {messageStep.aiInsight}
                              </div>
                            )}

                            {msg.showFindings && messageStep?.findings && (
                              <div className="space-y-2 animate-fadeIn">
                                {messageStep.findings.map((f: any, i: number) => (
                                  <div key={i} className={`flex gap-2 p-2 rounded-lg ${
                                    f.type === 'yellow' ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'
                                  }`}>
                                    <div className="flex-1 text-xs">
                                      <p className={f.type === 'yellow' ? 'text-yellow-900' : 'text-green-900'}>{f.text}</p>
                                      <p className={`mt-0.5 ${f.type === 'yellow' ? 'text-yellow-700' : 'text-green-700'}`}>{f.module}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {msg.showRecommendation && messageStep?.aiRecommendation && (
                              <div className="bg-slate-100 p-4 rounded-lg text-xs animate-fadeIn">
                                <p className="font-semibold text-slate-900 mb-2">Recommendation:</p>
                                <p className="text-slate-700">{messageStep.aiRecommendation}</p>
                              </div>
                            )}

                            {msg.showTable && messageStep?.tableData && (
                              <div className="border border-slate-200 rounded-lg overflow-x-auto animate-fadeIn">
                                <table className="w-full text-xs text-left">
                                  <thead className="bg-slate-100 border-b border-slate-200">
                                    <tr>
                                      {Object.keys(messageStep.tableData[0]).map(k => (
                                        <th key={k} className="px-3 py-2 font-semibold text-slate-700 whitespace-nowrap">
                                          {k.charAt(0).toUpperCase() + k.slice(1)}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-200">
                                    {messageStep.tableData.map((row: any, i: number) => (
                                      <tr key={i} className="hover:bg-slate-50">
                                        {Object.values(row).map((val: any, j: number) => (
                                          <td key={j} className="px-3 py-2 text-slate-700 whitespace-nowrap">{String(val)}</td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}

                            {/* Suggestions — last assistant message only, after streaming */}
                            {!msg.isStreaming && idx === messages.length - 1 && messageStep?.suggestions && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {messageStep.suggestions.map((s: string, i: number) => (
                                  <button key={i} onClick={() => handleSuggestion(s)}
                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-sm font-medium text-slate-700 transition-colors flex items-center gap-1">
                                    {s} <ChevronRight size={14} />
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isThinking && (
                  <div className="flex justify-start">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Loader size={16} className="animate-spin text-blue-600" />
                        <p className="text-sm text-slate-700">Thinking…</p>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={scrollRef} />
              </div>
            </div>
          )}
        </div>

        {/* Fixed input bar */}
        {messages.length > 0 && (
          <div className="bg-white p-6 shrink-0 border-t border-slate-200">
            <div className="max-w-3xl mx-auto">
              <div className={`bg-white rounded-lg p-4 transition-all ${isFocused ? 'border-blue-500 ring-2 ring-blue-500' : 'border border-slate-200'}`}>
                <input type="text" placeholder="Ask anything…"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                  className="w-full outline-none bg-transparent text-slate-900 placeholder-slate-400 text-sm"
                />
                <div className="flex justify-end mt-4 pt-4 border-t border-slate-100">
                  <button onClick={handleSendMessage} disabled={!inputValue.trim()}
                    className="p-2 hover:bg-slate-100 disabled:opacity-50 rounded-lg transition-colors">
                    <Send size={16} className="text-slate-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════
          RIGHT INSIGHTS PANEL
      ══════════════════════════════════════════ */}
      <div className={`h-full bg-white border-l border-slate-200 shadow-lg transition-all duration-300 ease-in-out overflow-hidden flex flex-col ${
        isPanelOpen ? 'w-[40%] opacity-100 visible' : 'w-0 opacity-0 invisible'
      }`}>
        <div className="flex flex-col h-full min-w-0">

          {/* Panel header with ‹ N/Total › navigation */}
          <div className="h-14 border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-sm">
              <BarChart3 size={18} className="text-blue-600" />
              Insights Dashboard
            </h3>

            <div className="flex items-center gap-0.5">
              {/* Prev button */}
              <button
                onClick={() => setPanelIndex(i => i - 1)}
                disabled={!canGoPrev}
                title="Previous insight"
                className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} className="text-slate-600" />
              </button>

              {/* Counter */}
              {visitedStepIds.length > 0 && (
                <span className="text-xs text-slate-500 tabular-nums select-none w-12 text-center">
                  {panelIndex + 1} / {visitedStepIds.length}
                </span>
              )}

              {/* Next button */}
              <button
                onClick={() => setPanelIndex(i => i + 1)}
                disabled={!canGoNext}
                title="Next insight"
                className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} className="text-slate-600" />
              </button>

              {/* Divider */}
              <div className="w-px h-5 bg-slate-200 mx-1.5" />

              {/* Close */}
              <button onClick={() => setIsPanelOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} className="text-slate-600" />
              </button>
            </div>
          </div>

          {/* Context label — which question this panel answers */}
          {panelStep && (
            <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50 shrink-0">
              <p className="text-xs text-slate-500 truncate">
                <span className="font-medium text-slate-700">{panelStep.userPrompt}</span>
              </p>
            </div>
          )}

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {isThinking && !panelStep ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-3"><SkeletonTile /><SkeletonTile /></div>
                <SkeletonChart /><SkeletonChart /><SkeletonTable />
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Loader size={16} className="animate-spin text-blue-600" />
                  <p className="text-sm text-slate-500">Loading insights…</p>
                </div>
              </div>
            ) : panelStep ? (
              <>
                {/* Tiles */}
                {panelStep.insightDashboard?.tiles && (
                  <div className="grid grid-cols-2 gap-3">
                    {panelStep.insightDashboard.tiles.map((tile: any, i: number) => (
                      <div key={i} className="bg-blue-50 p-3 rounded-lg border border-blue-200 animate-fadeIn">
                        <p className="text-xs font-semibold uppercase mb-1">{tile.label}</p>
                        <p className={`text-lg font-bold ${tile.value < tile.target ? 'text-red-500' : 'text-green-500'}`}>
                          {tile.value}
                        </p>
                        {tile.target && <p className="text-xs text-black mt-0.5">Target: {tile.target}</p>}
                        {tile.trend  && <p className="text-xs text-blue-700 mt-0.5">{tile.trend}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Charts */}
                {panelStep.insightDashboard?.charts?.map((chart: any, idx: number) => (
                  <ChartBlock key={`${panelStep.id}-${idx}`} chart={chart} stepId={panelStep.id} />
                ))}

                {/* KPI mini table */}
                {panelStep.tableData && (
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <h4 className="text-xs font-semibold text-slate-700 mb-3">Key Metrics</h4>
                    <div className="space-y-2">
                      {panelStep.tableData.slice(0, 3).map((row: any, i: number) => {
                        const vals = Object.values(row);
                        return (
                          <div key={i} className="flex items-center justify-between pb-2 border-b border-slate-200 last:border-0">
                            <span className="text-xs text-slate-600 truncate pr-2">{String(vals[0])}</span>
                            <span className="text-xs font-semibold text-slate-900 shrink-0">{String(vals[2])}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-center opacity-50 pt-24">
                <BarChart3 size={40} className="mb-4 text-slate-400" />
                <p className="text-xs text-slate-500">No active insights.<br />Start a conversation.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}