import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PHASE_COLORS, PHASE_BG, PHASE_ICONS } from "../data/projects";
import AdminOrders from "../components/AdminOrders";
import AdminAppointments from "../components/AdminAppointments";
import AdminQuotes from "../components/AdminQuotes";

// Auth is handled server-side. We only keep a signed session token here; the
// real credentials never reach the browser.
const TOKEN_KEY = "emdad-admin-token";
const getToken = () => sessionStorage.getItem(TOKEN_KEY);
// Build headers for write requests, attaching the bearer token.
const authHeaders = (extra = {}) => {
  const token = getToken();
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const PHASES_EN = [
  "Consultation & Design",
  "Client Approval",
  "Manufacturing",
  "Finishing & QC",
  "Delivery",
  "Installation & Handover",
];
const TYPE_OPTIONS = [
  "Residential",
  "Commercial",
  "Government",
  "Exhibition",
  "Hospitality",
  "Mixed-Use",
];

// ── Tiny UI helpers ───────────────────────────────────────────────────────────
const Label = ({ children }) => (
  <p
    className="font-body text-[10px] tracking-[0.25em] uppercase mb-1.5"
    style={{ color: "rgba(28,25,23,0.4)" }}
  >
    {children}
  </p>
);
const Field = ({ label, children }) => (
  <div className="mb-5">
    <Label>{label}</Label>
    {children}
  </div>
);
const Input = ({ value, onChange, placeholder, type = "text" }) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full px-3 py-2.5 font-body text-sm outline-none transition-all"
    style={{
      border: "1px solid rgba(28,25,23,0.15)",
      background: "white",
      borderColor: value ? "#B8903C" : undefined,
    }}
  />
);

function formatFileSize(bytes) {
  if (!bytes) return "";
  const sizes = ["B", "KB", "MB", "GB"];
  let i = 0;
  let value = bytes;
  while (value >= 1024 && i < sizes.length - 1) {
    value /= 1024;
    i += 1;
  }
  return `${value.toFixed(1)} ${sizes[i]}`;
}

const SaveStatusToast = ({ status }) => (
  <AnimatePresence>
    {status && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="fixed bottom-8 right-8 flex items-center gap-3 px-5 py-3 z-50"
        style={{
          background: "#0D0B09",
          border: `1px solid ${status.success ? "rgba(59,109,17,0.4)" : "rgba(209,28,26,0.4)"}`,
        }}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke={status.success ? "#3B6D11" : "#D11C1A"}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={status.success ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}
          />
        </svg>
        <span className="font-body text-sm text-white">{status.message}</span>
      </motion.div>
    )}
  </AnimatePresence>
);

