"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, LifeBuoy } from "lucide-react";
import { useTheme } from '../../../ThemeProvider'; 

// ─── Custom Hook for Local Storage ────────────────────────────────────────────
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn("Error reading localStorage", error);
    }
  }, [key]);

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (isMounted) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn("Error setting localStorage", error);
    }
  };

  return [storedValue, setValue];
}

// ─── Mock Data ───────────────────────────────────────────────────────────────
const INITIAL_TICKETS = [
  { id: "122011600", subject: "Managing Listing stendioom", created: "Sep 2, 2024", updated: "Sep 3, 2024", status: "Open", priority: "High", agent: "Dalene Brenman" },
  { id: "122011738", subject: "Billing Procient translation", created: "Sep 2, 2024", updated: "Sep 2, 2024", status: "In Progress", priority: "Medium", agent: "Bostin Miarin" },
  { id: "122011604", subject: "Support ticket teams", created: "Sep 2, 2024", updated: "Sep 3, 2024", status: "In Progress", priority: "Low", agent: "Adrean Folama" },
  { id: "122011539", subject: "API Documentation", created: "Sep 2, 2024", updated: "Sep 3, 2024", status: "Awaiting Reply", priority: "High", agent: "Alascah Rosber" },
  { id: "122011421", subject: "Property listing sync issue", created: "Sep 1, 2024", updated: "Sep 4, 2024", status: "Resolved", priority: "Medium", agent: "Glasan Islom" },
];

const KNOWLEDGE_BASE = [
  { id: 1, title: "How to review managing data commanding", category: "Data Management", views: 1240, helpful: 94 },
  { id: 2, title: "Managing Listings in Lead Generation", category: "Listings", views: 980, helpful: 88 },
  { id: 3, title: "Learn how to use Knowledge Base", category: "Getting Started", views: 3210, helpful: 97 },
  { id: 4, title: "Learn how to support account knowledge", category: "Account", views: 760, helpful: 85 },
  { id: 5, title: "How can we help you today? examination", category: "General", views: 540, helpful: 79 },
  { id: 6, title: "Setting up automated email notifications", category: "Email", views: 1100, helpful: 91 },
];

const TEAM_MEMBERS = [
  { rank: 1, name: "Dalene Brenman", role: "Agent", score: "24.2K", avatar: "DB", lightColor: "#4f46e5", darkColor: "#cddfa0" },
  { rank: 2, name: "Bostin Miarin", role: "Agent", score: "1.63K", avatar: "BM", lightColor: "#8b5cf6", darkColor: "#8b5cf6" },
  { rank: 3, name: "Adrean Folama", role: "Agent", score: "1.88K", avatar: "AF", lightColor: "#ec4899", darkColor: "#ec4899" },
  { rank: 4, name: "Alascah Rosber", role: "Agent", score: "576K", avatar: "AR", lightColor: "#f59e0b", darkColor: "#f59e0b" },
  { rank: 5, name: "Glasan Islom", role: "Agent", score: "225K", avatar: "GI", lightColor: "#10b981", darkColor: "#10b981" },
  { rank: 6, name: "Bragon Nasren", role: "Agent", score: "11.8K", avatar: "BN", lightColor: "#0ea5e9", darkColor: "#06b6d4" },
];

const ACTIVITY_FEED = [
  { id: 1, text: "Ticket #122011600 opened", time: "Sep 23, 2024, 10:15 AM", lightColor: "#ef4444", darkColor: "#ef4444" },
  { id: 2, text: "Agent assigned Ticket #122011738", time: "Sep 25, 2024, 10:15 AM", lightColor: "#4f46e5", darkColor: "#cddfa0" },
  { id: 3, text: "Agent 3 replied on Ticket #122011604", time: "Sep 25, 2024, 10:15 AM", lightColor: "#4f46e5", darkColor: "#cddfa0" },
  { id: 4, text: "Support Team resolved #122011421", time: "Sep 25, 2024, 10:19 PM", lightColor: "#10b981", darkColor: "#10b981" },
  { id: 5, text: "New knowledge article published", time: "Sep 25, 2024, 11:00 AM", lightColor: "#f59e0b", darkColor: "#f59e0b" },
];

function getStatusColors(status, isDark) {
  if (isDark) {
    const darkColors = {
      "Open": { bg: "#133c34", text: "#cddfa0", dot: "#cddfa0" },
      "In Progress": { bg: "#133c34", text: "#60a5fa", dot: "#60a5fa" },
      "Awaiting Reply": { bg: "#133c34", text: "#fbbf24", dot: "#fbbf24" },
      "Resolved": { bg: "#133c34", text: "#4ade80", dot: "#4ade80" },
      "Closed": { bg: "#133c34", text: "#f87171", dot: "#f87171" },
    };
    return darkColors[status] || { bg: "#1a4a40", text: "#aaa", dot: "#aaa" };
  }
  const lightColors = {
    "Open": { bg: "#fef2f2", text: "#ef4444", dot: "#ef4444" },
    "In Progress": { bg: "#eff6ff", text: "#3b82f6", dot: "#3b82f6" },
    "Awaiting Reply": { bg: "#fffbeb", text: "#f59e0b", dot: "#f59e0b" },
    "Resolved": { bg: "#f0fdf4", text: "#22c55e", dot: "#22c55e" },
    "Closed": { bg: "#f3f4f6", text: "#64748b", dot: "#64748b" },
  };
  return lightColors[status] || { bg: "#f1f5f9", text: "#64748b", dot: "#64748b" };
}

// ─── Sub Components ───────────────────────────────────────────────────────────
function StatusBadge({ status, isDark }) {
  const colors = getStatusColors(status, isDark);
  return (
    <span style={{
      background: colors.bg, color: colors.text, border: `1px solid ${colors.dot}${isDark ? '33' : '40'}`,
      padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700,
      display: "inline-flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
      width: "125px", justifyContent: "flex-start" 
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: colors.dot, display: "inline-block", flexShrink: 0 }} />
      {status}
    </span>
  );
}

function Avatar({ name, color, size = 32, isDark }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 800, color: (isDark && color === "#cddfa0") ? "#091a16" : "#ffffff", flexShrink: 0,
      fontFamily: "inherit", boxShadow: isDark ? "none" : "0 2px 4px rgba(0,0,0,0.1)"
    }}>
      {name}
    </div>
  );
}

function Card({ children, style = {}, isDark, className = "" }) {
  return (
    <div className={className} style={{
      background: isDark ? "rgba(19, 60, 52, 0.4)" : "#ffffff", 
      border: isDark ? "1px solid rgba(26, 74, 64, 0.6)" : "1px solid #e2e8f0", 
      borderRadius: 16, padding: "24px", 
      boxShadow: isDark ? "none" : "0 1px 3px rgba(0,0,0,0.02)", 
      backdropFilter: isDark ? "blur(10px)" : "none",
      ...style
    }}>
      {children}
    </div>
  );
}

// ─── Modals ───────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, isDark }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: isDark ? "rgba(0,0,0,0.75)" : "rgba(15, 23, 42, 0.4)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(4px)"
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: isDark ? "#091a16" : "#ffffff", 
        border: isDark ? "1px solid #1a4a40" : "1px solid #e2e8f0", 
        borderRadius: 20, padding: 28, width: "100%", maxWidth: 560, maxHeight: "85vh",
        overflowY: "auto", position: "relative", animation: "popIn 0.2s ease",
        boxShadow: isDark ? "0 20px 40px rgba(0,0,0,0.5)" : "0 25px 50px -12px rgba(0,0,0,0.25)"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: isDark ? "#f9fafb" : "#0f172a" }}>{title}</h2>
          <button onClick={onClose} style={{
            background: isDark ? "#1a4a40" : "#f1f5f9", border: "none", color: isDark ? "#cddfa0" : "#64748b", cursor: "pointer",
            width: 32, height: 32, borderRadius: 10, fontSize: 18, display: "flex",
            alignItems: "center", justifyContent: "center", transition: "background 0.2s"
          }} onMouseEnter={(e) => e.currentTarget.style.background = isDark ? "rgba(26, 74, 64, 0.8)" : "#e2e8f0"} onMouseLeave={(e) => e.currentTarget.style.background = isDark ? "#1a4a40" : "#f1f5f9"}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Guide Modal Content ──────────────────────────────────────────────────────
