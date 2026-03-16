"use client";
import React, { useState, useEffect, useRef } from 'react';
import { INVOLEAD_DEMO_DATA, Message } from '../data/mockData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
  LineChart, Line, PieChart, Pie, ComposedChart,
} from 'recharts';
import {
  Send, AlertCircle, ChevronRight, ChevronLeft, X, BarChart3, Loader,
  Mail, FileText, Image as ImageIcon, LayoutGrid, Copy, CheckCheck,
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
  showGenerated?: boolean;
  resolvedStepId?: string;
}
 
// ─── Suggestion → Step ID map ────────────────────────────────────────────────
const SUGGESTION_STEP_MAP: Record<string, string> = {
  "What is driving the decline?": "budget-efficiency",
  "Where are our marketing budgets invested?": "budget-efficiency",
  "Show me the performance of content engagement KPI": "content-performance",
  "Compare our content archetype with the recommended benchmark": "content-benchmark",
  "How is the audience tagged within the content?": "audience-tagging",
  "Check messaging & tone of the content": "messaging-tone",
  "Show me how HCP are Engaged": "persona-engagement",
  "Simulate optimal engagement strategy": "simulate-strategy",
  "View CRM recommendations": "persona-engagement",
  "Simulate an optimal strategy": "simulate-strategy",
  "Show next best action for HCP": "next-best-action",
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
 
// ─── Copy button ──────────────────────────────────────────────────────────────
 
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 hover:bg-slate-200 rounded transition-colors shrink-0"
      title="Copy to clipboard"
    >
      {copied
        ? <CheckCheck size={14} className="text-green-600" />
        : <Copy size={14} className="text-slate-400" />}
    </button>
  );
}
 
// ─── Generated Content Block (Step 10 — chat area) ───────────────────────────
 