// ── Phase Selector ────────────────────────────────────────────────────────────
function PhaseSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {PHASES_EN.map((phase, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className="flex items-center gap-2 p-2.5 text-left transition-all duration-200"
          style={{
            background: value === i ? PHASE_BG[i] : "transparent",
            border: `1px solid ${value === i ? PHASE_COLORS[i] + "55" : "rgba(28,25,23,0.1)"}`,
            borderRadius: 2,
          }}
        >
          <span className="text-base flex-shrink-0">{PHASE_ICONS[i]}</span>
          <span
            className="font-body text-xs leading-tight"
            style={{
              color: value === i ? PHASE_COLORS[i] : "rgba(28,25,23,0.5)",
            }}
          >
            {phase}
          </span>
          {value === i && (
            <span
              className="ml-auto flex-shrink-0 w-2 h-2 rounded-full"
              style={{ background: PHASE_COLORS[i] }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

// ── Doc Row ───────────────────────────────────────────────────────────────────
function DocRow({ doc, onDelete }) {
  return (
    <div
      className="flex items-center gap-3 p-3 group"
      style={{ border: "1px solid rgba(184,144,60,0.1)", background: "white" }}
    >
      <svg
        className="w-4 h-4 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="#B8903C"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm text-onyx truncate">{doc.nameEn}</p>
        <p className="font-body text-[10px] text-charcoal/35">
          {doc.size} · {doc.date}
        </p>
      </div>
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center hover:bg-red-50 flex-shrink-0"
        style={{ border: "1px solid rgba(220,38,38,0.2)" }}
      >
        <svg
          className="w-3 h-3 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

// ── Update Row ────────────────────────────────────────────────────────────────
function UpdateRow({ upd, onDelete }) {
  return (
    <div
      className="flex gap-3 py-3 group"
      style={{ borderBottom: "1px solid rgba(184,144,60,0.08)" }}
    >
      <span className="text-base flex-shrink-0 mt-0.5">
        {PHASE_ICONS[upd.phase] || "📌"}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-body text-[10px] text-charcoal/35 mb-0.5">
          {upd.date} · {PHASES_EN[upd.phase]}
        </p>
        <p className="font-body text-sm text-charcoal/70 leading-relaxed">
          {upd.textEn}
        </p>
      </div>
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 flex-shrink-0 flex items-center justify-center hover:bg-red-50"
        style={{ border: "1px solid rgba(220,38,38,0.2)" }}
      >
        <svg
          className="w-3 h-3 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

// ── Main Admin Component ───────────────────────────────────────────────────────
export default function Admin() {
  // Optimistically trust a stored token, then confirm with the server on mount.
  const [authed, setAuthed] = useState(() => !!getToken());
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [projects, setProjects] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  // "projects" | "orders" | "appointments" — which dashboard section is showing.
  const [view, setView] = useState("projects");
  const [orders, setOrders] = useState([]);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [activeApptId, setActiveApptId] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [activeQuoteId, setActiveQuoteId] = useState(null);
  const [newDoc, setNewDoc] = useState({
    nameEn: "",
    nameAr: "",
    size: "",
    date: "",
    fileData: null,
    fileName: "",
    fileType: "",
  });
  const [newDocFile, setNewDocFile] = useState(null);
  const [newUpd, setNewUpd] = useState({
    date: "",
    phase: 0,
    textEn: "",
    textAr: "",
  });
  const [showDocForm, setShowDocForm] = useState(false);
  const [showUpdForm, setShowUpdForm] = useState(false);
  const [newItem, setNewItem] = useState({ nameEn: "", nameAr: "", qty: 1 });
  const [showItemForm, setShowItemForm] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to load projects");
      const data = await res.json();
      setProjects(data);
      setActiveId((current) => current || data[0]?.id || null);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  // ── Orders (customer inquiries) ──────────────────────────────────────────
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders", { headers: authHeaders() });
      if (res.status === 401) return handleAuthFailure();
      if (!res.ok) throw new Error("Failed to load orders");
      setOrders(await res.json());
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const markOrderRead = async (id) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ status: "read" }),
      });
      if (res.status === 401) return handleAuthFailure();
      if (res.ok)
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: "read" } : o)),
        );
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  const deleteOrder = async (id) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.status === 401) return handleAuthFailure();
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== id));
        setActiveOrderId((cur) => (cur === id ? null : cur));
      }
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  };

  // ── Appointments (showroom visit bookings) ───────────────────────────────
  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments", { headers: authHeaders() });
      if (res.status === 401) return handleAuthFailure();
      if (!res.ok) throw new Error("Failed to load appointments");
      setAppointments(await res.json());
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };

  const markApptRead = async (id) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ status: "read" }),
      });
      if (res.status === 401) return handleAuthFailure();
      if (res.ok)
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: "read" } : a)),
        );
    } catch (error) {
      console.error("Failed to update appointment:", error);
    }
  };

  const deleteAppt = async (id) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.status === 401) return handleAuthFailure();
      if (res.ok) {
        setAppointments((prev) => prev.filter((a) => a.id !== id));
        setActiveApptId((cur) => (cur === id ? null : cur));
      }
    } catch (error) {
      console.error("Failed to delete appointment:", error);
    }
  };

  // ── Quote requests (guided estimator) ────────────────────────────────────
  const fetchQuotes = async () => {
    try {
      const res = await fetch("/api/quotes", { headers: authHeaders() });
      if (res.status === 401) return handleAuthFailure();
      if (!res.ok) throw new Error("Failed to load quotes");
      setQuotes(await res.json());
    } catch (error) {
      console.error("Failed to fetch quotes:", error);
    }
  };

  const markQuoteRead = async (id) => {
    try {
      const res = await fetch(`/api/quotes/${id}`, {
        method: "PATCH",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ status: "read" }),
      });
      if (res.status === 401) return handleAuthFailure();
      if (res.ok)
        setQuotes((prev) =>
          prev.map((q) => (q.id === id ? { ...q, status: "read" } : q)),
        );
    } catch (error) {
      console.error("Failed to update quote:", error);
    }
  };

  const deleteQuote = async (id) => {
    try {
      const res = await fetch(`/api/quotes/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.status === 401) return handleAuthFailure();
      if (res.ok) {
        setQuotes((prev) => prev.filter((q) => q.id !== id));
        setActiveQuoteId((cur) => (cur === id ? null : cur));
      }
    } catch (error) {
      console.error("Failed to delete quote:", error);
    }
  };

  const saveProjectToServer = async (project) => {
    if (!project) return;
    try {
      setSaving(true);
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(project),
      });
      if (res.status === 401) {
        handleAuthFailure();
        throw new Error("Session expired — please sign in again.");
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setSaving(false);
      return data;
    } catch (error) {
      setSaving(false);
      console.error("Failed to save project:", error);
      throw error;
    }
  };

  const createProjectOnServer = async (project) => {
    try {
      setSaving(true);
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(project),
      });
      if (res.status === 401) {
        handleAuthFailure();
        throw new Error("Session expired — please sign in again.");
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Create failed");
      setSaving(false);
      return data;
    } catch (error) {
      setSaving(false);
      console.error("Failed to create project:", error);
      throw error;
    }
  };

  const deleteProjectOnServer = async (projectId) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.status === 401) {
        handleAuthFailure();
        throw new Error("Session expired — please sign in again.");
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      return data;
    } catch (error) {
      console.error("Failed to delete project:", error);
      throw error;
    }
  };

  const resetProjectsOnServer = async () => {
    try {
      const res = await fetch("/api/projects/reset", {
        method: "POST",
        headers: authHeaders(),
      });
      if (res.status === 401) {
        handleAuthFailure();
        throw new Error("Session expired — please sign in again.");
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reset failed");
      return data.projects || [];
    } catch (error) {
      console.error("Failed to reset projects:", error);
      throw error;
    }
  };

  // Clear the stored token and drop back to the login screen.
  const handleAuthFailure = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    setAuthed(false);
  }, []);

  useEffect(() => {
    fetchProjects();
    // Confirm any stored token is still valid on the server.
    if (getToken()) {
      fetchOrders();
      fetchAppointments();
      fetchQuotes();
      fetch("/api/admin/session", { headers: authHeaders() })
        .then((r) => r.json())
        .then((d) => {
          if (!d.valid) handleAuthFailure();
        })
        .catch(() => {});
    }
  }, [handleAuthFailure]);

  const project = projects.find((p) => p.id === activeId) || null;
  const newOrdersCount = orders.filter((o) => o.status === "new").length;
  const newApptCount = appointments.filter((a) => a.status === "new").length;
  const newQuoteCount = quotes.filter((q) => q.status === "new").length;

  const updateProject = useCallback(
    (changes) => {
      setProjects((prev) =>
        prev.map((p) => (p.id === activeId ? { ...p, ...changes } : p)),
      );
    },
    [activeId],
  );

  const handleSave = async () => {
    if (!project) return;
    try {
      await saveProjectToServer(project);
      setSaveStatus({ success: true, message: "Changes saved successfully." });
      setTimeout(() => setSaveStatus(null), 3000);
      await fetchProjects();
    } catch (error) {
      console.error("Save failed:", error);
      setSaveStatus({
        success: false,
        message: "Save failed. Please try again.",
      });
      setTimeout(() => setSaveStatus(null), 6000);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginErr("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginErr(data.error || "Invalid username or password.");
        return;
      }
      sessionStorage.setItem(TOKEN_KEY, data.token);
      setAuthed(true);
      setPassword("");
      fetchOrders();
      fetchAppointments();
      fetchQuotes();
    } catch {
      setLoginErr("Could not reach the server. Is it running?");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    setAuthed(false);
    setUsername("");
    setPassword("");
  };

  const handleReset = async () => {
    if (
      window.confirm(
        "Reset all projects to default data? This cannot be undone.",
      )
    ) {
      try {
        const fresh = await resetProjectsOnServer();
        setProjects(fresh);
        setActiveId(fresh[0]?.id || null);
      } catch (error) {
        console.error("Reset failed:", error);
      }
    }
  };

  const handleDeleteProject = async () => {
    if (!project) return;
    if (
      window.confirm(`Delete project ${project.id}? This cannot be undone.`)
    ) {
      try {
        await deleteProjectOnServer(project.id);
        await fetchProjects();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const handleAddProject = async () => {
    const newProject = {
      nameEn: "New Project",
      nameAr: "مشروع جديد",
      typeEn: TYPE_OPTIONS[0],
      typeAr: "سكني",
      phase: 0,
      progress: 0,
      managerEn: "Manager Name",
      managerAr: "اسم المدير",
      managerPhone: "+962-7xxxxxxx",
      clientPhone: "",
      clientNameEn: "Client Name",
      clientNameAr: "اسم العميل",
      clientEmail: "",
      clientPin: "",
      startDate: "",
      deliveryDate: "",
      coverImg: "/images/living-rooms/LIVING1.jpg",
      items: [],
      updates: [],
      docs: [],
    };
    try {
      const created = await createProjectOnServer(newProject);
      await fetchProjects();
      setActiveId(created.id);
    } catch (error) {
      console.error("Create failed:", error);
    }
  };

  // Create a new project pre-filled from a customer inquiry, then jump to it.
  const createProjectFromOrder = async (order) => {
    if (!order) return;
    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const noteParts = [];
    if (order.productTitle) noteParts.push(`Interested in: ${order.productTitle}`);
    if (order.finish) noteParts.push(`Finish requested: ${order.finish}`);
    if (order.message) noteParts.push(`Message: ${order.message}`);
    const newProject = {
      nameEn: order.productTitle
        ? `${order.productTitle} — ${order.name}`
        : `Inquiry — ${order.name}`,
      nameAr: "مشروع جديد",
      typeEn: TYPE_OPTIONS[0],
      typeAr: "سكني",
      phase: 0,
      progress: 0,
      managerEn: "Manager Name",
      managerAr: "اسم المدير",
      managerPhone: "+962-7xxxxxxx",
      clientPhone: order.phone || "",
      clientNameEn: order.name || "Client Name",
      clientNameAr: "اسم العميل",
      clientEmail: order.email || "",
      clientPin: "",
      startDate: "",
      deliveryDate: "",
      coverImg: order.productImage || "/images/living-rooms/LIVING1.jpg",
      items: [],
      updates: noteParts.length
        ? [{ date: today, phase: 0, textEn: noteParts.join(" · "), textAr: "" }]
        : [],
      docs: [],
    };
    try {
      const created = await createProjectOnServer(newProject);
      await fetchProjects();
      setActiveId(created.id);
      setView("projects");
    } catch (error) {
      console.error("Create project from order failed:", error);
    }
  };

  // Create a new project pre-filled from a showroom-visit booking, then jump to it.
  const createProjectFromAppointment = async (appt) => {
    if (!appt) return;
    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const noteParts = [];
    if (appt.dateLabel || appt.date)
      noteParts.push(
        `Showroom visit: ${appt.dateLabel || appt.date}${appt.time ? " at " + appt.time : ""}`,
      );
    if (appt.type) noteParts.push(`Visit type: ${appt.type}`);
    if (appt.company) noteParts.push(`Company: ${appt.company}`);
    if (appt.notes) noteParts.push(`Notes: ${appt.notes}`);
    const newProject = {
      nameEn: `Showroom Visit — ${appt.name}`,
      nameAr: "زيارة معرض",
      typeEn: TYPE_OPTIONS[0],
      typeAr: "سكني",
      phase: 0,
      progress: 0,
      managerEn: "Manager Name",
      managerAr: "اسم المدير",
      managerPhone: "+962-7xxxxxxx",
      clientPhone: appt.phone || "",
      clientNameEn: appt.name || "Client Name",
      clientNameAr: "اسم العميل",
      clientEmail: appt.email || "",
      clientPin: "",
      startDate: "",
      deliveryDate: "",
      coverImg: "/images/living-rooms/LIVING1.jpg",
      items: [],
      updates: noteParts.length
        ? [{ date: today, phase: 0, textEn: noteParts.join(" · "), textAr: "" }]
        : [],
      docs: [],
    };
    try {
      const created = await createProjectOnServer(newProject);
      await fetchProjects();
      setActiveId(created.id);
      setView("projects");
    } catch (error) {
      console.error("Create project from appointment failed:", error);
    }
  };

  // Create a new project pre-filled from a quote request, then jump to it.
  const createProjectFromQuote = async (q) => {
    if (!q) return;
    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const roomsStr = Array.isArray(q.rooms) ? q.rooms.join(", ") : q.rooms;
    const noteParts = [];
    if (q.projectType) noteParts.push(`Project type: ${q.projectType}`);
    if (roomsStr) noteParts.push(`Spaces: ${roomsStr}`);
    if (q.tier) noteParts.push(`Material quality: ${q.tier}`);
    if (q.notes) noteParts.push(`Notes: ${q.notes}`);
    const newProject = {
      nameEn: `Quote — ${q.name}`,
      nameAr: "طلب عرض سعر",
      typeEn: TYPE_OPTIONS[0],
      typeAr: "سكني",
      phase: 0,
      progress: 0,
      managerEn: "Manager Name",
      managerAr: "اسم المدير",
      managerPhone: "+962-7xxxxxxx",
      clientPhone: q.phone || "",
      clientNameEn: q.name || "Client Name",
      clientNameAr: "اسم العميل",
      clientEmail: q.email || "",
      clientPin: "",
      startDate: "",
      deliveryDate: "",
      coverImg: "/images/living-rooms/LIVING1.jpg",
      items: [],
      updates: noteParts.length
        ? [{ date: today, phase: 0, textEn: noteParts.join(" · "), textAr: "" }]
        : [],
      docs: [],
    };
    try {
      const created = await createProjectOnServer(newProject);
      await fetchProjects();
      setActiveId(created.id);
      setView("projects");
    } catch (error) {
      console.error("Create project from quote failed:", error);
    }
  };

  const addDoc = () => {
    if (!newDoc.nameEn || !newDoc.size || !project) return;
    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const docEntry = {
      ...newDoc,
      date: newDoc.date || today,
      fileName: newDocFile ? newDocFile.name : newDoc.fileName || newDoc.nameEn,
      fileType: newDocFile
        ? newDocFile.type
        : newDoc.fileType || "application/octet-stream",
      fileData: newDoc.fileData || null,
    };
    updateProject({ docs: [docEntry, ...project.docs] });
    setNewDoc({ nameEn: "", nameAr: "", size: "", date: "" });
    setNewDocFile(null);
    setShowDocForm(false);
  };

  const addUpdate = () => {
    if (!newUpd.textEn || !project) return;
    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    updateProject({
      updates: [{ ...newUpd, date: newUpd.date || today }, ...project.updates],
    });
    setNewUpd({ date: "", phase: project?.phase || 0, textEn: "", textAr: "" });
    setShowUpdForm(false);
  };

  const addItem = () => {
    if (!newItem.nameEn || !project) return;
    updateProject({ items: [...project.items, { ...newItem }] });
    setNewItem({ nameEn: "", nameAr: "", qty: 1 });
    setShowItemForm(false);
  };

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  if (!authed)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0D0B09" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm px-8"
        >
          <div className="text-center mb-10">
            <span className="font-accent text-2xl font-700 text-white tracking-[0.15em]">
              EMDAD
            </span>
            <div className="gold-divider mt-2" />
            <p className="font-body text-sm text-white/40 mt-4">
              Admin Portal — Staff Access Only
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label>Username</Label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                className="w-full px-4 py-3 font-body text-sm text-white bg-transparent outline-none placeholder:text-white/20"
                style={{
                  border: "1px solid rgba(184,144,60,0.2)",
                  borderColor: username ? "rgba(184,144,60,0.5)" : undefined,
                }}
              />
            </div>
            <div>
              <Label>Password</Label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 font-body text-sm text-white bg-transparent outline-none placeholder:text-white/20"
                style={{
                  border: "1px solid rgba(184,144,60,0.2)",
                  borderColor: password ? "rgba(184,144,60,0.5)" : undefined,
                }}
              />
            </div>
            {loginErr && (
              <p className="font-body text-xs text-red-400">{loginErr}</p>
            )}
            <button
              type="submit"
              className="w-full btn-gold justify-center py-4 mt-2"
            >
              Sign In to Admin
            </button>
          </form>
          <div className="text-center mt-6">
            <Link
              to="/"
              className="font-body text-xs text-white/20 hover:text-white/50 transition-colors"
            >
              ← Back to Website
            </Link>
          </div>
        </motion.div>
      </div>
    );

  // ── ADMIN DASHBOARD ────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col" style={{ background: "#F5F4F1" }}>
      {/* Top bar */}
      <div
        className="flex-shrink-0 h-14 flex items-center justify-between px-6 z-10"
        style={{
          background: "#0D0B09",
          borderBottom: "1px solid rgba(184,144,60,0.15)",
        }}
      >
        <div className="flex items-center gap-4">
          <span className="font-accent text-lg font-700 text-white tracking-[0.1em]">
            EMDAD
          </span>
          <span className="font-body text-[10px] tracking-[0.2em] uppercase text-yellow-500/50">
            Admin Portal
          </span>
          <div className="flex items-center gap-4 ml-4 pl-4" style={{ borderLeft: "1px solid rgba(255,255,255,0.1)" }}>
            <button
              onClick={() => setView("projects")}
              className="font-body text-[11px] tracking-[0.15em] uppercase transition-colors"
              style={{ color: view === "projects" ? "#D4AC5A" : "rgba(255,255,255,0.4)" }}
            >
              Projects
            </button>
            <button
              onClick={() => { setView("orders"); fetchOrders(); }}
              className="font-body text-[11px] tracking-[0.15em] uppercase transition-colors flex items-center gap-1.5"
              style={{ color: view === "orders" ? "#D4AC5A" : "rgba(255,255,255,0.4)" }}
            >
              New Orders
              {newOrdersCount > 0 && (
                <span
                  className="inline-flex items-center justify-center text-[9px] font-700 rounded-full"
                  style={{ background: "#E03E3E", color: "white", minWidth: "16px", height: "16px", padding: "0 4px" }}
                >
                  {newOrdersCount}
                </span>
              )}
            </button>
            <button
              onClick={() => { setView("appointments"); fetchAppointments(); }}
              className="font-body text-[11px] tracking-[0.15em] uppercase transition-colors flex items-center gap-1.5"
              style={{ color: view === "appointments" ? "#D4AC5A" : "rgba(255,255,255,0.4)" }}
            >
              Appointments
              {newApptCount > 0 && (
                <span
                  className="inline-flex items-center justify-center text-[9px] font-700 rounded-full"
                  style={{ background: "#E03E3E", color: "white", minWidth: "16px", height: "16px", padding: "0 4px" }}
                >
                  {newApptCount}
                </span>
              )}
            </button>
            <button
              onClick={() => { setView("quotes"); fetchQuotes(); }}
              className="font-body text-[11px] tracking-[0.15em] uppercase transition-colors flex items-center gap-1.5"
              style={{ color: view === "quotes" ? "#D4AC5A" : "rgba(255,255,255,0.4)" }}
            >
              Quotes
              {newQuoteCount > 0 && (
                <span
                  className="inline-flex items-center justify-center text-[9px] font-700 rounded-full"
                  style={{ background: "#E03E3E", color: "white", minWidth: "16px", height: "16px", padding: "0 4px" }}
                >
                  {newQuoteCount}
                </span>
              )}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {view === "projects" && (
            <>
          <button
            onClick={handleAddProject}
            className="flex items-center gap-2 px-4 py-2 font-body text-xs tracking-wide uppercase transition-all hover:-translate-y-0.5"
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            Add Project
          </button>
          <button
            onClick={handleDeleteProject}
            className="flex items-center gap-2 px-4 py-2 font-body text-xs tracking-wide uppercase transition-all hover:-translate-y-0.5"
            style={{
              background: "transparent",
              color: "#E03E3E",
              border: "1px solid rgba(224,62,62,0.25)",
            }}
          >
            Delete Project
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 font-body text-xs tracking-wide uppercase transition-all hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg,#B8903C,#D4AC5A)",
              color: "white",
            }}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            Save Changes
          </button>
            </>
          )}
          <a
            href="/portal"
            target="_blank"
            className="font-body text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            Client View ↗
          </a>
          <button
            onClick={handleLogout}
            className="font-body text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main layout */}
      {view === "orders" ? (
        <AdminOrders
          orders={orders}
          activeOrderId={activeOrderId}
          setActiveOrderId={setActiveOrderId}
          onMarkRead={markOrderRead}
          onDelete={deleteOrder}
          onCreateProject={createProjectFromOrder}
        />
      ) : view === "appointments" ? (
        <AdminAppointments
          appointments={appointments}
          activeId={activeApptId}
          setActiveId={setActiveApptId}
          onMarkRead={markApptRead}
          onDelete={deleteAppt}
          onCreateProject={createProjectFromAppointment}
        />
      ) : view === "quotes" ? (
        <AdminQuotes
          quotes={quotes}
          activeId={activeQuoteId}
          setActiveId={setActiveQuoteId}
          onMarkRead={markQuoteRead}
          onDelete={deleteQuote}
          onCreateProject={createProjectFromQuote}
        />
      ) : (
      <div className="flex-1 flex overflow-hidden">
        {/* ── Sidebar: project list ─────────────────────────────────────── */}
        <div
          className="w-72 flex-shrink-0 flex flex-col overflow-hidden"
          style={{
            background: "#1C1917",
            borderRight: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            className="p-4 border-b"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}
          >
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-yellow-500/60">
              All Projects ({projects.length})
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {projects.map((proj) => {
              const isActive = proj.id === activeId;
              return (
                <button
                  key={proj.id}
                  onClick={() => setActiveId(proj.id)}
                  className="w-full text-left p-4 transition-all duration-200"
                  style={{
                    background: isActive
                      ? "rgba(184,144,60,0.1)"
                      : "transparent",
                    borderLeft: isActive
                      ? "2px solid #B8903C"
                      : "2px solid transparent",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="font-body text-[10px] tracking-wide"
                      style={{ color: "rgba(184,144,60,0.6)" }}
                    >
                      {proj.id}
                    </span>
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        background:
                          proj.phase === 5
                            ? "#3B6D11"
                            : PHASE_COLORS[proj.phase],
                      }}
                    />
                  </div>
                  <p
                    className="font-body text-xs text-white/70 leading-snug mb-2"
                    style={{
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {proj.nameEn}
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className="flex-1 h-1 rounded-full overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${proj.progress}%`,
                          background: PHASE_COLORS[proj.phase],
                        }}
                      />
                    </div>
                    <span
                      className="font-body text-[10px] flex-shrink-0"
                      style={{ color: PHASE_COLORS[proj.phase] }}
                    >
                      {proj.progress}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sidebar footer */}
          <div
            className="p-4 space-y-2"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <button
              onClick={handleReset}
              className="w-full py-2 font-body text-xs text-white/20 hover:text-red-400 transition-colors text-center"
            >
              ↺ Reset to Defaults
            </button>
          </div>
        </div>

        {/* ── Main editor ──────────────────────────────────────────────── */}
        {project ? (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-8">
              {/* Project header */}
              <div
                className="flex items-start justify-between mb-8 pb-6"
                style={{ borderBottom: "1px solid rgba(28,25,23,0.08)" }}
              >
                <div>
                  <p
                    className="font-body text-[10px] tracking-widest uppercase mb-1"
                    style={{ color: "#B8903C" }}
                  >
                    {project.id}
                  </p>
                  <h2 className="font-display text-2xl font-400 text-onyx">
                    {project.nameEn}
                  </h2>
                </div>
                <a
                  href="/portal"
                  target="_blank"
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2 font-body text-xs"
                  style={{
                    border: "1px solid rgba(184,144,60,0.2)",
                    color: "#8B6350",
                  }}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Client View
                </a>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left column */}
                <div>
                  {/* Basic info */}
                  <section className="mb-8">
                    <h3
                      className="font-body text-xs font-600 tracking-[0.2em] uppercase mb-4 pb-2"
                      style={{
                        borderBottom: "1px solid rgba(28,25,23,0.08)",
                        color: "rgba(28,25,23,0.5)",
                      }}
                    >
                      Project Information
                    </h3>
                    <Field label="Project Name (English)">
                      <Input
                        value={project.nameEn}
                        onChange={(v) => updateProject({ nameEn: v })}
                        placeholder="Project name..."
                      />
                    </Field>
                    <Field label="Project Name (Arabic)">
                      <Input
                        value={project.nameAr}
                        onChange={(v) => updateProject({ nameAr: v })}
                        placeholder="اسم المشروع..."
                      />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Project Type">
                        <select
                          value={project.typeEn}
                          onChange={(e) =>
                            updateProject({ typeEn: e.target.value })
                          }
                          className="w-full px-3 py-2.5 font-body text-sm bg-white outline-none appearance-none"
                          style={{ border: "1px solid rgba(28,25,23,0.15)" }}
                        >
                          {TYPE_OPTIONS.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Client Phone">
                        <Input
                          value={project.clientPhone || ""}
                          onChange={(v) => updateProject({ clientPhone: v })}
                          placeholder="0799-000-001"
                        />
                      </Field>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-4">
                      <Field label="Client Name (English)">
                        <Input
                          value={project.clientNameEn || ""}
                          onChange={(v) => updateProject({ clientNameEn: v })}
                          placeholder="Ibrahim Noaimi"
                        />
                      </Field>
                      <Field label="Client Name (Arabic)">
                        <Input
                          value={project.clientNameAr || ""}
                          onChange={(v) => updateProject({ clientNameAr: v })}
                          placeholder="إبراهيم نعيمي"
                        />
                      </Field>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-4">
                      <Field label="Client Email">
                        <Input
                          value={project.clientEmail || ""}
                          onChange={(v) => updateProject({ clientEmail: v })}
                          placeholder="client@example.com"
                          type="email"
                        />
                      </Field>
                      <Field label="Client Password">
                        <Input
                          value={project.clientPin || ""}
                          onChange={(v) => updateProject({ clientPin: v })}
                          placeholder="1234"
                          type="password"
                        />
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Manager Name">
                        <Input
                          value={project.managerEn}
                          onChange={(v) => updateProject({ managerEn: v })}
                          placeholder="Manager..."
                        />
                      </Field>
                      <Field label="Manager Phone">
                        <Input
                          value={project.managerPhone}
                          onChange={(v) => updateProject({ managerPhone: v })}
                          placeholder="+962..."
                        />
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Start Date">
                        <Input
                          value={project.startDate}
                          onChange={(v) => updateProject({ startDate: v })}
                          placeholder="01 Jan 2025"
                        />
                      </Field>
                      <Field label="Delivery Date">
                        <Input
                          value={project.deliveryDate}
                          onChange={(v) => updateProject({ deliveryDate: v })}
                          placeholder="01 Mar 2025"
                        />
                      </Field>
                    </div>
                  </section>

                  {/* Phase & Progress */}
                  <section className="mb-8">
                    <h3
                      className="font-body text-xs font-600 tracking-[0.2em] uppercase mb-4 pb-2"
                      style={{
                        borderBottom: "1px solid rgba(28,25,23,0.08)",
                        color: "rgba(28,25,23,0.5)",
                      }}
                    >
                      Phase & Progress
                    </h3>
                    <Field label="Current Phase — click to update">
                      <PhaseSelector
                        value={project.phase}
                        onChange={(v) => updateProject({ phase: v })}
                      />
                    </Field>
                    <Field label={`Progress — ${project.progress}%`}>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={1}
                          value={project.progress}
                          onChange={(e) =>
                            updateProject({
                              progress: parseInt(e.target.value),
                            })
                          }
                          className="flex-1"
                          style={{ accentColor: "#B8903C" }}
                        />
                        <span
                          className="font-body text-sm font-600 w-10 text-right"
                          style={{ color: PHASE_COLORS[project.phase] }}
                        >
                          {project.progress}%
                        </span>
                      </div>
                      <div
                        className="mt-2 h-2 rounded-full overflow-hidden"
                        style={{ background: "rgba(28,25,23,0.06)" }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${project.progress}%`,
                            background: PHASE_COLORS[project.phase],
                          }}
                        />
                      </div>
                    </Field>
                  </section>

                  {/* Items ordered */}
                  <section>
                    <div
                      className="flex items-center justify-between mb-4 pb-2"
                      style={{ borderBottom: "1px solid rgba(28,25,23,0.08)" }}
                    >
                      <h3
                        className="font-body text-xs font-600 tracking-[0.2em] uppercase"
                        style={{ color: "rgba(28,25,23,0.5)" }}
                      >
                        Ordered Items
                      </h3>
                      <button
                        onClick={() => setShowItemForm(!showItemForm)}
                        className="font-body text-xs tracking-wide px-3 py-1 transition-colors"
                        style={{
                          border: "1px solid rgba(184,144,60,0.3)",
                          color: "#B8903C",
                          background: showItemForm
                            ? "rgba(184,144,60,0.08)"
                            : "transparent",
                        }}
                      >
                        + Add Item
                      </button>
                    </div>
                    <AnimatePresence>
                      {showItemForm && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden mb-3"
                        >
                          <div
                            className="p-4 space-y-3"
                            style={{
                              background: "rgba(184,144,60,0.04)",
                              border: "1px solid rgba(184,144,60,0.15)",
                            }}
                          >
                            <div className="grid grid-cols-3 gap-3">
                              <div className="col-span-2">
                                <Input
                                  value={newItem.nameEn}
                                  onChange={(v) =>
                                    setNewItem((p) => ({ ...p, nameEn: v }))
                                  }
                                  placeholder="Item name (English)"
                                />
                              </div>
                              <Input
                                value={String(newItem.qty)}
                                onChange={(v) =>
                                  setNewItem((p) => ({
                                    ...p,
                                    qty: parseInt(v) || 1,
                                  }))
                                }
                                placeholder="Qty"
                                type="number"
                              />
                            </div>
                            <Input
                              value={newItem.nameAr}
                              onChange={(v) =>
                                setNewItem((p) => ({ ...p, nameAr: v }))
                              }
                              placeholder="اسم القطعة (عربي)"
                            />
                            <button
                              onClick={addItem}
                              className="btn-gold text-xs py-2 px-4"
                            >
                              Add Item →
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="space-y-2">
                      {project.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 group"
                          style={{
                            background: "white",
                            border: "1px solid rgba(28,25,23,0.06)",
                          }}
                        >
                          <div>
                            <p className="font-body text-sm text-onyx">
                              {item.nameEn}
                            </p>
                            <p className="font-body text-[10px] text-charcoal/35">
                              {item.nameAr} · Qty: {item.qty}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              updateProject({
                                items: project.items.filter((_, j) => j !== i),
                              })
                            }
                            className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center"
                            style={{ border: "1px solid rgba(220,38,38,0.2)" }}
                          >
                            <svg
                              className="w-3 h-3 text-red-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Right column */}
                <div>
                  {/* Updates */}
                  <section className="mb-8">
                    <div
                      className="flex items-center justify-between mb-4 pb-2"
                      style={{ borderBottom: "1px solid rgba(28,25,23,0.08)" }}
                    >
                      <h3
                        className="font-body text-xs font-600 tracking-[0.2em] uppercase"
                        style={{ color: "rgba(28,25,23,0.5)" }}
                      >
                        Project Updates
                      </h3>
                      <button
                        onClick={() => setShowUpdForm(!showUpdForm)}
                        className="font-body text-xs tracking-wide px-3 py-1 transition-colors"
                        style={{
                          border: "1px solid rgba(184,144,60,0.3)",
                          color: "#B8903C",
                          background: showUpdForm
                            ? "rgba(184,144,60,0.08)"
                            : "transparent",
                        }}
                      >
                        + Add Update
                      </button>
                    </div>

                    <AnimatePresence>
                      {showUpdForm && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden mb-4"
                        >
                          <div
                            className="p-4 space-y-3"
                            style={{
                              background: "rgba(184,144,60,0.04)",
                              border: "1px solid rgba(184,144,60,0.15)",
                            }}
                          >
                            <Label>Update date (e.g. 28 Oct 2025)</Label>
                            <Input
                              value={newUpd.date}
                              onChange={(v) =>
                                setNewUpd((p) => ({ ...p, date: v }))
                              }
                              placeholder="Leave blank for today"
                            />
                            <Label>Phase at time of update</Label>
                            <select
                              value={newUpd.phase}
                              onChange={(e) =>
                                setNewUpd((p) => ({
                                  ...p,
                                  phase: parseInt(e.target.value),
                                }))
                              }
                              className="w-full px-3 py-2.5 font-body text-sm bg-white outline-none"
                              style={{
                                border: "1px solid rgba(28,25,23,0.15)",
                              }}
                            >
                              {PHASES_EN.map((ph, i) => (
                                <option key={i} value={i}>
                                  {ph}
                                </option>
                              ))}
                            </select>
                            <Label>Update text (English) *</Label>
                            <textarea
                              value={newUpd.textEn}
                              onChange={(e) =>
                                setNewUpd((p) => ({
                                  ...p,
                                  textEn: e.target.value,
                                }))
                              }
                              placeholder="Describe what happened..."
                              className="w-full px-3 py-2.5 font-body text-sm resize-none outline-none"
                              style={{
                                border: "1px solid rgba(28,25,23,0.15)",
                                background: "white",
                              }}
                              rows={3}
                            />
                            <Label>Update text (Arabic)</Label>
                            <textarea
                              value={newUpd.textAr}
                              onChange={(e) =>
                                setNewUpd((p) => ({
                                  ...p,
                                  textAr: e.target.value,
                                }))
                              }
                              placeholder="اكتب التحديث بالعربية..."
                              className="w-full px-3 py-2.5 font-body text-sm resize-none outline-none"
                              dir="rtl"
                              style={{
                                border: "1px solid rgba(28,25,23,0.15)",
                                background: "white",
                              }}
                              rows={2}
                            />
                            <button
                              onClick={addUpdate}
                              className="btn-gold text-xs py-2 px-4"
                            >
                              Post Update ↑
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div
                      className="divide-y"
                      style={{ borderTop: "1px solid rgba(28,25,23,0.06)" }}
                    >
                      {project.updates.map((upd, i) => (
                        <UpdateRow
                          key={i}
                          upd={upd}
                          onDelete={() =>
                            updateProject({
                              updates: project.updates.filter(
                                (_, j) => j !== i,
                              ),
                            })
                          }
                        />
                      ))}
                    </div>
                  </section>

                  {/* Documents */}
                  <section>
                    <div
                      className="flex items-center justify-between mb-4 pb-2"
                      style={{ borderBottom: "1px solid rgba(28,25,23,0.08)" }}
                    >
                      <h3
                        className="font-body text-xs font-600 tracking-[0.2em] uppercase"
                        style={{ color: "rgba(28,25,23,0.5)" }}
                      >
                        Client Documents
                      </h3>
                      <button
                        onClick={() => setShowDocForm(!showDocForm)}
                        className="font-body text-xs tracking-wide px-3 py-1 transition-colors"
                        style={{
                          border: "1px solid rgba(184,144,60,0.3)",
                          color: "#B8903C",
                          background: showDocForm
                            ? "rgba(184,144,60,0.08)"
                            : "transparent",
                        }}
                      >
                        + Upload Document
                      </button>
                    </div>

                    <AnimatePresence>
                      {showDocForm && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden mb-3"
                        >
                          <div
                            className="p-4 space-y-3"
                            style={{
                              background: "rgba(184,144,60,0.04)",
                              border: "1px solid rgba(184,144,60,0.15)",
                            }}
                          >
                            <Input
                              value={newDoc.nameEn}
                              onChange={(v) =>
                                setNewDoc((p) => ({ ...p, nameEn: v }))
                              }
                              placeholder="Document name (e.g. Final Invoice #INV-2025-014)"
                            />
                            <Input
                              value={newDoc.nameAr}
                              onChange={(v) =>
                                setNewDoc((p) => ({ ...p, nameAr: v }))
                              }
                              placeholder="اسم المستند بالعربية"
                            />
                            <div className="grid grid-cols-1 gap-3">
                              <label className="font-body text-[10px] tracking-[0.25em] uppercase text-charcoal/50">
                                Upload File
                              </label>
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                  const file = e.target.files?.[0] || null;
                                  if (file) {
                                    setNewDocFile(file);
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                      const result = reader.result || "";
                                      const fileData =
                                        typeof result === "string"
                                          ? result.split(",")[1]
                                          : null;
                                      setNewDoc((p) => ({
                                        ...p,
                                        nameEn: p.nameEn || file.name,
                                        size: formatFileSize(file.size),
                                        fileName: file.name,
                                        fileType: file.type,
                                        fileData,
                                      }));
                                    };
                                    reader.readAsDataURL(file);
                                  } else {
                                    setNewDocFile(null);
                                    setNewDoc((p) => ({
                                      ...p,
                                      fileData: null,
                                      fileName: "",
                                      fileType: "",
                                    }));
                                  }
                                }}
                                className="w-full text-sm text-charcoal outline-none"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                value={newDoc.size}
                                onChange={(v) =>
                                  setNewDoc((p) => ({ ...p, size: v }))
                                }
                                placeholder="File size (e.g. 1.2 MB)"
                              />
                              <Input
                                value={newDoc.date}
                                onChange={(v) =>
                                  setNewDoc((p) => ({ ...p, date: v }))
                                }
                                placeholder="Date (leave blank = today)"
                              />
                            </div>
                            <p className="font-body text-[10px] text-charcoal/40 italic">
                              The client will see this document in their portal
                              and can request it via WhatsApp.
                            </p>
                            <button
                              onClick={addDoc}
                              className="btn-gold text-xs py-2 px-4"
                            >
                              Add Document →
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="space-y-2">
                      {project.docs.map((doc, i) => (
                        <DocRow
                          key={i}
                          doc={doc}
                          onDelete={() =>
                            updateProject({
                              docs: project.docs.filter((_, j) => j !== i),
                            })
                          }
                        />
                      ))}
                    </div>
                  </section>
                </div>
              </div>

              {/* Save bar */}
              <div
                className="mt-10 pt-6 flex items-center justify-between"
                style={{ borderTop: "1px solid rgba(28,25,23,0.08)" }}
              >
                <p className="font-body text-xs text-charcoal/35">
                  Click Save All Changes to persist updates to the database.
                </p>
                <button
                  onClick={handleSave}
                  className="btn-gold"
                  disabled={saving}
                  style={{
                    opacity: saving ? 0.7 : 1,
                    cursor: saving ? "not-allowed" : "pointer",
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  {saving ? "Saving..." : "Save All Changes"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <p className="font-body text-sm text-charcoal/40">
              Select a project from the sidebar
            </p>
          </div>
        )}
      </div>
      )}

      <SaveStatusToast status={saveStatus} />
    </div>
  );
}