const GUIDE_CONTENT = {
  listings: { title: "Managing Listings", icon: "📋", sections: [ { heading: "Creating a New Listing", body: "Navigate to Properties > New Listing. Fill in the property details, upload photos, and set the pricing. Click 'Publish' to make it live." }, { heading: "Editing Existing Listings", body: "Find your listing under Properties > My Listings. Click the pencil icon to edit any field. Changes auto-save every 30 seconds." } ] },
  leads: { title: "Lead Generation Tips", icon: "💡", sections: [ { heading: "Setting Up Lead Capture Forms", body: "Go to Settings > Lead Forms to customize your capture forms. Add custom fields and automate follow-up sequences." }, { heading: "Lead Scoring", body: "Enable lead scoring under Analytics > Lead Intelligence. Scores are based on engagement, property views, and form submissions." } ] },
  billing: { title: "Billing & Account", icon: "💳", sections: [ { heading: "Viewing Your Invoices", body: "Access all invoices from Settings > Billing > Invoice History. Download PDFs or request resends directly from this page." }, { heading: "Updating Payment Methods", body: "Add or update credit cards under Settings > Billing > Payment Methods. We accept Visa, Mastercard, and AMEX." } ] },
  api: { title: "API Documentation", icon: "⚡", sections: [ { heading: "Getting Your API Key", body: "Go to Settings > API > Generate Key. Keep this key secret — it grants full access to your account data." }, { heading: "Authentication", body: "Include your API key in every request header: Authorization: Bearer YOUR_API_KEY. All endpoints use HTTPS." } ] }
};

// ─── Shared Inputs ────────────────────────────────────────────────────────────
const getInputStyle = (isDark) => ({
  width: "100%", background: isDark ? "rgba(19, 60, 52, 0.5)" : "#f8fafc", 
  border: isDark ? "1px solid #1a4a40" : "1px solid #e2e8f0", borderRadius: 10,
  color: isDark ? "#f9fafb" : "#0f172a", padding: "12px 16px", fontSize: 14, outline: "none",
  boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 0.2s"
});

// ─── Report Issue Modal ───────────────────────────────────────────────────────
function ReportIssueModal({ open, onClose, onSubmit, isDark }) {
  const [form, setForm] = useState({ title: "", severity: "Medium", description: "", steps: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!form.title || !form.description) return;
    const newId = `#${Math.floor(100000000 + Math.random() * 900000000)}`;
    onSubmit({ 
      id: newId, 
      subject: `[ISSUE] ${form.title}`, 
      priority: form.severity === "Critical" ? "High" : form.severity,
      category: "Bug Report" 
    });
    setSubmitted(true);
    setTimeout(() => { 
      setSubmitted(false); 
      setForm({ title: "", severity: "Medium", description: "", steps: "" }); 
      onClose(); 
    }, 2500);
  };

  const field = (label, key, type = "text", opts = null) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", color: isDark ? "#cddfa0" : "#475569", fontSize: 13, marginBottom: 6, fontWeight: 600 }}>{label}</label>
      {opts ? (
        <select value={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} style={getInputStyle(isDark)}>
          {opts.map((o) => <option key={o} value={o} style={{ background: isDark ? "#091a16" : "#fff", color: isDark ? "#fff" : "#000" }}>{o}</option>)}
        </select>
      ) : type === "textarea" ? (
        <textarea value={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
          rows={3} placeholder={`Enter ${label.toLowerCase()}...`} style={{ ...getInputStyle(isDark), resize: "vertical" }} onFocus={(e) => e.target.style.borderColor = isDark ? "#cddfa0" : "#4f46e5"} onBlur={(e) => e.target.style.borderColor = isDark ? "#1a4a40" : "#e2e8f0"} />
      ) : (
        <input value={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
          type={type} placeholder={`Enter ${label.toLowerCase()}...`} style={getInputStyle(isDark)} onFocus={(e) => e.target.style.borderColor = isDark ? "#cddfa0" : "#4f46e5"} onBlur={(e) => e.target.style.borderColor = isDark ? "#1a4a40" : "#e2e8f0"} />
      )}
    </div>
  );

  if (submitted) return (
    <Modal open={open} onClose={onClose} title="Report an Issue" isDark={isDark}>
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }} style={{ fontSize: 64, marginBottom: 16 }}>🚀</motion.div>
        <div style={{ color: isDark ? "#cddfa0" : "#0f172a", fontSize: 24, fontWeight: 800 }}>Issue Submitted Successfully!</div>
        <div style={{ color: isDark ? "#9ca3af" : "#64748b", fontSize: 15, marginTop: 10, lineHeight: 1.5 }}>
          Thank you for reporting this. Our technical team has been notified and a tracking ticket has been generated.
        </div>
      </div>
    </Modal>
  );

  return (
    <Modal open={open} onClose={onClose} title="Report a Technical Issue" isDark={isDark}>
      <p style={{ marginTop: 0, marginBottom: 20, fontSize: 14, color: isDark ? "#9ca3af" : "#64748b" }}>Found a bug or having a technical issue? Let us know below.</p>
      {field("Issue Title", "title")}
      {field("Severity Level", "severity", "select", ["Low", "Medium", "High", "Critical"])}
      {field("Issue Description", "description", "textarea")}
      {field("Steps to Reproduce (Optional)", "steps", "textarea")}
      
      <button onClick={handleSubmit} style={{
        width: "100%", background: isDark ? "linear-gradient(135deg, #f59e0b, #d97706)" : "#f59e0b", border: "none", borderRadius: 12,
        color: isDark ? "#451a03" : "#ffffff", padding: "14px", fontWeight: 700, fontSize: 15, cursor: "pointer",
        marginTop: 8, boxShadow: isDark ? "none" : "0 4px 12px rgba(245, 158, 11, 0.2)", transition: "opacity 0.2s"
      }} onMouseEnter={(e) => e.target.style.opacity = "0.9"} onMouseLeave={(e) => e.target.style.opacity = "1"}>
        Submit Issue Report →
      </button>
    </Modal>
  );
}

