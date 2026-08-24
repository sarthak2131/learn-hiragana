import React, { useState } from 'react';
import { ArrowLeft, RotateCcw, Sparkles, Trophy, Clock, Zap, Flame, Volume2, Target, CheckCircle2, XCircle, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import type { FontStyle, SessionStats } from '../../types';
import { FONT_CLASSES } from '../../hooks/useFont';

interface SessionResultsProps {
  stats: SessionStats;
  activeFont: FontStyle;
  onPracticeMistakes: () => void;
  onTryAgain: () => void;
  onChangeSetup: () => void;
  onGoHome: () => void;
  onPlayAudio?: (text: string) => void;
}

function formatTime(seconds: number): string {
  if (!seconds || seconds <= 0) return '0.0s';
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(1);
  return `${mins}m ${secs}s`;
}

export function SessionResults({
  stats,
  activeFont,
  onPracticeMistakes,
  onTryAgain,
  onChangeSetup,
  onGoHome,
  onPlayAudio,
}: SessionResultsProps) {
  const [showAllLogs, setShowAllLogs] = useState<boolean>(true);
  const [playingChar, setPlayingChar] = useState<string | null>(null);

  const logs = stats.characterLogs || [];

  // Identify Fastest Character (lowest time among correct answers)
  const correctLogs = logs.filter(l => l.isCorrect);
  const fastestChar = correctLogs.length > 0
    ? [...correctLogs].sort((a, b) => a.timeTakenSec - b.timeTakenSec)[0]
    : null;

  // Identify Slowest Character (highest time overall)
  const slowestChar = logs.length > 0
    ? [...logs].sort((a, b) => b.timeTakenSec - a.timeTakenSec)[0]
    : null;

  const handlePlayCharAudio = (char: string) => {
    if (!onPlayAudio) return;
    setPlayingChar(char);
    onPlayAudio(char);
    setTimeout(() => setPlayingChar(null), 1000);
  };

  const isNewBest = stats.isNewBestScore || stats.isNewBestTime;

  return (
    <section className="max-w-3xl mx-auto rounded-[2.5rem] bg-white dark:bg-[#151c2c] border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-2xl space-y-8 animate-fadeIn">
      
      {/* New Best Record Celebration Banner */}
      {isNewBest && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white shadow-xl text-center space-y-1 animate-pulse">
          <div className="flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest text-amber-200">
            <Trophy className="w-5 h-5 fill-amber-200 text-amber-500" />
            <span>New Personal Best Record! 🎉</span>
          </div>
          <p className="text-xs font-semibold opacity-90">
            {stats.isNewBestScore && stats.isNewBestTime
              ? 'New High Score & Fastest Completion Time achieved!'
              : stats.isNewBestScore
              ? 'Highest Accuracy Score achieved in your practice session!'
              : 'Fastest 100% Perfection Time achieved!'}
          </p>
        </div>
      )}

      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 dark:bg-rose-950/40 px-3.5 py-1 text-xs font-extrabold uppercase tracking-[0.24em] text-rose-700 dark:text-rose-300">
          <Sparkles className="w-4 h-4 text-rose-500" />
          <span>Session Complete & Complete Analysis</span>
        </div>
        <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
          Nice work! Momentum is building.
        </h3>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Here is your detailed time breakdown, accuracy analysis, and per-character speed report.
        </p>
      </div>

      {/* 4 Core Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <StatCard
          icon={<Target className="w-5 h-5 text-emerald-500" />}
          label="Accuracy Score"
          value={`${stats.scorePercent}%`}
          subtitle={`${stats.correctAnswers} of ${stats.totalQuestions} correct`}
        />
        <StatCard
          icon={<Clock className="w-5 h-5 text-rose-500" />}
          label="Total Time Taken"
          value={formatTime(stats.totalTimeSeconds)}
          subtitle="Full completion duration"
        />
        <StatCard
          icon={<Zap className="w-5 h-5 text-amber-500" />}
          label="Avg Speed / Char"
          value={`${stats.avgTimeSeconds.toFixed(1)}s`}
          subtitle="Per character recall"
        />
        <StatCard
          icon={<Flame className="w-5 h-5 text-purple-500" />}
          label="Best Streak"
          value={`${stats.bestStreak}`}
          subtitle="Consecutive correct"
        />
      </div>

      {/* High Scores & All-Time Personal Records Bar */}
      {stats.allTimeBest && (
        <div className="rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>All-Time Best Score Records (Stored)</span>
            </span>
            <span className="text-slate-400 dark:text-slate-500">
              {stats.allTimeBest.totalSessionsCompleted} Sessions Total
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-white dark:bg-[#151c2c] border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-[11px] font-bold text-slate-400 uppercase">High Score</div>
              <div className="text-lg font-black text-amber-600 dark:text-amber-400">
                {stats.allTimeBest.highScorePercent}%
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-[#151c2c] border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Fastest 100% Run</div>
              <div className="text-lg font-black text-rose-600 dark:text-rose-400">
                {stats.allTimeBest.bestTotalTimeSeconds ? formatTime(stats.allTimeBest.bestTotalTimeSeconds) : '—'}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-[#151c2c] border border-slate-200 dark:border-slate-800 text-center col-span-2 sm:col-span-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Max Streak</div>
              <div className="text-lg font-black text-purple-600 dark:text-purple-400">
                {stats.allTimeBest.bestStreak} 🔥
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Speed Highlights Cards: Fastest vs Slowest / Needs Focus */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Fastest Character Card */}
        <div className="p-5 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/30 dark:border-emerald-500/20 flex items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-500 fill-current" />
              <span>Fastest Character Recall</span>
            </div>
            {fastestChar ? (
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  Sound: <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400">"{fastestChar.romanization}"</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Time taken: <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{fastestChar.timeTakenSec.toFixed(1)}s</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500">No correct responses</div>
            )}
          </div>

          {fastestChar && (
            <div
              className={`w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border-2 border-emerald-500 flex items-center justify-center text-3xl font-black text-slate-900 dark:text-white shadow-md ${FONT_CLASSES[activeFont]}`}
            >
              {fastestChar.character}
            </div>
          )}
        </div>

        {/* Slowest Character / Focus Area Card */}
        <div className="p-5 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 dark:border-amber-500/20 flex items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-amber-500" />
              <span>Focus Area (Slowest Response)</span>
            </div>
            {slowestChar ? (
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  Sound: <span className="font-mono font-extrabold text-amber-600 dark:text-amber-400">"{slowestChar.romanization}"</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Time taken: <span className="font-extrabold text-amber-600 dark:text-amber-400">{slowestChar.timeTakenSec.toFixed(1)}s</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500">N/A</div>
            )}
          </div>

          {slowestChar && (
            <div
              className={`w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border-2 border-amber-500 flex items-center justify-center text-3xl font-black text-slate-900 dark:text-white shadow-md ${FONT_CLASSES[activeFont]}`}
            >
              {slowestChar.character}
            </div>
          )}
        </div>
      </div>

      {/* Per-Character Detailed Time & Accuracy Breakdown */}
      {logs.length > 0 && (
        <div className="rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-rose-500" />
                <span>Per-Character Time & Response Breakdown ({logs.length})</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Exact time spent on every character in this session
              </p>
            </div>

            <button
              onClick={() => setShowAllLogs(prev => !prev)}
              className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <span>{showAllLogs ? 'Collapse' : 'Expand All'}</span>
              {showAllLogs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showAllLogs && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {logs.map((log, index) => {
                const isFast = log.timeTakenSec <= 1.5;
                const isNormal = log.timeTakenSec > 1.5 && log.timeTakenSec <= 3.0;

                return (
                  <div
                    key={`${log.character}_${index}`}
                    className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 bg-white dark:bg-[#151c2c] transition-all shadow-xs ${
                      log.isCorrect
                        ? 'border-slate-200 dark:border-slate-800'
                        : 'border-rose-300 dark:border-rose-900/60 bg-rose-500/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Character Badge */}
                      <div
                        className={`w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl font-black text-slate-900 dark:text-white shrink-0 ${FONT_CLASSES[activeFont]}`}
                      >
                        {log.character}
                      </div>

                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>"{log.romanization}"</span>
                          {log.isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-0.5">
                          {/* Speed Badge Tag */}
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                              isFast
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : isNormal
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                            }`}
                          >
                            {isFast ? '⚡ Fast' : isNormal ? '🟢 Normal' : '🐢 Slow'}
                          </span>

                          <span className="text-xs font-mono font-extrabold text-slate-600 dark:text-slate-300">
                            {log.timeTakenSec.toFixed(1)}s
                          </span>
                        </div>
                      </div>
                    </div>

                    {onPlayAudio && (
                      <button
                        onClick={() => handlePlayCharAudio(log.character)}
                        className={`p-2 rounded-xl border text-xs font-bold transition-all shrink-0 ${
                          playingChar === log.character
                            ? 'bg-rose-600 text-white border-rose-600 scale-105'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-rose-400'
                        }`}
                        title="Listen audio"
                      >
                        <Volume2 className="w-4 h-4 text-rose-500" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Missed Characters Review Box */}
      <div className="rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-5 space-y-3">
        <div className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Missed Characters ({stats.missedCharacters.length})
        </div>
        <div className="flex flex-wrap gap-2.5">
          {stats.missedCharacters.length > 0 ? (
            stats.missedCharacters.map((char) => (
              <button
                key={char}
                onClick={() => onPlayAudio && onPlayAudio(char)}
                className={`rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-2xl font-black text-slate-900 dark:text-white shadow-xs hover:border-rose-500 transition-all ${FONT_CLASSES[activeFont]}`}
                title="Tap to hear sound"
              >
                {char}
              </button>
            ))
          ) : (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              🎉 Perfect Score! No missed characters in this session.
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
        <button
          onClick={onPracticeMistakes}
          disabled={stats.missedCharacters.length === 0}
          className="rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white px-5 py-4 text-sm font-extrabold shadow-lg shadow-rose-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Review Mistakes ({stats.missedCharacters.length})</span>
        </button>

        <button
          onClick={onTryAgain}
          className="rounded-2xl bg-amber-500 hover:bg-amber-600 text-white px-5 py-4 text-sm font-extrabold shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>

        <button
          onClick={onChangeSetup}
          className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-900 dark:text-white px-5 py-4 text-sm font-extrabold transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Change Setup</span>
        </button>

        <button
          onClick={onGoHome}
          className="rounded-2xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 px-5 py-4 text-sm font-extrabold shadow-md transition-all"
        >
          <span>Home Dashboard</span>
        </button>
      </div>

    </section>
  );
}

function StatCard({ icon, label, value, subtitle }: { icon: React.ReactNode; label: string; value: string; subtitle: string }) {
  return (
    <div className="rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 text-center space-y-1">
      <div className="flex justify-center mb-1">{icon}</div>
      <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</div>
      <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{value}</div>
      <div className="text-[10px] text-slate-400 dark:text-slate-500">{subtitle}</div>
    </div>
  );
}
