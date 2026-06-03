import React from "react";

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso || "";
  }
}

function Field({ label, children }) {
  return (
    <div>
      <p className="font-body text-[10px] tracking-[0.2em] uppercase text-charcoal/35 mb-1.5">
        {label}
      </p>
      <div className="font-body text-sm">{children}</div>
    </div>
  );
}

// Admin "Appointments" section — showroom visit bookings. Opening a new one
// marks it read (clearing its badge).
export default function AdminAppointments({
  appointments,
  activeId,
  setActiveId,
  onMarkRead,
  onDelete,
  onCreateProject,
}) {
  const active = appointments.find((a) => a.id === activeId) || null;
  const newCount = appointments.filter((a) => a.status === "new").length;

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* ── Sidebar: bookings list ──────────────────────────────────────── */}
      <div
        className="w-72 flex-shrink-0 flex flex-col overflow-hidden"
        style={{ background: "#1C1917", borderRight: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-yellow-500/60">
            Bookings ({appointments.length}){newCount > 0 ? ` · ${newCount} new` : ""}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {appointments.length === 0 ? (
            <p className="p-6 font-body text-xs text-white/30 text-center leading-relaxed">
              No bookings yet. Showroom visits booked on the Appointment page
              appear here.
            </p>
          ) : (
            appointments.map((a) => {
              const isActive = a.id === activeId;
              const isNew = a.status === "new";
              return (
                <button
                  key={a.id}
                  onClick={() => {
                    setActiveId(a.id);
                    if (isNew) onMarkRead(a.id);
                  }}
                  className="w-full text-left p-4 transition-all duration-200"
                  style={{
                    background: isActive ? "rgba(184,144,60,0.1)" : "transparent",
                    borderLeft: isActive ? "2px solid #B8903C" : "2px solid transparent",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <span className="font-body text-xs text-white/80 font-600 truncate">
                      {a.name}
                    </span>
                    {isNew && (
                      <span
                        className="flex-shrink-0 text-[8px] font-700 uppercase px-1.5 py-0.5 rounded"
                        style={{ background: "#E03E3E", color: "white" }}
                      >
                        New
                      </span>
                    )}
                  </div>
                  <p className="font-body text-[11px] text-yellow-500/70 leading-snug mb-1">
                    {(a.dateLabel || a.date || "—")}{a.time ? ` · ${a.time}` : ""}
                  </p>
                  <p className="font-body text-[10px] text-white/25">
                    Booked {fmtDate(a.createdAt)}
                  </p>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Detail panel ────────────────────────────────────────────────── */}
      {active ? (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto p-8">
            <div
              className="flex items-start justify-between mb-6 pb-6"
              style={{ borderBottom: "1px solid rgba(28,25,23,0.08)" }}
            >
              <div>
                <p className="font-body text-[10px] tracking-widest uppercase mb-1" style={{ color: "#B8903C" }}>
                  {active.ref || active.id}
                </p>
                <h2 className="font-display text-2xl font-400 text-onyx">{active.name}</h2>
                <p className="font-body text-xs text-charcoal/40 mt-1">Booked {fmtDate(active.createdAt)}</p>
              </div>
              <button
                onClick={() => onDelete(active.id)}
                className="flex-shrink-0 px-4 py-2 font-body text-xs uppercase tracking-wide transition-colors hover:bg-red-50"
                style={{ border: "1px solid rgba(224,62,62,0.25)", color: "#E03E3E" }}
              >
                Delete
              </button>
            </div>

            {/* Visit slot */}
            <div className="flex gap-8 mb-6 p-5" style={{ background: "white", border: "1px solid rgba(184,144,60,0.12)" }}>
              <div>
                <p className="font-body text-[10px] tracking-widest uppercase text-charcoal/40 mb-1">Date</p>
                <p className="font-display text-lg text-onyx">{active.dateLabel || active.date || "—"}</p>
              </div>
              <div>
                <p className="font-body text-[10px] tracking-widest uppercase text-charcoal/40 mb-1">Time</p>
                <p className="font-display text-lg text-onyx">{active.time || "—"}</p>
              </div>
              {active.type && (
                <div>
                  <p className="font-body text-[10px] tracking-widest uppercase text-charcoal/40 mb-1">Visit type</p>
                  <p className="font-display text-lg" style={{ color: "#8B6350" }}>{active.type}</p>
                </div>
              )}
            </div>

            {/* Contact */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Field label="Phone">
                <a href={`tel:${active.phone}`} className="text-onyx hover:text-yellow-700">{active.phone}</a>
              </Field>
              <Field label="Email">
                {active.email ? (
                  <a href={`mailto:${active.email}`} className="text-onyx hover:text-yellow-700 break-all">{active.email}</a>
                ) : (
                  <span className="text-charcoal/30">—</span>
                )}
              </Field>
              {active.company && (
                <Field label="Company">
                  <span className="text-onyx">{active.company}</span>
                </Field>
              )}
            </div>

            {/* Notes */}
            <Field label="Notes">
              <p className="font-body text-sm text-charcoal/70 leading-relaxed whitespace-pre-wrap">
                {active.notes || <span className="text-charcoal/30">No notes</span>}
              </p>
            </Field>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-8">
              <button onClick={() => onCreateProject(active)} className="btn-gold text-xs py-3 px-5">
                + Create project from this booking
              </button>
              <a
                href={`https://wa.me/${(active.phone || "").replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-dark text-xs py-3 px-5"
              >
                Reply on WhatsApp →
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-center">
          <p className="font-body text-sm text-charcoal/40">
            Select a booking to view details
          </p>
        </div>
      )}
    </div>
  );
}