// ─── Submit Ticket Modal ──────────────────────────────────────────────────────
function SubmitTicketModal({ open, onClose, onSubmit, isDark }) {
  const [form, setForm] = useState({ subject: "", category: "General", priority: "Medium", description: "", email: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!form.subject || !form.description) return;
    const newId = `#${Math.floor(100000000 + Math.random() * 900000000)}`;
    onSubmit({ ...form, id: newId });
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setForm({ subject: "", category: "General", priority: "Medium", description: "", email: "" }); onClose(); }, 2000);
  };

  const field = (label, key, type = "text", opts = null) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", color: isDark ? "#cddfa0" : "#475569", fontSize: 13, marginBottom: 6, fontWeight: 600 }}>{label}</label>
      {opts ? (
        <select value={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} style={getInputStyle(isDark)}>
          {opts.map((o) => <option key={o} value={o} style={{ background: isDark ? "#091a16" : "#fff", color: isDark ? "#fff" : "#000" }}>{o}</option>)}
        </select>
      ) : type === "textarea" ? (
        <textarea value={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
          rows={4} placeholder={`Enter ${label.toLowerCase()}...`} style={{ ...getInputStyle(isDark), resize: "vertical" }} onFocus={(e) => e.target.style.borderColor = isDark ? "#cddfa0" : "#4f46e5"} onBlur={(e) => e.target.style.borderColor = isDark ? "#1a4a40" : "#e2e8f0"} />
      ) : (
        <input value={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
          type={type} placeholder={`Enter ${label.toLowerCase()}...`} style={getInputStyle(isDark)} onFocus={(e) => e.target.style.borderColor = isDark ? "#cddfa0" : "#4f46e5"} onBlur={(e) => e.target.style.borderColor = isDark ? "#1a4a40" : "#e2e8f0"} />
      )}
    </div>
  );

  if (submitted) return (
    <Modal open={open} onClose={onClose} title="Submit a Ticket" isDark={isDark}>
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
        <div style={{ color: isDark ? "#cddfa0" : "#0f172a", fontSize: 20, fontWeight: 800 }}>Ticket Submitted!</div>
        <div style={{ color: isDark ? "#9ca3af" : "#64748b", fontSize: 15, marginTop: 8 }}>Our team will respond within 2–4 hours.</div>
      </div>
    </Modal>
  );

  return (
    <Modal open={open} onClose={onClose} title="Submit a Support Ticket" isDark={isDark}>
      {field("Your Email", "email", "email")}
      {field("Subject", "subject")}
      {field("Category", "category", "select", ["General", "Listings", "Billing", "API", "Account", "Bug Report"])}
      {field("Priority", "priority", "select", ["Low", "Medium", "High", "Critical"])}
      {field("Description", "description", "textarea")}
      <button onClick={handleSubmit} style={{
        width: "100%", background: isDark ? "linear-gradient(135deg, #cddfa0, #aebf85)" : "#0f172a", border: "none", borderRadius: 12,
        color: isDark ? "#091a16" : "#ffffff", padding: "14px", fontWeight: 700, fontSize: 15, cursor: "pointer",
        marginTop: 8, boxShadow: isDark ? "none" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)", transition: "opacity 0.2s"
      }} onMouseEnter={(e) => e.target.style.opacity = "0.9"} onMouseLeave={(e) => e.target.style.opacity = "1"}>
        Submit Ticket →
      </button>
    </Modal>
  );
}

