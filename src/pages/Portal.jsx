import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "../context/LanguageContext";
import { PHASE_COLORS, PHASE_BG, PHASE_ICONS } from "../data/projects";

// ── Mock data ─────────────────────────────────────────────────────────────────
const DEMO_CLIENT = {
  nameEn: "Ibrahim Noaimi",
  nameAr: "إبراهيم نعيمي",
  phone: "0799-000-001",
  pin: "1234",
  email: "ibrahim@example.com",
  initials: "IN",
};

// ── Sub-components ─────────────────────────────────────────────────────────────
function PhaseTracker({ phase, phases, phaseShort, isAr }) {
  return (
    <div className="py-8 px-6" style={{ background: "#0D0B09" }}>
      <div className="flex items-start justify-between relative">
        {/* connecting line */}
        <div
          className="absolute top-4 h-px w-full"
          style={{ background: "rgba(255,255,255,0.08)", zIndex: 0 }}
        />
        <div
          className="absolute top-4 h-px"
          style={{
            width: `${(phase / (phases.length - 1)) * 100}%`,
            background: "linear-gradient(90deg,#B8903C,#D4AC5A)",
            zIndex: 1,
            transition: "width 1.2s ease",
          }}
        />

        {phases.map((p, i) => {
          const done = i < phase;
          const active = i === phase;
          return (
            <div
              key={p}
              className="flex flex-col items-center"
              style={{ flex: 1, zIndex: 2 }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mb-3 flex-shrink-0 transition-all duration-500"
                style={{
                  background: done
                    ? "#B8903C"
                    : active
                      ? "rgba(184,144,60,0.2)"
                      : "rgba(255,255,255,0.05)",
                  border: `2px solid ${done ? "#B8903C" : active ? "#D4AC5A" : "rgba(255,255,255,0.1)"}`,
                }}
              >
                {done ? (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span
                    className="font-body text-[10px] font-600"
                    style={{
                      color: active ? "#D4AC5A" : "rgba(255,255,255,0.25)",
                    }}
                  >
                    {i + 1}
                  </span>
                )}
              </div>
              <p
                className="font-body text-[9px] tracking-wide text-center leading-tight hidden sm:block"
                style={{
                  color: done
                    ? "#D4AC5A"
                    : active
                      ? "white"
                      : "rgba(255,255,255,0.25)",
                }}
              >
                {phaseShort[i]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DocCard({ doc, isAr, downloadLabel, downloadNote }) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    if (doc.fileData) {
      try {
        const binary = atob(doc.fileData);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], {
          type: doc.fileType || "application/octet-stream",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = doc.fileName || (isAr ? doc.nameAr : doc.nameEn);
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        return;
      } catch (error) {
        console.error("Download failed:", error);
      }
    }

    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
    }, 1800);
    setTimeout(() => setDownloaded(false), 5000);
  };

  return (
    <div
      className="flex items-center gap-4 p-4 group hover:bg-yellow-50 transition-colors duration-300"
      style={{ border: "1px solid rgba(184,144,60,0.1)", background: "white" }}
    >
      <div
        className="w-10 h-10 flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(184,144,60,0.08)" }}
      >
        <svg
          className="w-5 h-5"
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
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm font-500 text-onyx truncate">
          {isAr ? doc.nameAr : doc.nameEn}
        </p>
        <p className="font-body text-xs text-charcoal/40">
          {doc.size} · {doc.date}
        </p>
      </div>
      <button
        onClick={handleDownload}
        className="flex-shrink-0 flex items-center gap-2 px-4 py-2 font-body text-xs tracking-wide uppercase transition-all duration-300"
        style={{
          background: downloaded
            ? "rgba(59,109,17,0.1)"
            : "rgba(184,144,60,0.08)",
          color: downloaded ? "#3B6D11" : "#B8903C",
          border: `1px solid ${downloaded ? "rgba(59,109,17,0.2)" : "rgba(184,144,60,0.2)"}`,
        }}
      >
        {downloading ? (
          <>
            <span className="w-3 h-3 rounded-full border-t border-yellow-600 animate-spin" />
            {isAr ? "..." : "..."}
          </>
        ) : downloaded ? (
          <>
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {isAr ? "تم" : "Done"}
          </>
        ) : (
          downloadLabel
        )}
      </button>
    </div>
  );
}

// ── Main Portal Component ──────────────────────────────────────────────────────
export default function Portal() {
  const { t, isAr } = useLang();
  const tp = t.portal;

  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [view, setView] = useState(() =>
    sessionStorage.getItem("emdad-portal-auth") === "1" ? "dashboard" : "login",
  );
  const [selectedRole, setSelectedRole] = useState(
    () => sessionStorage.getItem("emdad-portal-role") || null,
  );
  const [activeProject, setActiveProject] = useState(null);
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [clientLogin, setClientLogin] = useState(
    () => sessionStorage.getItem("emdad-portal-login") || "",
  );
  const [loginError, setLoginError] = useState("");
  const [downloading, setDownloading] = useState(null);
  const [loadingProjects, setLoadingProjects] = useState(false);

  const normalizePhone = (value) => value.replace(/[^0-9]/g, "");
  const normalizeEmail = (value) => value.trim().toLowerCase();

  const clientMatches = (project, login) => {
    const normalizedEmail = normalizeEmail(project.clientEmail || "");
    const normalizedPhone = normalizePhone(project.clientPhone || "");
    const inputEmail = normalizeEmail(login);
    const inputPhone = normalizePhone(login);

    if (inputEmail.includes("@") && normalizedEmail) {
      return normalizedEmail === inputEmail;
    }

    return (
      (normalizedPhone && inputPhone && normalizedPhone === inputPhone) ||
      (normalizedPhone && inputPhone && normalizedPhone.endsWith(inputPhone))
    );
  };

  const findClientProject = (login, password) => {
    return projects.find((project) => {
      if (!clientMatches(project, login)) return false;
      const expectedPin = project.clientPin?.trim() || "1234";
      return password === expectedPin;
    });
  };

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to load projects");
      const data = await res.json();
      setProjects(data || []);
      if (
        !activeProject &&
        sessionStorage.getItem("emdad-portal-auth") === "1"
      ) {
        const savedLogin = sessionStorage.getItem("emdad-portal-login") || "";
        const found = data.find((proj) => clientMatches(proj, savedLogin));
        if (found) setActiveProject(found.id);
      }
    } catch (error) {
      console.error("Portal: could not load projects", error);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Ensure the current client project is selected after refresh
  useEffect(() => {
    if (view === "dashboard" && selectedRole === "client" && !activeProject) {
      const found = projects.find((proj) => clientMatches(proj, clientLogin));
      if (found) {
        setActiveProject(found.id);
      }
    }
  }, [view, selectedRole, clientLogin, projects, activeProject]);

  const handleLogin = (e) => {
    e.preventDefault();
    const loginValue = phone.trim();
    const matchProject = findClientProject(loginValue, pin);

    if (matchProject) {
      sessionStorage.setItem("emdad-portal-auth", "1");
      sessionStorage.setItem("emdad-portal-role", "client");
      sessionStorage.setItem("emdad-portal-login", loginValue);
      setClientLogin(loginValue);
      setSelectedRole("client");
      setView("dashboard");
      setActiveProject(matchProject.id);
      setLoginError("");
    } else {
      setLoginError(
        isAr
          ? "البريد الإلكتروني/الهاتف أو كلمة المرور غير صحيحة. تأكد من بيانات العميل."
          : "Email/phone or password is incorrect. Check the client's credentials.",
      );
    }
  };

  const handleDemo = () => {
    setPhone("0799-000-001");
    setPin("1234");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("emdad-portal-auth");
    sessionStorage.removeItem("emdad-portal-role");
    sessionStorage.removeItem("emdad-portal-login");
    setView("login");
    setSelectedRole(null);
    setClientLogin("");
    setActiveProject(null);
    setPhone("");
    setPin("");
  };

  const project = activeProject
    ? projects.find((p) => p.id === activeProject)
    : null;

  const currentClientProject = projects.find((proj) =>
    clientMatches(proj, clientLogin),
  );

  const currentClientName = currentClientProject
    ? isAr
      ? currentClientProject.clientNameAr || currentClientProject.clientNameEn
      : currentClientProject.clientNameEn || currentClientProject.clientNameAr
    : isAr
      ? DEMO_CLIENT.nameAr
      : DEMO_CLIENT.nameEn;

  const clientNameForInitials = currentClientName || (isAr ? "عميل" : "Client");
  const currentClientInitials = clientNameForInitials
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  // ── LOGIN VIEW ────────────────────────────────────────────────────────────
  if (view === "login") {
    if (!selectedRole)
      return (
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: "#0D0B09" }}
          dir={isAr ? "rtl" : "ltr"}
        >
          <div className="w-full max-w-5xl p-6">
            <div className="grid gap-6 lg:grid-cols-2 bg-[#111011] border border-white/10 rounded-[32px] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
              <div
                className="p-10 lg:p-14"
                style={{
                  borderRight: isAr
                    ? "none"
                    : "1px solid rgba(255,255,255,0.08)",
                  borderLeft: isAr
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "none",
                }}
              >
                <span className="font-accent text-sm tracking-[0.35em] uppercase text-yellow-400">
                  {isAr ? "اختر نوع البوابة" : "Select Portal Type"}
                </span>
                <h1 className="font-display text-3xl font-300 text-white mt-6 mb-4">
                  {isAr ? "بوابة العملاء أو المسؤول" : "Client or Admin Access"}
                </h1>
                <p className="font-body text-sm text-white/50 leading-relaxed">
                  {isAr
                    ? "اختر البوابة المناسبة لتسجيل الدخول. بوابة العملاء مخصصة لمتابعة المشاريع، بينما بوابة المسؤول مخصصة لإدارة البيانات."
                    : "Choose the portal that matches your role. Client access is for project tracking, while admin access is for managing project data."}
                </p>
              </div>
              <div className="p-10 lg:p-14 flex flex-col justify-center gap-5 bg-[#0b0a09]">
                <button
                  onClick={() => setSelectedRole("client")}
                  className="w-full py-4 text-base font-body font-semibold uppercase tracking-[0.25em] text-black bg-yellow-400 hover:bg-yellow-300 transition-colors duration-200 rounded-xl"
                >
                  {isAr ? "بوابة العميل" : "Client Portal"}
                </button>
                <button
                  onClick={() => navigate("/admin")}
                  className="w-full py-4 text-base font-body font-semibold uppercase tracking-[0.25em] text-white bg-transparent border border-white/15 hover:border-yellow-400 hover:text-yellow-300 transition-colors duration-200 rounded-xl"
                >
                  {isAr ? "بوابة المسؤول" : "Admin Portal"}
                </button>
                <div className="text-sm text-white/40 leading-relaxed pt-4 border-t border-white/10">
                  {isAr
                    ? "للدخول السريع كمستخدم تجريبي، اضغط بوابة العميل ثم استخدم بيانات العرض."
                    : "For quick demo access, choose Client Portal and use the demo credentials."}
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    return (
      <div
        className="min-h-screen flex"
        style={{ background: "#0D0B09" }}
        dir={isAr ? "rtl" : "ltr"}
      >
        {/* Left brand panel */}
        <div
          className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 p-12 relative overflow-hidden"
          style={{ borderRight: "1px solid rgba(184,144,60,0.15)" }}
        >
          <img
            src="/images/master-bedrooms/BED1.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.15)" }}
          />
          <div className="relative z-10">
            <Link to="/" className="flex flex-col">
              <span className="font-accent text-2xl font-700 text-white tracking-[0.15em]">
                EMDAD
              </span>
              <span className="font-body text-[10px] tracking-[0.2em] uppercase text-yellow-500/70 mt-0.5">
                {isAr ? "للأثاث الخشبي والذكي" : "Wooden & Smart Furniture"}
              </span>
            </Link>
          </div>
          <div className="relative z-10">
            <h2 className="font-display text-3xl font-300 text-white mb-4">
              {isAr ? "تابع مشروعك" : "Track Your Project"}
            </h2>
            <p className="font-body text-sm text-white/45 leading-loose mb-8">
              {isAr
                ? "اطّلع على تقدم مشروعك، استعرض المستندات، وتواصل مع مديرك المخصص — في أي وقت ومن أي مكان."
                : "Monitor project progress, review documents, and communicate with your dedicated manager — anytime, anywhere."}
            </p>
            <div className="space-y-3">
              {[
                {
                  icon: "📊",
                  en: "Real-time progress tracking",
                  ar: "متابعة التقدم في الوقت الفعلي",
                },
                {
                  icon: "📄",
                  en: "Download contracts & invoices",
                  ar: "تحميل العقود والفواتير",
                },
                {
                  icon: "💬",
                  en: "Direct manager communication",
                  ar: "التواصل المباشر مع المدير",
                },
              ].map((f) => (
                <div key={f.en} className="flex items-center gap-3">
                  <span className="text-base">{f.icon}</span>
                  <span className="font-body text-xs text-white/50">
                    {isAr ? f.ar : f.en}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right login form */}
        <div className="flex-1 flex items-center justify-center px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-sm"
          >
            {/* Mobile logo */}
            <div className="lg:hidden mb-10 text-center">
              <span className="font-accent text-2xl font-700 text-white tracking-[0.15em]">
                EMDAD
              </span>
              <div className="gold-divider mt-2" />
            </div>

            <div className="mb-6">
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="text-xs font-body uppercase tracking-[0.35em] text-white/50 hover:text-white transition-colors"
              >
                ← {isAr ? "اختيار بوابة" : "Choose Portal"}
              </button>
            </div>

            <h1 className="font-display text-3xl font-300 text-white mb-2">
              {tp.loginTitle}
            </h1>
            <p className="font-body text-sm text-white/40 mb-10">
              {tp.loginSub}
            </p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block font-body text-[10px] tracking-[0.25em] uppercase text-yellow-500/70 mb-2">
                  {isAr ? "البريد الإلكتروني أو الهاتف" : "Email or Phone"}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={
                    isAr
                      ? "email@example.com أو 0799-000-001"
                      : "email@example.com or 0799-000-001"
                  }
                  required
                  className="w-full px-4 py-3.5 font-body text-sm bg-transparent outline-none placeholder:text-white/20 transition-all"
                  style={{
                    border: "1px solid rgba(184,144,60,0.2)",
                    color: "white",
                    borderColor: phone ? "rgba(184,144,60,0.5)" : undefined,
                  }}
                />
              </div>
              <div>
                <label className="block font-body text-[10px] tracking-[0.25em] uppercase text-yellow-500/70 mb-2">
                  {tp.pinLbl}
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder={tp.pinPh}
                  required
                  className="w-full px-4 py-3.5 font-body text-sm bg-transparent outline-none placeholder:text-white/20 tracking-[0.5em] transition-all"
                  style={{
                    border: "1px solid rgba(184,144,60,0.2)",
                    color: "white",
                    borderColor: pin ? "rgba(184,144,60,0.5)" : undefined,
                  }}
                />
              </div>

              {loginError && (
                <p className="font-body text-xs text-red-400">{loginError}</p>
              )}

              <button
                type="submit"
                className="w-full btn-gold justify-center py-4"
              >
                {tp.loginBtn}
              </button>

              <div className="text-center">
                <div className="flex items-center gap-3 my-4">
                  <div
                    className="flex-1 h-px"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  />
                  <span className="font-body text-[10px] text-white/20 uppercase tracking-widest">
                    {isAr ? "أو" : "or"}
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleDemo}
                  className="w-full py-3 font-body text-sm text-yellow-400/70 hover:text-yellow-400 transition-colors border border-yellow-600/20 hover:border-yellow-600/40"
                >
                  {tp.demoBtn}
                </button>
                <p className="font-body text-[10px] text-white/20 mt-3">
                  {tp.demoNote}
                </p>
              </div>
            </form>

            <p className="font-body text-xs text-white/20 text-center mt-8">
              {tp.forgotPin}
            </p>
            <div className="text-center mt-6">
              <Link
                to="/"
                className="font-body text-xs text-white/20 hover:text-white/50 transition-colors"
              >
                ← {isAr ? "العودة للموقع" : "Back to Website"}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── DASHBOARD VIEW ────────────────────────────────────────────────────────
  if (view === "dashboard")
    return (
      <div
        className="min-h-screen"
        style={{ background: "#FAF7F2" }}
        dir={isAr ? "rtl" : "ltr"}
      >
        {/* Portal header */}
        <div
          className="sticky top-0 z-40"
          style={{
            background: "#0D0B09",
            borderBottom: "1px solid rgba(184,144,60,0.15)",
          }}
        >
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="font-accent text-lg font-700 text-white tracking-[0.1em]"
              >
                EMDAD
              </Link>
              <span className="font-body text-[10px] tracking-[0.2em] uppercase text-yellow-500/60 hidden sm:block">
                {tp.title}
              </span>
            </div>
            <div className="flex items-center gap-5">
              <div className="hidden sm:flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-body text-xs font-600 text-yellow-900"
                  style={{
                    background: "linear-gradient(135deg,#B8903C,#D4AC5A)",
                  }}
                >
                  {currentClientInitials}
                </div>
                <span className="font-body text-xs text-white/60">
                  {currentClientName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="font-body text-xs text-white/30 hover:text-white/60 transition-colors uppercase tracking-widest"
              >
                {tp.logout}
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-300 text-onyx">
              {tp.dashTitle}
            </h1>
            <p className="font-body text-sm text-charcoal/50 mt-2">
              {tp.dashSub}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(selectedRole === "client"
              ? projects.filter((proj) => clientMatches(proj, clientLogin))
              : projects
            ).map((proj, i) => {
              const isComplete = proj.phase === 5;
              const phaseColor = PHASE_COLORS[proj.phase];
              const phaseBg = PHASE_BG[proj.phase];
              return (
                <motion.div
                  key={proj.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  onClick={() => {
                    setActiveProject(proj.id);
                    setView("project");
                  }}
                  className="group cursor-pointer overflow-hidden transition-all duration-400 hover:-translate-y-1"
                  style={{
                    background: "white",
                    border: "1px solid rgba(184,144,60,0.12)",
                    boxShadow: "0 0 0 0 rgba(184,144,60,0)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 20px 50px rgba(0,0,0,0.08)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 0 0 0 rgba(184,144,60,0)")
                  }
                >
                  {/* Cover image */}
                  <div
                    className="relative overflow-hidden"
                    style={{ height: 160 }}
                  >
                    <img
                      src={proj.coverImg}
                      alt={proj.nameEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      style={{ filter: "brightness(0.75)" }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(13,11,9,0.8), transparent)",
                      }}
                    />
                    <div
                      className="absolute top-3 right-3 px-2.5 py-1 font-body text-[9px] tracking-widest uppercase"
                      style={{
                        background: isComplete
                          ? "rgba(59,109,17,0.9)"
                          : "rgba(13,11,9,0.75)",
                        color: isComplete ? "white" : "#D4AC5A",
                        border: `1px solid ${isComplete ? "transparent" : "rgba(184,144,60,0.3)"}`,
                      }}
                    >
                      {isComplete ? tp.completedBadge : tp.activeBadge}
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <p className="font-body text-[9px] tracking-widest uppercase text-white/50">
                        {proj.id}
                      </p>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-5">
                    <h3
                      className="font-display text-base font-400 text-onyx leading-snug mb-3"
                      style={{
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {isAr ? proj.nameAr : proj.nameEn}
                    </h3>

                    {/* Type badge */}
                    <span
                      className="inline-block px-2.5 py-0.5 font-body text-[9px] tracking-wide uppercase mb-4"
                      style={{
                        background: phaseBg,
                        color: phaseColor,
                        border: `1px solid ${phaseColor}22`,
                      }}
                    >
                      {isAr ? proj.typeAr : proj.typeEn}
                    </span>

                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="flex justify-between mb-1.5">
                        <span className="font-body text-[10px] text-charcoal/40 uppercase tracking-wide">
                          {tp.progress}
                        </span>
                        <span
                          className="font-body text-[10px] font-600"
                          style={{ color: phaseColor }}
                        >
                          {proj.progress}%
                        </span>
                      </div>
                      <div
                        className="h-1.5 w-full rounded-full overflow-hidden"
                        style={{ background: "rgba(28,25,23,0.06)" }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${proj.progress}%` }}
                          transition={{
                            duration: 1,
                            delay: i * 0.1 + 0.3,
                            ease: "easeOut",
                          }}
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${phaseColor}, ${phaseColor}88)`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Current phase */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ background: phaseColor }}
                        />
                        <span className="font-body text-xs text-charcoal/60">
                          {tp.phases[proj.phase]}
                        </span>
                      </div>
                      <span className="font-body text-xs text-charcoal/35">
                        {proj.deliveryDate}
                      </span>
                    </div>
                  </div>

                  {/* Hover CTA */}
                  <div className="px-5 pb-5">
                    <div className="flex items-center gap-2 font-body text-xs text-yellow-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>{isAr ? "عرض التفاصيل" : "View Details"}</span>
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={isAr ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Book appointment link */}
          <div
            className="mt-12 p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{
              background: "#0D0B09",
              border: "1px solid rgba(184,144,60,0.15)",
            }}
          >
            <div>
              <p className="font-display text-xl font-300 text-white">
                {isAr ? "تريد زيارة المعرض؟" : "Want to visit our showroom?"}
              </p>
              <p className="font-body text-xs text-white/40 mt-1">
                {isAr
                  ? "احجز موعداً ومشاهدة مشروعك والمواد عن قرب."
                  : "Book an appointment to see your project materials in person."}
              </p>
            </div>
            <Link to="/appointment" className="btn-gold flex-shrink-0">
              {isAr ? "احجز موعداً" : "Book a Visit"} →
            </Link>
          </div>
        </div>
      </div>
    );

  // ── PROJECT DETAIL VIEW ───────────────────────────────────────────────────
  if (view === "project" && project) {
    const phaseColor = PHASE_COLORS[project.phase];
    return (
      <div
        className="min-h-screen"
        style={{ background: "#FAF7F2" }}
        dir={isAr ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-40"
          style={{
            background: "#0D0B09",
            borderBottom: "1px solid rgba(184,144,60,0.15)",
          }}
        >
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <button
              onClick={() => setView("dashboard")}
              className="flex items-center gap-2 font-body text-sm text-white/60 hover:text-white transition-colors"
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
                  d={isAr ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
                />
              </svg>
              {tp.backToDash}
            </button>
            <div className="flex items-center gap-4">
              <span className="font-body text-[10px] tracking-widest uppercase text-white/30">
                {project.id}
              </span>
              <button
                onClick={handleLogout}
                className="font-body text-xs text-white/20 hover:text-white/50 transition-colors"
              >
                {tp.logout}
              </button>
            </div>
          </div>
        </div>

        {/* Project hero */}
        <div className="relative" style={{ height: 220 }}>
          <img
            src={project.coverImg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.3)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(13,11,9,0.4), rgba(13,11,9,0.95))",
            }}
          />
          <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex flex-col justify-end pb-8">
            <span
              className="font-body text-[10px] tracking-[0.3em] uppercase mb-2"
              style={{ color: "#D4AC5A" }}
            >
              {isAr ? project.typeAr : project.typeEn} · {project.id}
            </span>
            <h1 className="font-display text-2xl md:text-3xl font-300 text-white leading-snug">
              {isAr ? project.nameAr : project.nameEn}
            </h1>
          </div>
        </div>

        {/* Phase tracker */}
        <PhaseTracker
          phase={project.phase}
          phases={tp.phases}
          phaseShort={tp.phaseShort}
          isAr={isAr}
        />

        {/* Content grid */}
        <div className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-8">
          {/* Left column: updates + items */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project info cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { lbl: tp.progress, val: `${project.progress}%` },
                {
                  lbl: tp.manager,
                  val: isAr ? project.managerAr : project.managerEn,
                },
                { lbl: tp.startDate, val: project.startDate },
                { lbl: tp.deliveryDate, val: project.deliveryDate },
              ].map((info) => (
                <div
                  key={info.lbl}
                  className="p-4"
                  style={{
                    background: "white",
                    border: "1px solid rgba(184,144,60,0.1)",
                  }}
                >
                  <p className="font-body text-[9px] tracking-[0.2em] uppercase text-charcoal/40 mb-1">
                    {info.lbl}
                  </p>
                  <p className="font-body text-sm font-500 text-onyx">
                    {info.val}
                  </p>
                </div>
              ))}
            </div>

            {/* Updates timeline */}
            <div>
              <h3 className="font-display text-xl font-400 text-onyx mb-5">
                {tp.updates}
              </h3>
              <div className="relative space-y-0">
                {/* Vertical line */}
                <div
                  className="absolute left-4 top-4 bottom-4 w-px"
                  style={{ background: "rgba(184,144,60,0.15)" }}
                />
                {project.updates.map((upd, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className="flex gap-6 py-5"
                    style={{
                      borderBottom:
                        i < project.updates.length - 1
                          ? "1px solid rgba(184,144,60,0.07)"
                          : "none",
                    }}
                  >
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{
                          background: PHASE_BG[upd.phase],
                          border: `1px solid ${PHASE_COLORS[upd.phase]}33`,
                          zIndex: 1,
                          position: "relative",
                        }}
                      >
                        <span className="text-[10px]">
                          {["🎨", "✅", "🔨", "✨", "🚚", "🏠"][upd.phase]}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="font-body text-[10px] text-charcoal/35 tracking-wide mb-1">
                        {upd.date} · {tp.phaseShort[upd.phase]}
                      </p>
                      <p className="font-body text-sm leading-relaxed text-charcoal/75">
                        {isAr ? upd.textAr : upd.textEn}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Items ordered */}
            <div>
              <h3 className="font-display text-xl font-400 text-onyx mb-5">
                {tp.items}
              </h3>
              <div className="space-y-2">
                {project.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4"
                    style={{
                      background: "white",
                      border: "1px solid rgba(184,144,60,0.1)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 flex items-center justify-center"
                        style={{ background: "rgba(184,144,60,0.08)" }}
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="#B8903C"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                      </div>
                      <span className="font-body text-sm text-charcoal/75">
                        {isAr ? item.nameAr : item.nameEn}
                      </span>
                    </div>
                    <span className="font-body text-xs text-charcoal/40">
                      {tp.qty}: {item.qty}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: docs + contact */}
          <div className="space-y-8">
            {/* Contact manager */}
            <div
              className="p-6"
              style={{
                background: "#0D0B09",
                border: "1px solid rgba(184,144,60,0.15)",
              }}
            >
              <h4 className="font-body text-[10px] tracking-[0.3em] uppercase text-yellow-500 mb-4">
                {tp.contact}
              </h4>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-body text-sm font-600 text-yellow-900 flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg,#B8903C,#D4AC5A)",
                  }}
                >
                  {isAr
                    ? project.managerAr
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                    : project.managerEn
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                </div>
                <div>
                  <p className="font-body text-sm font-500 text-white">
                    {isAr ? project.managerAr : project.managerEn}
                  </p>
                  <p className="font-body text-[10px] text-white/35">
                    {isAr ? "مدير مشروعك" : "Your Project Manager"}
                  </p>
                </div>
              </div>
              <a
                href={`https://wa.me/${project.managerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(isAr ? `مرحباً، أريد الاستفسار عن مشروع ${project.id}` : `Hello, I'd like to ask about project ${project.id}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 text-white font-body text-xs tracking-widest uppercase transition-all hover:-translate-y-0.5"
                style={{ background: "#25D366" }}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {tp.whatsappManager}
              </a>
            </div>

            {/* Documents */}
            <div>
              <h3 className="font-display text-xl font-400 text-onyx mb-4">
                {tp.documents}
              </h3>
              <div className="space-y-2">
                {project.docs.map((doc, i) => (
                  <DocCard
                    key={i}
                    doc={doc}
                    isAr={isAr}
                    downloadLabel={tp.download}
                    downloadNote={tp.downloadNote}
                  />
                ))}
              </div>
              <p className="font-body text-[9px] text-charcoal/30 mt-3 italic">
                {tp.downloadNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
