"use client";

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Send, 
  Loader2, 
  MessageCircle, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useTheme } from '@/src/components/Theme/ThemeContext';

export default function AdminReportPage({ userRole }) {
  const { isDark } = useTheme();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [subject, setSubject] = useState('');
  const [reportedUserEmail, setReportedUserEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const fetchReports = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await fetch('/api/reports');
      const data = await res.json();
      if (res.ok) {
        setReports(data);
        // Mark unread replies as read when viewing
        data.forEach(async (report) => {
          if (report.replyStatus === 'unread') {
            await fetch(`/api/reports/${report._id}`, {
              method: 'PATCH',
              body: JSON.stringify({ replyStatus: 'read' }),
              headers: { 'Content-Type': 'application/json' }
            });
          }
        });
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // Real-time polling every 5 seconds
    const interval = setInterval(() => fetchReports(false), 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !message || !reportedUserEmail) return;

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message, reportedUserEmail })
      });

      if (res.ok) {
        setSuccess('Report submitted successfully to admin.');
        setSubject('');
        setReportedUserEmail('');
        setMessage('');
        fetchReports();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to submit report. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className={`text-3xl font-black tracking-tight flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <div className="p-2 rounded-2xl bg-red-500/10 text-red-500">
            <ShieldAlert size={28} />
          </div>
          Admin <span className="text-red-500">Report</span>
        </h1>
        <p className={`text-sm font-bold uppercase tracking-[0.2em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Direct communication with platform administrators
        </p>
      </div>

      {/* Submission Form */}
      <div className={`p-6 rounded-[2rem] border-2 transition-all duration-300 ${
        isDark ? 'bg-[var(--card)] border-white/10' : 'bg-white border-slate-100 shadow-xl'
      }`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What is this report about?"
              className={`w-full px-5 py-4 rounded-2xl border-2 outline-none transition-all font-bold ${
                isDark 
                ? 'bg-black/20 border-white/5 text-white focus:border-red-500/50' 
                : 'bg-slate-50 border-slate-100 text-slate-900 focus:border-red-500/30'
              }`}
              required
            />
          </div>

          <div className="space-y-2">
            <label className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              User Email to Report
            </label>
            <input
              type="email"
              value={reportedUserEmail}
              onChange={(e) => setReportedUserEmail(e.target.value)}
              placeholder="Enter the email of the user you are reporting"
              className={`w-full px-5 py-4 rounded-2xl border-2 outline-none transition-all font-bold ${
                isDark 
                ? 'bg-black/20 border-white/5 text-white focus:border-red-500/50' 
                : 'bg-slate-50 border-slate-100 text-slate-900 focus:border-red-500/30'
              }`}
              required
            />
          </div>

          <div className="space-y-2">
            <label className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Detailed Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue or feedback in detail..."
              rows={4}
              className={`w-full px-5 py-4 rounded-2xl border-2 outline-none transition-all font-bold resize-none ${
                isDark 
                ? 'bg-black/20 border-white/5 text-white focus:border-red-500/50' 
                : 'bg-slate-50 border-slate-100 text-slate-900 focus:border-red-500/30'
              }`}
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 text-red-500 text-sm font-bold">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-green-500/10 text-green-500 text-sm font-bold">
              <CheckCircle2 size={18} />
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest transition-all ${
              submitting 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
              : 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 active:scale-95'
            }`}
          >
            {submitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Send size={20} />
                Submit Report
              </>
            )}
          </button>
        </form>
      </div>

      {/* Reports History */}
      <div className="space-y-4">
        <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Report History
        </h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-red-500" size={32} />
          </div>
        ) : reports.length === 0 ? (
          <div className={`p-10 text-center rounded-[2rem] border-2 border-dashed ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <p className={`font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No reports submitted yet.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {reports.map((report) => (
              <div 
                key={report._id}
                className={`rounded-[2rem] border-2 overflow-hidden transition-all duration-300 ${
                  isDark ? 'bg-[var(--card)] border-white/10' : 'bg-white border-slate-100 shadow-md'
                }`}
              >
                <div 
                  className="p-5 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedId(expandedId === report._id ? null : report._id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${report.replyStatus === 'unread' ? 'bg-red-500/20 text-red-500 animate-pulse' : (isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-500')}`}>
                      <MessageCircle size={20} />
                    </div>
                    <div>
                      <h3 className={`font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{report.subject}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                          report.status === 'unread' ? 'bg-amber-500/10 text-amber-500' : 'bg-green-500/10 text-green-500'
                        }`}>
                          {report.status}
                        </span>
                        <span className={`text-[10px] flex items-center gap-1 font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          <Clock size={10} />
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {expandedId === report._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>

                {expandedId === report._id && (
                  <div className={`p-5 pt-0 border-t ${isDark ? 'border-white/5' : 'border-slate-50'}`}>
                    <div className="mt-4 space-y-4">
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Your Message</p>
                        <p className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{report.message}</p>
                      </div>

                      {report.adminReply ? (
                        <div className={`p-4 rounded-2xl border-l-4 border-red-500 ${isDark ? 'bg-white/5' : 'bg-red-50/50'}`}>
                          <p className={`text-[10px] font-black uppercase tracking-widest mb-1 text-red-500`}>Admin Reply</p>
                          <p className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{report.adminReply}</p>
                          <p className={`text-[10px] mt-2 font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            Replied on {new Date(report.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      ) : (
                        <div className={`p-4 rounded-2xl border-l-4 border-amber-500/50 ${isDark ? 'bg-white/5' : 'bg-amber-50/50'}`}>
                          <p className={`text-xs font-bold italic ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Waiting for admin response...</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