function GeneratedContentBlock({ step }: { step: any }) {
  const [activeTab, setActiveTab] = useState<'email' | 'portal' | 'banner' | 'infographic'>('email');
 
  const tabs = [
    { key: 'email',       label: 'Email',        icon: <Mail size={13} /> },
    { key: 'portal',      label: 'Portal Article',icon: <FileText size={13} /> },
    { key: 'banner',      label: 'Banner',        icon: <ImageIcon size={13} /> },
    { key: 'infographic', label: 'Infographic',   icon: <LayoutGrid size={13} /> },
  ] as const;
 
  return (
    <div className="mt-2 border border-slate-200 rounded-xl overflow-hidden animate-fadeIn">
      {/* MLR bar */}
      <div className="bg-emerald-50 border-b border-emerald-200 px-3 py-1.5 flex items-center justify-between">
        <p className="text-xs font-semibold text-emerald-800">
          MLR Pre-Check: {step.mlrCheck?.score} &nbsp;|&nbsp; Brand Guidelines: {step.mlrCheck?.brandGuidelines} &nbsp;|&nbsp; All {step.mlrCheck?.citationsVerified} citations verified.
        </p>
        <span className="text-xs text-emerald-700">{step.mlrCheck?.generationTime}</span>
      </div>
 
      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === t.key
                ? 'border-b-2 border-blue-600 text-blue-700 bg-white'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>
 
      {/* Tab content */}
      <div className="p-3 bg-white">
 
        {/* ── Email ── */}
        {activeTab === 'email' && step.generatedEmail && (
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Subject</p>
                <p className="text-sm font-semibold text-blue-700 leading-snug">
                  {step.generatedEmail.subject}
                </p>
              </div>
              <CopyButton text={step.generatedEmail.body} />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 max-h-56 overflow-y-auto">
              <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                {step.generatedEmail.body}
              </p>
            </div>
            {step.generatedEmail.sender && (
              <div className="text-[10px] text-slate-400">
                From: {step.generatedEmail.sender.name} · {step.generatedEmail.sender.email} · {step.generatedEmail.sender.phone}
              </div>
            )}
          </div>
        )}
 
        {/* ── Portal Article ── */}
        {activeTab === 'portal' && step.generatedPortalArticle && (
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-blue-700 leading-snug">
                {step.generatedPortalArticle.title}
              </p>
              <CopyButton text={step.generatedPortalArticle.body} />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 max-h-56 overflow-y-auto">
              <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                {step.generatedPortalArticle.body}
              </p>
            </div>
          </div>
        )}
 
        {/* ── Banner ── */}
        {activeTab === 'banner' && step.generatedBanner && (
          <div className="space-y-2">
            <div className="rounded-lg overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6 text-white text-center relative">
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              <p className="text-xl font-bold tracking-tight leading-tight">
                {step.generatedBanner.headline}
              </p>
              <p className="text-sm text-blue-200 mt-1 mb-3">
                {step.generatedBanner.subheadline}
              </p>
              <button className="bg-white text-blue-700 text-xs font-bold px-5 py-2 rounded-full uppercase tracking-wide">
                {step.generatedBanner.cta}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { label: 'Archetype',      val: 'Expressive Layout'          },
                { label: 'Persona Target', val: step.generatedBanner.targetPersona },
                { label: 'HCP Reach',      val: step.generatedBanner.hcpReach },
              ].map(m => (
                <div key={m.label} className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
                  <p className="text-slate-400 text-[10px] uppercase mb-0.5">{m.label}</p>
                  <p className="text-slate-800 font-semibold">{m.val}</p>
                </div>
              ))}
            </div>
          </div>
        )}
 
        {/* ── Infographic ── */}
        {activeTab === 'infographic' && step.generatedInfographic && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-800">{step.generatedInfographic.title}</p>
            <div className="grid grid-cols-2 gap-2">
              {step.generatedInfographic.sections.map((sec: any, i: number) => (
                <div key={i} className={`rounded-lg p-2.5 border ${i === 0 ? 'bg-slate-800 border-slate-700 text-white' : 'bg-blue-50 border-blue-200 text-slate-800'}`}>
                  <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${i === 0 ? 'text-blue-300' : 'text-blue-600'}`}>
                    {sec.label}
                  </p>
                  <ul className="space-y-1">
                    {sec.bullets.map((b: string, j: number) => (
                      <li key={j} className={`text-xs flex items-start gap-1.5 ${i === 0 ? 'text-slate-300' : 'text-slate-700'}`}>
                        <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  {sec.donutData && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="relative w-10 h-10">
                        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                          <circle cx="18" cy="18" r="14" fill="none" stroke="#1e3a5f" strokeWidth="6" />
                          <circle cx="18" cy="18" r="14" fill="none" stroke="#3b82f6" strokeWidth="6"
                            strokeDasharray={`${sec.donutData[0].value} ${100 - sec.donutData[0].value}`} />
                        </svg>
                      </div>
                      <div className="text-[10px] space-y-0.5">
                        {sec.donutData.map((d: any) => (
                          <p key={d.segment} className="text-slate-300">
                            <span className="font-bold text-white">{d.value}%</span> {d.segment}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: 'Persona Target', val: step.generatedInfographic.targetPersona },
                { label: 'HCP Reach',      val: step.generatedInfographic.hcpReach },
              ].map(m => (
                <div key={m.label} className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
                  <p className="text-slate-400 text-[10px] uppercase mb-0.5">{m.label}</p>
                  <p className="text-slate-800 font-semibold">{m.val}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
 
// ─── Chart block component ────────────────────────────────────────────────────
 
function ChartBlock({ chart }: { chart: any }) {
  if (!chart?.data) return null;
 
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3 animate-fadeIn">
      <h4 className="text-xs font-semibold text-slate-700 mb-2">{chart.title}</h4>
 
      {chart.type === 'line' && (
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey={Object.keys(chart.data[0])[0]} stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '10px' }} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              {Object.keys(chart.data[0]).slice(1).map((key, ki) => (
                <Line key={ki} type="monotone" dataKey={key}
                  stroke={chart.seriesColors?.[key] ?? chart.strokeColor ?? '#3b82f6'}
                  dot={{ fill: chart.seriesColors?.[key] ?? '#3b82f6', r: 3 }}
                  strokeWidth={2} name={key} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
 
      {chart.type === 'bar-compare' && (
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 9 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: '10px' }} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Bar dataKey="current"   fill={chart.currentColor   ?? '#94a3b8'} name="Current"   radius={[2,2,0,0]} />
              <Bar dataKey="optimized" fill={chart.optimizedColor ?? '#3b82f6'} name="Optimized" radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
 
      {chart.type === 'bar' && (
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey={Object.keys(chart.data[0])[0]} stroke="#94a3b8" tick={{ fontSize: 9 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: '10px' }} />
              {Object.keys(chart.data[0]).slice(1).map((key, ki) => (
                <Bar key={ki} dataKey={key} fill={chart.colors?.[key] ?? '#3b82f6'} radius={[2,2,0,0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
 
      {chart.type === 'horizontal-bar' && (
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart.data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey={Object.keys(chart.data[0])[0]} stroke="#94a3b8" tick={{ fontSize: 9 }} width={80} />
              <Tooltip contentStyle={{ fontSize: '10px' }} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              {Object.keys(chart.data[0]).slice(1).map((key, ki) => (
                <Bar key={ki} dataKey={key}
                  fill={chart.colors?.[key] ?? (ki === 0 ? '#3b82f6' : '#22c55e')}
                  radius={[0,2,2,0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
 
      {chart.type === 'pie' && (
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chart.data} cx="50%" cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.value}%`}
                outerRadius={60} dataKey="value">
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
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 9 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: '10px' }} />
              <Bar dataKey="y" name="Engagement %" radius={[2,2,0,0]}>
                {chart.data.map((entry: any, i: number) => (
                  <Cell key={i} fill={entry.color ?? '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
 
      {chart.type === 'dual-axis-bar' && (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="country" stroke="#94a3b8" tick={{ fontSize: 8 }} angle={-30} textAnchor="end" height={48} />
              <YAxis yAxisId="left" stroke="#3b82f6" tick={{ fontSize: 9 }}
                label={{ value: chart.leftAxisLabel ?? 'TRx', angle: -90, position: 'insideLeft', fontSize: 9, fill: '#3b82f6' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" tick={{ fontSize: 9 }}
                label={{ value: chart.rightAxisLabel ?? 'Engagement %', angle: 90, position: 'insideRight', fontSize: 9, fill: '#10b981' }} />
              <Tooltip
                contentStyle={{ fontSize: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                formatter={(value: any, name: any) => [
                  name === 'trx' ? Number(value).toLocaleString() : `${value}%`,
                  name === 'trx' ? 'Prescriptions (TRx)' : 'Engagement %',
                ]}
              />
              <Legend
                wrapperStyle={{ fontSize: '10px' }}
                formatter={(value: string) => value === 'trx' ? 'Prescriptions (TRx)' : 'Engagement %'}
              />
              <Bar yAxisId="left" dataKey="trx" fill="#3b82f6" name="trx" radius={[2,2,0,0]} />
              <Line yAxisId="right" type="monotone" dataKey="engagement" stroke="#10b981"
                name="engagement" dot={{ fill: '#10b981', r: 3 }} strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
 
// ─── Insight Panel Tile ───────────────────────────────────────────────────────
 
function InsightTile({ tile }: { tile: any }) {
  const isPositive = tile.color === '#10B981' || tile.color === '#22C55E';
  const valueColor = tile.color === '#EF4444' || tile.color === '#DC2626'
    ? 'text-red-500'
    : tile.color === '#F97316' || tile.color === '#EA580C'
      ? 'text-orange-500'
      : tile.color === '#10B981' || tile.color === '#22C55E'
        ? 'text-emerald-600'
        : 'text-blue-600';
 
  return (
    <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-200 animate-fadeIn">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 mb-1 truncate">
        {tile.label}
      </p>
      <p className={`text-base font-bold ${valueColor}`}>{tile.value}</p>
      {tile.source && (
        <p className="text-[10px] text-blue-700 mt-0.5 bg-blue-100 rounded px-1.5 py-0.5 inline-block">
          {tile.source}
        </p>
      )}
      {tile.target && !tile.source && (
        <p className="text-xs text-slate-500 mt-0.5">Target: {tile.target}</p>
      )}
      {tile.trend && (
        <p className="text-[10px] text-slate-500 mt-0.5">{tile.trend}</p>
      )}
      {tile.variance && !tile.source && (
        <p className={`text-[10px] mt-0.5 font-medium ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
          {tile.variance}
        </p>
      )}
    </div>
  );
}
 
// ─── Compact Table ────────────────────────────────────────────────────────────
// Renders all rows without a scroll container so the full table is always visible.
 
function FullTable({ data }: { data: any[] }) {
  if (!data?.length) return null;
  const keys = Object.keys(data[0]);
  return (
    <div className="rounded-lg border border-slate-200 animate-fadeIn overflow-x-auto">
      <table className="min-w-full text-[10px] text-left border-collapse">
        <thead className="bg-slate-100 border-b border-slate-200">
          <tr>
            {keys.map(k => (
              <th key={k} className="px-2 py-1.5 font-semibold text-slate-700 whitespace-nowrap">
                {k.charAt(0).toUpperCase() + k.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row: any, i: number) => (
            <tr key={i} className="hover:bg-slate-50">
              {Object.values(row).map((val: any, j: number) => (
                <td key={j} className="px-2 py-1.5 text-slate-700 whitespace-nowrap">{String(val)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
 
// ─── Main Component ───────────────────────────────────────────────────────────
 
export default function ChatbotWorkshop() {
  const [messages, setMessages] = useState<MessageWithContent[]>([]);
  const [visitedStepIds, setVisitedStepIds] = useState<string[]>([]);
  const [panelIndex, setPanelIndex] = useState<number>(-1);
  const [inputValue, setInputValue] = useState('');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const latestMsgRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const streamingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const userName = 'Sarah';
 
  const panelStep = panelIndex >= 0
    ? INVOLEAD_DEMO_DATA.steps.find(s => s.id === visitedStepIds[panelIndex]) ?? null
    : null;
 
  // ── Auto-scroll to new answer ──
  useEffect(() => {
    if (messages.length === 0 || !latestMsgRef.current) return;
    const last = messages[messages.length - 1];
    
    // Scroll new assistant message to top for focus
    if (last.role === 'assistant') {
      // Multiple scroll attempts with increasing delays
      const doScroll = () => {
        if (latestMsgRef.current) {
          latestMsgRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = Math.max(0, latestMsgRef.current?.offsetTop ?? 0 - 100);
        }
      };
      
      doScroll();
      setTimeout(doScroll, 50);
      setTimeout(doScroll, 150);
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
        m.showFindings = true; m.showRecommendation = true;
        m.showTable = true; m.showGenerated = true;
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
        if (nextIdx > 280) m.showGenerated      = true;
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
        showFindings: false, showRecommendation: false,
        showTable: false, showGenerated: false,
      }]);
 
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
 
        {/* Navbar */}
        <header className="h-14 border-b border-slate-200 bg-white flex items-center px-6 justify-between shrink-0">
          <Image src="logo.svg" alt="Logo" height={8} width={110} priority />
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
                <h1 className="text-4xl font-light mb-6">
                  Hi <span className="text-blue-500 font-semibold">{userName}</span>,<br />
                  <span className="text-slate-900">How can I help you?</span>
                </h1>
                <div className={`bg-white rounded-lg p-3 mb-8 transition-all ${isFocused ? 'border-blue-500 ring-2 ring-blue-500' : 'border border-slate-200'}`}>
                  <div className="flex items-center gap-2">
                    <input type="text" placeholder="Ask anything..."
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 outline-none bg-transparent text-slate-700 placeholder-slate-400 text-sm py-1"
                    />
                    <button onClick={handleSendMessage} disabled={!inputValue.trim()}
                      className="p-1.5 hover:bg-slate-100 disabled:opacity-50 rounded-lg transition-colors shrink-0">
                      <Send size={14} className="text-slate-600" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
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
            <div className="flex-1 overflow-y-auto" ref={chatContainerRef}>
              {/* Reduced padding: p-4 instead of p-6, space-y-3 instead of space-y-6, pb-4 instead of pb-96 */}
              <div className="w-full p-4 space-y-3 pb-4">
                {messages.map((msg, idx) => {
                  const messageStep = msg.resolvedStepId
                    ? INVOLEAD_DEMO_DATA.steps.find(s => s.id === msg.resolvedStepId)
                    : undefined;
                  const isGenerateContent = msg.resolvedStepId === 'generate-content';
 
                  return (
                    <div key={idx} ref={idx === messages.length - 1 ? latestMsgRef : undefined} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`${msg.role === 'user' ? 'max-w-2xl' : 'w-full'} rounded-lg px-3 py-2.5 ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-50 border border-slate-200 text-slate-900'
                      }`}>
 
                        {msg.role === 'user' && (
                          <p className="leading-relaxed text-sm">{msg.content}</p>
                        )}
 
                        {msg.role === 'assistant' && (
                          <div className="space-y-2">
                            <p className="leading-relaxed text-sm whitespace-pre-wrap min-h-[1.25rem]">
                              {msg.displayedContent || (messageStep?.aiResponse ?? msg.content)}
                              {msg.isStreaming && (
                                <span className="inline-block w-1 h-4 bg-slate-900 ml-1 animate-pulse" />
                              )}
                            </p>
 
                            {/* Full table — no overflow scroll, always fully visible */}
                            {msg.showTable && messageStep?.tableData && (
                              <FullTable data={messageStep.tableData} />
                            )}
 
                            {msg.showAlert && messageStep?.hasAlert && (
                              <div className="flex gap-2 bg-red-50 border border-red-200 px-3 py-2 rounded-lg animate-fadeIn">
                                <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={14} />
                                <p className="text-xs text-red-800">{messageStep.hasAlert.text}</p>
                              </div>
                            )}
 
                            {msg.showDiagnosis && messageStep?.hasDiagnosis && (
                              <div className="bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg text-xs text-blue-900 animate-fadeIn">
                                {messageStep.hasDiagnosis}
                              </div>
                            )}
 
                            {msg.showDiagnosis && !messageStep?.findings && messageStep?.aiInsight && (
                              <div className="bg-purple-50 border border-purple-200 px-3 py-2 rounded-lg text-xs text-purple-900 animate-fadeIn">
                                {messageStep.aiInsight}
                              </div>
                            )}
 
                            {msg.showFindings && messageStep?.findings && (
                              <div className="space-y-1.5 animate-fadeIn">
                                {messageStep.findings.map((f: any, i: number) => (
                                  <div key={i} className={`flex gap-2 px-2.5 py-1.5 rounded-lg ${
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
                              <div className="bg-slate-100 px-3 py-2 rounded-lg text-xs animate-fadeIn">
                                <p className="font-semibold text-slate-900 mb-1">Recommendation:</p>
                                <p className="text-slate-700">{messageStep.aiRecommendation}</p>
                              </div>
                            )}
 
                            {/* Generated content block (Step 10 only) */}
                            {msg.showGenerated && isGenerateContent && messageStep && (
                              <GeneratedContentBlock step={messageStep} />
                            )}
 
                            {/* Suggestions */}
                            {!msg.isStreaming && idx === messages.length - 1 && messageStep?.suggestions && (
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {messageStep.suggestions.map((s: string, i: number) => (
                                  <button key={i} onClick={() => handleSuggestion(s)}
                                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-medium text-slate-700 transition-colors flex items-center gap-1">
                                    {s} <ChevronRight size={12} />
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
                    <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Loader size={14} className="animate-spin text-blue-600" />
                        <p className="text-sm text-slate-700">Thinking…</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6 Key Wins Section - Only show after post-campaign-performance step */}
                {messages.length > 0 && messages[messages.length - 1].resolvedStepId === 'post-campaign-performance' && (
                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">6 Key wins</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        {
                          title: "Content Effectiveness: Root Cause Diagnosis",
                          desc: "Business Effectiveness identified the channel was right (Rep-Triggered Email, efficiency 0.93) but content was wrong. Content Effectiveness pinpointed the exact content-persona mismatch — 68% Factual content aimed at General Prescribers while Innovators and Leaders (58% of prescribing value) were being ignored."
                        },
                        {
                          title: "Real-Time Market Intelligence",
                          desc: "DA Sense detected the 28% surge in tolerability discussions 90 days before traditional market research. This gave Roche a first-mover advantage in addressing the emerging HCP conversation with relevant content."
                        },
                        {
                          title: "Content Creator + Content Effectiveness: Rapid Asset Generation",
                          desc: "Content Creator generated 5 compliant assets in 4 minutes, each pre-tagged with archetype, audience, and persona data. Content Effectiveness provided the specs; Content Creator executed instantly."
                        },
                        {
                          title: "Next best Action: True n=1 Personalization",
                          desc: "Instead of segment-level campaigns, Personify delivered individualized next-best-action for all 62,000 HCPs. 74% recommendation acceptance rate confirms accuracy. Each HCP received the right content, through the right channel, at the right time."
                        },
                        {
                          title: "CRM: Unified Orchestration",
                          desc: "The Unified CRM ensured consistent execution across 15 countries. Average last touch for Innovators dropped from 34 to 8 days; for Leaders, from 41 to 11 days."
                        },
                        {
                          title: "Closed Loop: Continuous Learning",
                          desc: "DA Sense signals fed Personify. Content Effectiveness scores informed Content Creator. MARS optimization directed CRM orchestration. Personify acceptance rates validated persona models. Not six tools — one intelligent system."
                        }
                      ].map((win, idx) => (
                        <div key={idx} className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3 animate-fadeIn">
                          <h3 className="font-semibold mb-1.5 text-xs text-blue-900">Win {idx + 1} — {win.title}</h3>
                          <p className="text-xs leading-relaxed text-slate-700">{win.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={scrollRef} />
              </div>
            </div>
          )}
        </div>
 
        {/* ── Compact fixed input bar ── */}
        {messages.length > 0 && (
          <div className="bg-white px-4 py-2 shrink-0 border-t border-slate-200">
            <div className="w-full">
              <div className={`bg-white rounded-lg flex items-center gap-2 px-3 py-1.5 transition-all ${isFocused ? 'border-blue-500 ring-2 ring-blue-500' : 'border border-slate-200'}`}>
                <input type="text" placeholder="Ask anything…"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 outline-none bg-transparent text-slate-900 placeholder-slate-400 text-sm py-1"
                />
                <button onClick={handleSendMessage} disabled={!inputValue.trim()}
                  className="p-1.5 hover:bg-slate-100 disabled:opacity-50 rounded-lg transition-colors shrink-0">
                  <Send size={14} className="text-slate-600" />
                </button>
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
 
          {/* Panel header */}
          <div className="h-14 border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-sm">
              <BarChart3 size={18} className="text-blue-600" />
              Insights Dashboard
            </h3>
            <div className="flex items-center gap-0.5">
              <button onClick={() => setPanelIndex(i => i - 1)} disabled={!canGoPrev}
                className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft size={16} className="text-slate-600" />
              </button>
              {visitedStepIds.length > 0 && (
                <span className="text-xs text-slate-500 tabular-nums select-none w-12 text-center">
                  {panelIndex + 1} / {visitedStepIds.length}
                </span>
              )}
              <button onClick={() => setPanelIndex(i => i + 1)} disabled={!canGoNext}
                className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronRight size={16} className="text-slate-600" />
              </button>
              <div className="w-px h-5 bg-slate-200 mx-1.5" />
              <button onClick={() => setIsPanelOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} className="text-slate-600" />
              </button>
            </div>
          </div>
 
          {/* Context label */}
          {panelStep && (
            <div className="px-4 py-2 border-b border-slate-100 bg-slate-50 shrink-0">
              <p className="text-xs text-slate-500 truncate">
                <span className="font-medium text-slate-700">{panelStep.userPrompt}</span>
              </p>
            </div>
          )}
 
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {isThinking && !panelStep ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3"><SkeletonTile /><SkeletonTile /></div>
                <SkeletonChart /><SkeletonChart />
              </div>
 
            ) : panelStep ? (
 
              panelStep.id === 'generate-content' ? (
                <div className="space-y-3 animate-fadeIn">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'MLR Pre-Check',      value: panelStep.mlrCheck?.score,              color: '#10B981' },
                      { label: 'Brand Guidelines',   value: panelStep.mlrCheck?.brandGuidelines,    color: '#10B981' },
                      { label: 'Citations Verified', value: `${panelStep.mlrCheck?.citationsVerified}/23`, color: '#10B981' },
                      { label: 'Time to Generate',   value: panelStep.mlrCheck?.generationTime,     color: '#3B82F6' },
                    ].map((t, i) => (
                      <div key={i} className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5">
                        <p className="text-[10px] uppercase tracking-wide text-emerald-600 font-semibold mb-1">{t.label}</p>
                        <p className="text-base font-bold text-emerald-700">{t.value}</p>
                      </div>
                    ))}
                  </div>
                  <ChartBlock chart={{
                    type: 'bar',
                    title: 'Personify Distribution by Asset (HCPs)',
                    colors: { reach: '#3b82f6' },
                    data: [
                      { asset: 'Email',       reach: 8400  },
                      { asset: 'Banner',      reach: 6200  },
                      { asset: 'Infographic', reach: 4800  },
                      { asset: 'Portal',      reach: 9500  },
                    ],
                  }} />
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <h4 className="text-xs font-semibold text-slate-700 mb-2">Generated Assets</h4>
                    <div className="space-y-1.5">
                      {(panelStep.tableData ?? []).map((row: any, i: number) => (
                        <div key={i} className="flex items-center justify-between py-1 border-b border-slate-200 last:border-0">
                          <span className="text-xs font-medium text-slate-800">{row.asset}</span>
                          <span className="text-xs text-blue-700 font-semibold">{row.personifyDist}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
 
              ) : (
                <>
                  {panelStep.insightDashboard?.tiles && (
                    <div className={`grid gap-2 ${panelStep.insightDashboard.tiles.length >= 5 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                      {panelStep.insightDashboard.tiles.map((tile: any, i: number) => (
                        <InsightTile key={i} tile={tile} />
                      ))}
                    </div>
                  )}
 
                  {panelStep.insightDashboard?.charts?.map((chart: any, idx: number) => (
                    <ChartBlock key={`${panelStep.id}-${idx}`} chart={chart} />
                  ))}
                </>
              )
 
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
 
 