// ─── Ticket Detail Modal ──────────────────────────────────────────────────────
function TicketDetailModal({ open, onClose, ticket, onUpdateStatus, isDark }) {
  const [reply, setReply] = useState("");
  const [comments, setComments] = useState([{ from: "agent", text: "Hello! I'm looking into your issue right now.", time: "Sep 3, 2024" }]);

  if (!ticket) return null;

  const addReply = () => {
    if (!reply.trim()) return;
    setComments((p) => [...p, { from: "you", text: reply, time: "Just now" }]);
    setReply("");
  };

  return (
    <Modal open={open} onClose={onClose} title={`Ticket ${ticket.id}`} isDark={isDark}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        <StatusBadge status={ticket.status} isDark={isDark} />
        <span style={{ background: isDark ? "#1a4a40" : "#f8fafc", color: isDark ? "#cddfa0" : "#475569", border: isDark ? "none" : "1px solid #e2e8f0", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
          {ticket.priority} Priority
        </span>
        <span style={{ background: isDark ? "#1a4a40" : "#f8fafc", color: isDark ? "#cddfa0" : "#475569", border: isDark ? "none" : "1px solid #e2e8f0", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
          Assigned: {ticket.agent}
        </span>
      </div>
      <div style={{ background: isDark ? "rgba(19, 60, 52, 0.4)" : "#f8fafc", borderRadius: 12, border: isDark ? "none" : "1px solid #e2e8f0", padding: "16px", marginBottom: 20 }}>
        <div style={{ color: isDark ? "#f9fafb" : "#0f172a", fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{ticket.subject}</div>
        <div style={{ color: isDark ? "#9ca3af" : "#64748b", fontSize: 13 }}>Created {ticket.created} · Updated {ticket.updated}</div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ color: isDark ? "#cddfa0" : "#64748b", fontSize: 12, fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Thread</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {comments.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 12 }}>
              <Avatar name={c.from === "agent" ? "AG" : "YO"} color={c.from === "agent" ? (isDark ? "#cddfa0" : "#4f46e5") : "#10b981"} size={32} isDark={isDark} />
              <div style={{ background: isDark ? "#1a4a40" : "#f8fafc", border: isDark ? "none" : "1px solid #e2e8f0", borderRadius: 12, padding: "12px 16px", flex: 1 }}>
                <div style={{ color: isDark ? "#f9fafb" : "#0f172a", fontSize: 14, fontWeight: 500 }}>{c.text}</div>
                <div style={{ color: isDark ? "#9ca3af" : "#94a3b8", fontSize: 11, marginTop: 6 }}>{c.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <input value={reply} onChange={(e) => setReply(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addReply()}
          placeholder="Add a reply..." style={{ ...getInputStyle(isDark), flex: 1 }} 
          onFocus={(e) => e.target.style.borderColor = isDark ? "#cddfa0" : "#4f46e5"} onBlur={(e) => e.target.style.borderColor = isDark ? "#1a4a40" : "#e2e8f0"} />
        <button onClick={addReply} style={{ background: isDark ? "linear-gradient(135deg, #cddfa0, #aebf85)" : "#4f46e5", border: "none", borderRadius: 12, color: isDark ? "#091a16" : "#ffffff", padding: "12px 20px", cursor: "pointer", fontWeight: 700, boxShadow: isDark ? "none" : "0 4px 6px -1px rgba(79, 70, 229, 0.2)" }}>Reply</button>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
        {["Open", "In Progress", "Resolved", "Closed"].map((s) => (
          <button key={s} onClick={() => { onUpdateStatus(ticket.id, s); onClose(); }} style={{
            background: ticket.status === s ? (isDark ? "#cddfa0" : "#4f46e5") : (isDark ? "#1a4a40" : "#ffffff"),
            border: "1px solid", borderColor: ticket.status === s ? (isDark ? "#cddfa0" : "#4f46e5") : (isDark ? "#1a4a40" : "#e2e8f0"), borderRadius: 8, 
            color: ticket.status === s ? (isDark ? "#091a16" : "#ffffff") : (isDark ? "#9ca3af" : "#64748b"),
            padding: "8px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.2s"
          }} onMouseEnter={(e) => ticket.status !== s && (e.target.style.background = isDark ? "rgba(26, 74, 64, 0.8)" : "#f8fafc")} onMouseLeave={(e) => ticket.status !== s && (e.target.style.background = isDark ? "#1a4a40" : "#ffffff")}>
            {s}
          </button>
        ))}
      </div>
    </Modal>
  );
}

// ─── Guide Detail Modal ───────────────────────────────────────────────────────
function GuideModal({ open, onClose, guideKey, isDark }) {
  const guide = GUIDE_CONTENT[guideKey];
  if (!guide) return null;
  return (
    <Modal open={open} onClose={onClose} title={`${guide.icon} ${guide.title}`} isDark={isDark}>
      {guide.sections.map((s, i) => (
        <div key={i} style={{ marginBottom: 20, padding: "16px", background: isDark ? "rgba(19, 60, 52, 0.4)" : "#f8fafc", borderRadius: 12, border: isDark ? "none" : "1px solid #e2e8f0" }}>
          <div style={{ color: isDark ? "#cddfa0" : "#0f172a", fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{s.heading}</div>
          <div style={{ color: isDark ? "#d1d5db" : "#475569", fontSize: 14, lineHeight: 1.6 }}>{s.body}</div>
        </div>
      ))}
    </Modal>
  );
}

// ─── Email Modal ──────────────────────────────────────────────────────────────
function EmailModal({ open, onClose, isDark }) {
  const [form, setForm] = useState({ to: "support@nexusdesk.com", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const send = () => {
    if (!form.subject || !form.message) return;
    setSent(true);
    setTimeout(() => { setSent(false); setForm((p) => ({ ...p, subject: "", message: "" })); onClose(); }, 2000);
  };

  if (sent) return (
    <Modal open={open} onClose={onClose} title="Email Support" isDark={isDark}>
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>📧</div>
        <div style={{ color: isDark ? "#cddfa0" : "#0f172a", fontSize: 20, fontWeight: 800 }}>Email Sent!</div>
        <div style={{ color: isDark ? "#9ca3af" : "#64748b", fontSize: 15, marginTop: 8 }}>We'll reply within 24 hours.</div>
      </div>
    </Modal>
  );

  return (
    <Modal open={open} onClose={onClose} title="Email Support" isDark={isDark}>
      {[
        ["To", "to"], ["Subject", "subject"]
      ].map(([label, key]) => (
        <div key={key} style={{ marginBottom: 16 }}>
          <label style={{ display: "block", color: isDark ? "#cddfa0" : "#475569", fontSize: 13, marginBottom: 6, fontWeight: 600 }}>{label}</label>
          <input value={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
            style={getInputStyle(isDark)} readOnly={key === "to"} onFocus={(e) => !e.target.readOnly && (e.target.style.borderColor = isDark ? "#cddfa0" : "#4f46e5")} onBlur={(e) => !e.target.readOnly && (e.target.style.borderColor = isDark ? "#1a4a40" : "#e2e8f0")} />
        </div>
      ))}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", color: isDark ? "#cddfa0" : "#475569", fontSize: 13, marginBottom: 6, fontWeight: 600 }}>Message</label>
        <textarea value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
          rows={5} placeholder="Describe your issue in detail..." style={{ ...getInputStyle(isDark), resize: "vertical" }} onFocus={(e) => e.target.style.borderColor = isDark ? "#cddfa0" : "#4f46e5"} onBlur={(e) => e.target.style.borderColor = isDark ? "#1a4a40" : "#e2e8f0"} />
      </div>
      <button onClick={send} style={{
        width: "100%", background: isDark ? "linear-gradient(135deg, #cddfa0, #aebf85)" : "#0f172a", border: "none", borderRadius: 12,
        color: isDark ? "#091a16" : "#ffffff", padding: "14px", fontWeight: 700, fontSize: 15, cursor: "pointer",
        marginTop: 8, transition: "opacity 0.2s"
      }} onMouseEnter={(e) => e.target.style.opacity = "0.9"} onMouseLeave={(e) => e.target.style.opacity = "1"}>
        Send Email →
      </button>
    </Modal>
  );
}

// ─── New Ticket Quick Form ────────────────────────────────────────────────────
function InlineTicketForm({ onSubmit, isDark }) {
  const [val, setVal] = useState("");
  return (
    <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
      <input value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && val.trim() && (onSubmit({subject: val}), setVal(""))}
        placeholder="Describe your issue briefly..." style={{ ...getInputStyle(isDark), flex: 1, fontSize: 13 }} onFocus={(e) => e.target.style.borderColor = isDark ? "#cddfa0" : "#4f46e5"} onBlur={(e) => e.target.style.borderColor = isDark ? "#1a4a40" : "#e2e8f0"} />
      <button onClick={() => { if (val.trim()) { onSubmit({subject: val}); setVal(""); } }} style={{
        background: isDark ? "linear-gradient(135deg, #cddfa0, #aebf85)" : "#0f172a", border: "none", borderRadius: 10, color: isDark ? "#091a16" : "#ffffff",
        padding: "10px 16px", cursor: "pointer", fontWeight: 700, fontSize: 13, transition: "opacity 0.2s"
      }} onMouseEnter={(e) => e.target.style.opacity = "0.9"} onMouseLeave={(e) => e.target.style.opacity = "1"}>Submit</button>
    </div>
  );
}


// ─── Main Component ───────────────────────────────────────────────────────────
export default function SupportCenter() {
  const themeContext = useTheme(); 
  const isDark = themeContext ? themeContext.isDark : false;

  const [isLoading, setIsLoading] = useState(true);
  // Replaced standard state with useLocalStorage to persist tickets across reloads
  const [tickets, setTickets] = useLocalStorage("ue_support_tickets_v1", INITIAL_TICKETS);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [issueOpen, setIssueOpen] = useState(false);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [activeGuide, setActiveGuide] = useState(null);
  const [activeTicket, setActiveTicket] = useState(null);
  const [ticketFilter, setTicketFilter] = useState("All");
  const [toast, setToast] = useState(null);
  const [kbSearch, setKbSearch] = useState("");
  const [sortCol, setSortCol] = useState("updated");
  const [sortDir, setSortDir] = useState("desc");
  
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  // 1 Second Loading Simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Live Search Logic
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setSearchOpen(true);
    } else {
      setSearchOpen(false);
    }
  }, [searchQuery]);

  // Click outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddTicket = (data) => {
    const newTicket = {
      id: `12201${Math.floor(1000 + Math.random() * 9000)}`,
      subject: data.subject || data,
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), 
      updated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: "Open", priority: data.priority || "Medium", agent: "Unassigned"
    };
    setTickets((p) => [newTicket, ...p]);
    showToast(`Ticket ${newTicket.id} created successfully!`);
  };

  const handleUpdateStatus = (id, status) => {
    setTickets((p) => p.map((t) => t.id === id ? { ...t, status } : t));
    showToast(`Ticket ${id} updated to "${status}"`);
  };

  const filteredTickets = tickets.filter((t) => ticketFilter === "All" || t.status === ticketFilter);
  const kbFiltered = KNOWLEDGE_BASE.filter((a) => a.title.toLowerCase().includes(kbSearch.toLowerCase()));
  
  const liveSearchResults = [...KNOWLEDGE_BASE, ...tickets.map((t) => ({ id: t.id, title: t.subject, category: "Ticket" }))]
    .filter((r) => r.title?.toLowerCase().includes(searchQuery.toLowerCase()));

  const GUIDES = [
    { key: "listings", icon: "📋", title: "Managing Listings", desc: "Create, edit, and manage property listings effortlessly." },
    { key: "leads", icon: "💡", title: "Lead Generation Tips", desc: "Attract and convert more leads with proven strategies." },
    { key: "billing", icon: "💳", title: "Billing & Account", desc: "Manage invoices, payments, and subscription settings." },
    { key: "api", icon: "⚡", title: "API Documentation", desc: "Integrate with NexusDesk's powerful REST API." },
  ];

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: isDark ? '#091a16' : '#f8fafc', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ width: 44, height: 44, border: `4px solid ${isDark ? '#1a4a40' : '#e2e8f0'}`, borderTop: `4px solid ${isDark ? '#cddfa0' : '#4f46e5'}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <div style={{ marginTop: 20, color: isDark ? '#cddfa0' : '#475569', fontWeight: 700, fontSize: 15, letterSpacing: 1, textTransform: 'uppercase' }}>Loading Workspace...</div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className={isDark ? "theme-dark" : "theme-light"} style={{
      background: isDark ? "#091a16" : "#f8fafc", minHeight: "100vh", padding: "32px 24px",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: isDark ? "#f9fafb" : "#0f172a",
      boxSizing: "border-box", overflowX: "hidden", transition: "background 0.3s ease, color 0.3s ease"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: ${isDark ? "#091a16" : "#f1f5f9"}; }
        ::-webkit-scrollbar-thumb { background: ${isDark ? "#1a4a40" : "#cbd5e1"}; border-radius: 4px; }
        
        @keyframes popIn { from { transform: scale(0.96); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-4px); } }
        @keyframes slideIn { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        
        /* ─── DYNAMIC HOVER EFFECTS FOR DARK AND LIGHT MODE ─── */
        
        .theme-dark .guide-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px -8px rgba(205, 223, 160, 0.15) !important; border-color: rgba(205, 223, 160, 0.3) !important; cursor: pointer;}
        .theme-light .guide-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px -8px rgba(79, 70, 229, 0.15) !important; border-color: #cbd5e1 !important; cursor: pointer;}
        .guide-card { transition: all 0.2s ease; }

        .theme-dark .ticket-row:hover { background: rgba(19, 60, 52, 0.6) !important; cursor: pointer; }
        .theme-light .ticket-row:hover { background: #f8fafc !important; cursor: pointer; }
        .ticket-row { transition: background 0.15s; }

        .theme-dark .kb-item:hover { border-color: #cddfa0 !important; background: #1a4a40 !important; cursor: pointer;}
        .theme-light .kb-item:hover { border-color: #cbd5e1 !important; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); cursor: pointer;}
        .kb-item { transition: all 0.2s; }

        .btn-hover:hover { transform: translateY(-1px); box-shadow: 0 6px 12px -4px rgba(0,0,0,0.1); }
        .btn-hover:active { transform: translateY(0); }
        .btn-hover { transition: all 0.2s; }

        .theme-dark .contact-btn:hover { border-color: #fca5a5 !important; background: rgba(239, 68, 68, 0.1) !important; }
        .theme-light .contact-btn:hover { border-color: #fecaca !important; background: #fef2f2 !important; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .contact-btn { transition: all 0.2s; cursor: pointer; }

        .theme-dark .search-item:hover { background: #1a4a40 !important; }
        .theme-light .search-item:hover { background: #f1f5f9 !important; }
        
        /* Focus styles for the new pill search bar */
        .search-pill-container:focus-within {
           border-color: ${isDark ? "#cddfa0" : "#4f46e5"} !important;
           box-shadow: ${isDark ? "0 0 0 4px rgba(205, 223, 160, 0.1)" : "0 0 0 4px rgba(79, 70, 229, 0.1)"} !important;
        }

        /* Hover for Header Action Buttons */
        .header-chat-btn { transition: all 0.2s ease; }
        .theme-dark .header-chat-btn:hover { filter: brightness(1.1); box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.1) !important; transform: translateY(-2px); }
        .theme-light .header-chat-btn:hover { background: #fecaca !important; box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.2) !important; transform: translateY(-2px); }

        .header-ticket-btn { transition: all 0.2s ease; }
        .theme-dark .header-ticket-btn:hover { background: rgba(26, 74, 64, 0.9) !important; box-shadow: 0 10px 15px -3px rgba(26, 74, 64, 0.4) !important; transform: translateY(-2px); }
        .theme-light .header-ticket-btn:hover { background: #1e293b !important; box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.3) !important; transform: translateY(-2px); }

        /* Stats Card Hover */
        .stat-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: default; }
        .stat-card:hover { 
          transform: translateY(-4px); 
          box-shadow: ${isDark ? '0 12px 24px -8px rgba(0,0,0,0.5)' : '0 12px 24px -8px rgba(0,0,0,0.1)'} !important; 
        }

        /* Responsive Grids */
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
        .main-grid { display: grid; grid-template-columns: 1fr 380px; gap: 24px; }
        .guide-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }

        /* Media Queries for all devices */
        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .main-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .guide-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr; }
          .header-flex { flex-direction: column !important; align-items: stretch !important; gap: 16px; }
          .header-actions { justify-content: space-between; width: 100%; }
          .ticket-filter-group { flex-direction: column; align-items: stretch; gap: 12px; }
          
          /* 100% VISIBLE MOBILE SCROLLBAR FIX */
          .ticket-filter-buttons {
            display: flex;
            overflow-x: auto;
            white-space: nowrap;
            padding-bottom: 12px !important; /* Space for the scrollbar to sit */
            margin-bottom: 4px;
            width: 100%;
            -webkit-overflow-scrolling: touch;
            /* Firefox */
            scrollbar-width: thin !important;
            scrollbar-color: ${isDark ? '#cddfa0 rgba(255,255,255,0.1)' : '#4f46e5 rgba(0,0,0,0.1)'} !important;
          }
          /* WebKit (Chrome, Safari, iOS) */
          .ticket-filter-buttons::-webkit-scrollbar {
            height: 6px !important;
            -webkit-appearance: none !important;
            display: block !important;
          }
          .ticket-filter-buttons::-webkit-scrollbar-track {
            background: ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'} !important;
            border-radius: 10px !important;
          }
          .ticket-filter-buttons::-webkit-scrollbar-thumb {
            background: ${isDark ? '#cddfa0' : '#4f46e5'} !important;
            border-radius: 10px !important;
          }
        }
      `}</style>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)", zIndex: 2000,
          background: toast.type === "success" ? (isDark ? "#133c34" : "#f0fdf4") : (isDark ? "#7f1d1d" : "#fef2f2"),
          border: `1px solid ${toast.type === "success" ? (isDark ? "#cddfa0" : "#bbf7d0") : (isDark ? "#ef4444" : "#fecaca")}`,
          color: toast.type === "success" ? (isDark ? "#cddfa0" : "#166534") : (isDark ? "#fca5a5" : "#991b1b"),
          padding: "14px 24px", borderRadius: 12, fontSize: 14, fontWeight: 700,
          animation: "slideIn 0.3s ease", boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.5)" : "0 10px 25px -5px rgba(0,0,0,0.1)"
        }}>
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}

      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        
        {/* ── Header ── */}
        <div className="header-flex" style={{ marginBottom: 32, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            {/* ── Logo Section ── */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 140, height: 42,
                background: isDark ? "linear-gradient(135deg, rgba(205, 223, 160, 0.2), rgba(205, 223, 160, 0.05))" : "linear-gradient(135deg, #4f46e5, #4338ca)",
                border: isDark ? "1px solid rgba(205, 223, 160, 0.3)" : "none",
                color: isDark ? "#cddfa0" : "#fff",
                borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: "bold",
                boxShadow: isDark ? "0 0 20px rgba(205, 223, 160, 0.1)" : "0 8px 16px -4px rgba(79, 70, 229, 0.3)"
              }}>
                Admin Support
              </div>
            </div>

            {/* ── Title ── */}
            <h1 style={{ margin: 0, fontSize: 38, fontWeight: 900, letterSpacing: -1 }}>
              <span style={{ color: isDark ? "#f9fafb" : "#0f172a" }}>Support </span> 
              <span style={{ color: isDark ? "#cddfa0" : "#4f46e5" }}>Center</span>
            </h1>
            <p style={{ margin: "6px 0 0", color: isDark ? "#9ca3af" : "#64748b", fontSize: 15, fontWeight: 500 }}>
              <span style={{ color: isDark ? "#cddfa0" : "#4f46e5", fontWeight: 700 }}>{tickets.filter((t) => t.status === "Open" || t.status === "In Progress").length}</span> active tickets · {tickets.filter((t) => t.status === "Resolved").length} resolved
            </p>
          </div>
          
          {/* Header Buttons */}
          <div className="header-actions" style={{ display: "flex", gap: 14, flexWrap: "nowrap" }}>
            <button className="header-chat-btn" onClick={() => setIssueOpen(true)} style={{
              background: isDark ? "linear-gradient(135deg, #60a5fa, #ef4444)" : "#f59e0b", 
              border: isDark ? "none" : "none", borderRadius: 12,
              color: isDark ? "#450a0a" : "#fff", padding: "12px 20px", cursor: "pointer", fontWeight: 700, fontSize: 14,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flex: 1, whiteSpace: "nowrap",
              boxShadow: isDark ? "0 4px 12px rgba(239, 68, 68, 0.2)" : "0 4px 12px rgba(245, 158, 11, 0.2)"
            }}>
              ⚠️ Report Issue
            </button>
            <button className="header-ticket-btn" onClick={() => setTicketModalOpen(true)} style={{
              background: isDark ? "rgba(19, 60, 52, 0.5)" : "#0f172a", 
              border: isDark ? "1px solid #1a4a40" : "1px solid #0f172a", borderRadius: 12,
              color: isDark ? "#cddfa0" : "#ffffff", padding: "12px 24px", cursor: "pointer", fontWeight: 700, fontSize: 14, flex: 1, whiteSpace: "nowrap",
              boxShadow: isDark ? "none" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <span style={{ fontSize: 24, marginRight: 6, lineHeight: 0.8 }}>+</span> New Ticket
            </button>
          </div>
        </div>

        {/* ── Updated & Unique "Pill" Search Box ── */}
        <div style={{ marginBottom: 40, display: "flex", justifyContent: "center" }} ref={searchContainerRef}>
          <div 
            className="search-pill-container"
            style={{
              position: "relative",
              width: "100%", maxWidth: "700px",
              background: isDark ? "linear-gradient(145deg, #0f2922, #133c34)" : "#ffffff",
              border: isDark ? "1px solid rgba(205, 223, 160, 0.3)" : "1px solid #cbd5e1",
              borderRadius: "100px", // Pill shape
              padding: "6px", // Inner gap
              display: "flex", alignItems: "center",
              boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.4)" : "0 8px 30px rgba(79, 70, 229, 0.08)",
              transition: "all 0.3s ease"
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              background: isDark ? "rgba(205, 223, 160, 0.15)" : "#f1f5f9",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: isDark ? "#cddfa0" : "#4f46e5", flexShrink: 0, marginLeft: 4
            }}>
              <Search size={22} />
            </div>
            
            <input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickets, guides, and knowledge base..."
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                color: isDark ? "#f9fafb" : "#0f172a", fontSize: 16, fontWeight: 500,
                padding: "0 16px", minWidth: 0
              }}
              onFocus={() => { if (searchQuery) setSearchOpen(true); }}
            />

            {searchQuery && (
              <button onClick={() => { setSearchQuery(""); setSearchOpen(false); searchInputRef.current?.focus(); }} style={{
                width: 36, height: 36, borderRadius: "50%", border: "none",
                background: isDark ? "rgba(239, 68, 68, 0.15)" : "#fee2e2",
                color: isDark ? "#fca5a5" : "#ef4444", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginRight: 6, flexShrink: 0, transition: "background 0.2s"
              }}>
                <X size={18} />
              </button>
            )}

            {/* Floating Dropdown for Search */}
            {searchOpen && searchQuery && (
              <div style={{
                position: "absolute", top: "calc(100% + 16px)", left: 0, right: 0, 
                background: isDark ? "#091a16" : "#ffffff", 
                border: isDark ? "1px solid #1a4a40" : "1px solid #e2e8f0", 
                borderRadius: 20, boxShadow: isDark ? "0 20px 40px rgba(0,0,0,0.6)" : "0 20px 40px -5px rgba(0, 0, 0, 0.1)", 
                zIndex: 100, maxHeight: 400, overflowY: "auto", padding: "12px"
              }}>
                {liveSearchResults.length === 0 ? (
                  <div style={{ padding: "40px", textAlign: "center", color: isDark ? "#9ca3af" : "#64748b", fontWeight: 500 }}>No results found for "{searchQuery}"</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {liveSearchResults.map((r, i) => (
                      <div key={i} className="search-item" onClick={() => { setSearchQuery(""); setSearchOpen(false); showToast(`Opening: ${r.title}`); }} style={{ 
                        padding: "14px 18px", borderRadius: 14, cursor: "pointer", transition: "background 0.15s",
                        display: "flex", flexDirection: "column", gap: 6
                      }}>
                        <div style={{ color: isDark ? "#f9fafb" : "#0f172a", fontWeight: 600, fontSize: 15 }}>{r.title}</div>
                        <div style={{ color: isDark ? "#cddfa0" : "#4f46e5", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{r.category}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Professional Stats Row ── */}
        <div className="stats-grid">
          {[
            { label: "Total Tickets", value: tickets.length, icon: "🎫", lightColor: "#4f46e5", lightBg: "#e0e7ff", darkColor: "#cddfa0", darkBg: "rgba(205, 223, 160, 0.1)" },
            { label: "Open", value: tickets.filter((t) => t.status === "Open").length, icon: "🔴", lightColor: "#ef4444", lightBg: "#fef2f2", darkColor: "#ef4444", darkBg: "rgba(239, 68, 68, 0.1)" },
            { label: "In Progress", value: tickets.filter((t) => t.status === "In Progress").length, icon: "🔵", lightColor: "#3b82f6", lightBg: "#eff6ff", darkColor: "#60a5fa", darkBg: "rgba(96, 165, 250, 0.1)" },
            { label: "Resolved", value: tickets.filter((t) => t.status === "Resolved").length, icon: "✅", lightColor: "#10b981", lightBg: "#f0fdf4", darkColor: "#4ade80", darkBg: "rgba(74, 222, 128, 0.1)" },
          ].map((s, i) => (
            <Card key={i} isDark={isDark} className="stat-card" style={{ 
              padding: "24px", display: "flex", alignItems: "center", gap: 18,
              background: isDark ? "linear-gradient(145deg, rgba(19, 60, 52, 0.6), rgba(15, 41, 34, 0.8))" : "#ffffff",
              border: isDark ? "1px solid rgba(26, 74, 64, 0.8)" : "1px solid #e2e8f0"
            }}>
              <div style={{ 
                width: 54, height: 54, background: isDark ? s.darkBg : s.lightBg, 
                border: isDark ? `1px solid ${s.darkColor}40` : `1px solid ${s.lightColor}33`, 
                borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", 
                fontSize: 24, boxShadow: isDark ? `0 8px 16px ${s.darkColor}20` : `0 4px 12px ${s.lightColor}15` 
              }}>{s.icon}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                <div style={{ color: isDark ? "#9ca3af" : "#64748b", fontSize: 13, fontWeight: 700, letterSpacing: 0.5 }}>{s.label}</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: isDark ? s.darkColor : s.lightColor, lineHeight: 1 }}>{s.value}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* ── Main Grid ── */}
        <div className="main-grid">

          {/* ── Left Column ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>

            {/* Quick Help Guides */}
            <Card isDark={isDark}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: isDark ? "#f9fafb" : "#0f172a" }}>Quick Help Guides</h2>
                <span style={{ color: isDark ? "#cddfa0" : "#4f46e5", fontSize: 12, fontWeight: 700, background: isDark ? "rgba(205, 223, 160, 0.1)" : "#e0e7ff", padding: "4px 12px", borderRadius: 20 }}>4 guides</span>
              </div>
              <div className="guide-grid">
                {GUIDES.map((g) => (
                  <div key={g.key} className="guide-card" onClick={() => setActiveGuide(g.key)} style={{
                    background: isDark ? "rgba(19, 60, 52, 0.5)" : "#ffffff", border: isDark ? "1px solid #1a4a40" : "1px solid #e2e8f0", borderRadius: 16, padding: "20px"
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 14 }}>{g.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 6, color: isDark ? "#f9fafb" : "#0f172a" }}>{g.title}</div>
                    <div style={{ color: isDark ? "#9ca3af" : "#64748b", fontSize: 13, lineHeight: 1.6 }}>{g.desc}</div>
                    <div style={{ color: isDark ? "#cddfa0" : "#4f46e5", fontSize: 13, marginTop: 14, fontWeight: 700 }}>Read Guide →</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Contact Options */}
            <Card isDark={isDark}>
              <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 800, color: isDark ? "#f9fafb" : "#0f172a" }}>Contact Options</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Report Issue */}
                <div className="contact-btn" onClick={() => setIssueOpen(true)} style={{
                  background: isDark ? "rgba(19, 60, 52, 0.4)" : "#ffffff", border: isDark ? "1px solid #1a4a40" : "1px solid #e2e8f0", borderRadius: 14,
                  padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ fontSize: 26 }}>⚠️</div>
                    <div><div style={{ fontWeight: 700, fontSize: 15, color: isDark ? "#f9fafb" : "#0f172a" }}>Report an Issue</div><div style={{ color: isDark ? "#9ca3af" : "#64748b", fontSize: 13, marginTop: 2 }}>Having a bug? Let us know immediately</div></div>
                  </div>
                  <span style={{ color: isDark ? "#fca5a5" : "#ef4444", fontSize: 24, fontWeight: 300 }}>›</span>
                </div>

                {/* Submit Ticket */}
                <div className="contact-btn" onClick={() => setTicketModalOpen(true)} style={{
                  background: isDark ? "rgba(19, 60, 52, 0.4)" : "#ffffff", border: isDark ? "1px solid #1a4a40" : "1px solid #e2e8f0", borderRadius: 14, padding: "18px 20px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
                    <div style={{ fontSize: 26 }}>🎫</div>
                    <div><div style={{ fontWeight: 700, fontSize: 15, color: isDark ? "#f9fafb" : "#0f172a" }}>Submit a Ticket</div><div style={{ color: isDark ? "#9ca3af" : "#64748b", fontSize: 13, marginTop: 2 }}>We'll respond within 2–4 hours</div></div>
                  </div>
                  <InlineTicketForm onSubmit={handleAddTicket} isDark={isDark} />
                </div>

                {/* Email */}
                <div className="contact-btn" onClick={() => setEmailOpen(true)} style={{
                  background: isDark ? "rgba(19, 60, 52, 0.4)" : "#ffffff", border: isDark ? "1px solid #1a4a40" : "1px solid #e2e8f0", borderRadius: 14,
                  padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ fontSize: 26 }}>📧</div>
                    <div><div style={{ fontWeight: 700, fontSize: 15, color: isDark ? "#f9fafb" : "#0f172a" }}>Email Us</div><div style={{ color: isDark ? "#9ca3af" : "#64748b", fontSize: 13, marginTop: 2 }}>support@nexusdesk.com</div></div>
                  </div>
                  <span style={{ color: isDark ? "#cddfa0" : "#cbd5e1", fontSize: 24, fontWeight: 300 }}>›</span>
                </div>
              </div>
            </Card>

            {/* Open Tickets */}
            <Card isDark={isDark}>
              <div className="ticket-filter-group" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: isDark ? "#f9fafb" : "#0f172a" }}>Open Tickets</h2>
                {/* ── Updated CSS handles the visible mobile scrollbar here ── */}
                <div className="ticket-filter-buttons" style={{ display: "flex", gap: 8 }}>
                  {["All", "Open", "In Progress", "Awaiting Reply", "Resolved"].map((f) => (
                    <button key={f} onClick={() => setTicketFilter(f)} style={{
                      background: ticketFilter === f ? (isDark ? "#cddfa0" : "#0f172a") : (isDark ? "#1a4a40" : "#f1f5f9"),
                      border: "none", borderRadius: 10, color: ticketFilter === f ? (isDark ? "#091a16" : "#ffffff") : (isDark ? "#f9fafb" : "#475569"),
                      padding: "8px 14px", cursor: "pointer", fontSize: 12, fontWeight: 700, transition: "all 0.2s", flexShrink: 0
                    }}>{f}</button>
                  ))}
                </div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
                  <thead>
                    <tr style={{ borderBottom: isDark ? "2px solid #1a4a40" : "2px solid #f1f5f9" }}>
                      {[["id", "Ticket ID"], ["subject", "Subject"], ["created", "Created"], ["updated", "Last Updated"], ["status", "Status"]].map(([col, label]) => (
                        <th key={col} onClick={() => { setSortCol(col); setSortDir((d) => d === "asc" ? "desc" : "asc"); }} style={{
                          textAlign: "left", padding: "12px", color: isDark ? "#cddfa0" : "#64748b", fontSize: 12,
                          fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5,
                          cursor: "pointer", userSelect: "none", whiteSpace: "nowrap"
                        }}>
                          {label} {sortCol === col ? (sortDir === "asc" ? "↑" : "↓") : ""}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: "center", color: isDark ? "#9ca3af" : "#64748b", padding: "40px", fontSize: 14 }}>No tickets found</td></tr>
                    ) : filteredTickets.map((t) => (
                      <tr key={t.id} className="ticket-row" onClick={() => setActiveTicket(t)} style={{ borderBottom: isDark ? "1px solid rgba(26, 74, 64, 0.4)" : "1px solid #f1f5f9" }}>
                        <td style={{ padding: "16px 12px", color: isDark ? "#cddfa0" : "#4f46e5", fontSize: 13, fontWeight: 800 }}>{t.id}</td>
                        <td style={{ padding: "16px 12px", color: isDark ? "#f9fafb" : "#0f172a", fontSize: 14, fontWeight: 600 }}>{t.subject}</td>
                        <td style={{ padding: "16px 12px", color: isDark ? "#9ca3af" : "#64748b", fontSize: 13, whiteSpace: "nowrap" }}>{t.created}</td>
                        <td style={{ padding: "16px 12px", color: isDark ? "#9ca3af" : "#64748b", fontSize: 13, whiteSpace: "nowrap" }}>{t.updated}</td>
                        <td style={{ padding: "16px 12px" }}><StatusBadge status={t.status} isDark={isDark} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Knowledge Base */}
            <Card isDark={isDark}>
              <div className="ticket-filter-group" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: isDark ? "#f9fafb" : "#0f172a" }}>Knowledge Base</h2>
                <div style={{ position: "relative", width: "100%", maxWidth: "240px" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: isDark ? "#9ca3af" : "#94a3b8", fontSize: 14 }}>🔍</span>
                  <input value={kbSearch} onChange={(e) => setKbSearch(e.target.value)} placeholder="Filter articles..."
                    style={{ ...getInputStyle(isDark), padding: "10px 14px 10px 36px", fontSize: 13 }} onFocus={(e) => e.target.style.borderColor = isDark ? "#cddfa0" : "#4f46e5"} onBlur={(e) => e.target.style.borderColor = isDark ? "#1a4a40" : "#e2e8f0"} />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {kbFiltered.map((a) => (
                  <div key={a.id} className="kb-item" style={{ background: isDark ? "rgba(19, 60, 52, 0.4)" : "#ffffff", border: isDark ? "1px solid transparent" : "1px solid #e2e8f0", padding: "16px", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ color: isDark ? "#f9fafb" : "#0f172a", fontSize: 14, fontWeight: 700 }}>{a.title}</div>
                      <div style={{ color: isDark ? "#9ca3af" : "#64748b", fontSize: 13, marginTop: 6 }}>{a.category} · {a.views.toLocaleString()} views</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: isDark ? "#cddfa0" : "#10b981", fontSize: 13, fontWeight: 800, whiteSpace: "nowrap", marginLeft: 12 }}>
                      <span>👍</span> {a.helpful}%
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* ── Right Column ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Support Activity */}
            <Card isDark={isDark}>
              <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 800, color: isDark ? "#f9fafb" : "#0f172a" }}>Support Activity</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {ACTIVITY_FEED.map((a) => (
                  <div key={a.id} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: isDark ? a.darkColor : a.lightColor, marginTop: 5, flexShrink: 0, boxShadow: `0 0 0 4px ${isDark ? a.darkColor : a.lightColor}20` }} />
                    <div>
                      <div style={{ color: isDark ? "#e5e7eb" : "#334155", fontSize: 14, lineHeight: 1.5, fontWeight: 600 }}>{a.text}</div>
                      <div style={{ color: isDark ? "#9ca3af" : "#94a3b8", fontSize: 12, marginTop: 4, fontWeight: 500 }}>{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Support Team Leaderboard */}
            <Card isDark={isDark}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: isDark ? "#f9fafb" : "#0f172a" }}>Support Team</h2>
                <span style={{ background: isDark ? "#133c34" : "#e0e7ff", border: isDark ? "1px solid #1a4a40" : "none", color: isDark ? "#cddfa0" : "#4f46e5", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 800 }}>Online</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: isDark ? "#cddfa0" : "#94a3b8", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 14, padding: "0 6px" }}>
                <span>Ranking</span><span>Leaderboard</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {TEAM_MEMBERS.map((m) => (
                  <div key={m.rank} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px", borderRadius: 14, background: m.rank === 1 ? (isDark ? "rgba(26, 74, 64, 0.6)" : "#f8fafc") : "transparent", border: m.rank === 1 ? (isDark ? "1px solid transparent" : "1px solid #e2e8f0") : "1px solid transparent", transition: "all 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = isDark ? "rgba(26, 74, 64, 0.6)" : "#f8fafc"}
                    onMouseLeave={(e) => e.currentTarget.style.background = m.rank === 1 ? (isDark ? "rgba(26, 74, 64, 0.6)" : "#f8fafc") : "transparent"}>
                    <span style={{ color: m.rank <= 3 ? (isDark ? "#cddfa0" : "#4f46e5") : "#94a3b8", fontWeight: 800, fontSize: 15, width: 20, textAlign: "center" }}>{m.rank}</span>
                    <Avatar name={m.avatar} color={isDark ? m.darkColor : m.lightColor} size={36} isDark={isDark} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: isDark ? "#f9fafb" : "#0f172a", fontSize: 14, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</div>
                      <div style={{ color: isDark ? "#9ca3af" : "#64748b", fontSize: 12, marginTop: 2 }}>{m.role}</div>
                    </div>
                    <div style={{ color: isDark ? "#cddfa0" : "#0f172a", fontSize: 14, fontWeight: 800 }}>{m.score}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Ticket Status Summary */}
            <Card isDark={isDark}>
              <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 800, color: isDark ? "#f9fafb" : "#0f172a" }}>Ticket Status</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {Object.entries(
                  tickets.reduce((acc, t) => { acc[t.status] = (acc[t.status] || 0) + 1; return acc; }, {})
                ).map(([status, count]) => {
                  const pct = Math.round((count / tickets.length) * 100);
                  const c = getStatusColors(status, isDark).dot;
                  return (
                    <div key={status}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ color: isDark ? "#e5e7eb" : "#475569", fontSize: 13, fontWeight: 600 }}>{status}</span>
                        <span style={{ color: isDark ? c : "#0f172a", fontSize: 14, fontWeight: 800 }}>{count}</span>
                      </div>
                      <div style={{ background: isDark ? "#1a4a40" : "#f1f5f9", borderRadius: 8, height: 8, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: c, borderRadius: 8, transition: "width 0.5s ease" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card isDark={isDark}>
              <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 800, color: isDark ? "#f9fafb" : "#0f172a" }}>Quick Actions</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { icon: "⚠️", label: "Report an Issue", action: () => setIssueOpen(true), lightColor: "#ef4444", lightBg: "#fee2e2", darkColor: "#fca5a5", darkBg: "rgba(239, 68, 68, 0.1)" },
                  { icon: "🎫", label: "New Ticket", action: () => setTicketModalOpen(true), lightColor: "#4f46e5", lightBg: "#e0e7ff", darkColor: "#cddfa0", darkBg: "rgba(205, 223, 160, 0.1)" },
                  { icon: "📧", label: "Email Support", action: () => setEmailOpen(true), lightColor: "#0ea5e9", lightBg: "#e0f2fe", darkColor: "#06b6d4", darkBg: "rgba(6, 182, 212, 0.1)" },
                  { icon: "📋", label: "Managing Listings Guide", action: () => setActiveGuide("listings"), lightColor: "#10b981", lightBg: "#d1fae5", darkColor: "#10b981", darkBg: "rgba(16, 185, 129, 0.1)" },
                  { icon: "⚡", label: "API Documentation", action: () => setActiveGuide("api"), lightColor: "#f59e0b", lightBg: "#fef3c7", darkColor: "#f59e0b", darkBg: "rgba(245, 158, 11, 0.1)" },
                ].map((a, i) => (
                  <button key={i} className="btn-hover" onClick={a.action} style={{
                    background: isDark ? "rgba(19, 60, 52, 0.4)" : "#ffffff", border: isDark ? `1px solid #1a4a40` : `1px solid #e2e8f0`, borderRadius: 14,
                    color: isDark ? "#f9fafb" : "#0f172a", padding: "14px 16px", cursor: "pointer", fontWeight: 700,
                    fontSize: 14, textAlign: "left", display: "flex", alignItems: "center", gap: 14
                  }}>
                    <span style={{ background: isDark ? a.darkBg : a.lightBg, color: isDark ? a.darkColor : a.lightColor, borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{a.icon}</span>
                    {a.label}
                  </button>
                ))}
              </div>
            </Card>
            
            {/* ── System Status Card ── */}
            <Card isDark={isDark}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div style={{ position: "relative" }}>
                  <div style={{ width: 44, height: 44, background: isDark ? "rgba(205, 223, 160, 0.15)" : "#e0e7ff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>⚙️</div>
                  <span style={{ position: "absolute", bottom: -2, right: -2, background: "#10b981", width: 12, height: 12, borderRadius: "50%", border: isDark ? "2px solid #133c34" : "2px solid #ffffff" }}></span>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: isDark ? "#f9fafb" : "#0f172a" }}>System Status</h3>
                  <p style={{ margin: "4px 0 0", color: isDark ? "#9ca3af" : "#64748b", fontSize: 13, fontWeight: 500 }}>All services are online</p>
                </div>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["API Endpoints", "Database", "Web App"].map((sys) => (
                  <div key={sys} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: isDark ? "rgba(19, 60, 52, 0.4)" : "#f8fafc", border: isDark ? "1px solid #1a4a40" : "1px solid #e2e8f0", padding: "10px 14px", borderRadius: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: isDark ? "#d1d5db" : "#475569" }}>{sys}</span>
                    <span style={{ color: "#10b981", fontSize: 12, fontWeight: 800 }}>99.9% Uptime</span>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      <ReportIssueModal open={issueOpen} onClose={() => setIssueOpen(false)} onSubmit={handleAddTicket} isDark={isDark} />
      <SubmitTicketModal open={ticketModalOpen} onClose={() => setTicketModalOpen(false)} onSubmit={handleAddTicket} isDark={isDark} />
      <EmailModal open={emailOpen} onClose={() => setEmailOpen(false)} isDark={isDark} />
      <GuideModal open={!!activeGuide} onClose={() => setActiveGuide(null)} guideKey={activeGuide} isDark={isDark} />
      <TicketDetailModal open={!!activeTicket} onClose={() => setActiveTicket(null)} ticket={activeTicket} onUpdateStatus={handleUpdateStatus} isDark={isDark} />
      
    </div>
  );
}