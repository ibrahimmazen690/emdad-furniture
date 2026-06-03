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

// Admin "New Orders" section — lists customer inquiries and shows full details.
// Opening a new order marks it read (which clears its badge).
export default function AdminOrders({
  orders,
  activeOrderId,
  setActiveOrderId,
  onMarkRead,
  onDelete,
  onCreateProject,
}) {
  const activeOrder = orders.find((o) => o.id === activeOrderId) || null;
  const newCount = orders.filter((o) => o.status === "new").length;

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* ── Sidebar: order list ─────────────────────────────────────────── */}
      <div
        className="w-72 flex-shrink-0 flex flex-col overflow-hidden"
        style={{ background: "#1C1917", borderRight: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-yellow-500/60">
            Inquiries ({orders.length}){newCount > 0 ? ` · ${newCount} new` : ""}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {orders.length === 0 ? (
            <p className="p-6 font-body text-xs text-white/30 text-center leading-relaxed">
              No inquiries yet. When a customer sends a request from a product,
              it appears here.
            </p>
          ) : (
            orders.map((o) => {
              const isActive = o.id === activeOrderId;
              const isNew = o.status === "new";
              return (
                <button
                  key={o.id}
                  onClick={() => {
                    setActiveOrderId(o.id);
                    if (isNew) onMarkRead(o.id);
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
                      {o.name}
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
                  <p
                    className="font-body text-[11px] text-white/40 leading-snug mb-1"
                    style={{ overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}
                  >
                    {o.productTitle || "—"}
                  </p>
                  <p className="font-body text-[10px] text-white/25">{fmtDate(o.createdAt)}</p>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Detail panel ────────────────────────────────────────────────── */}
      {activeOrder ? (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto p-8">
            <div
              className="flex items-start justify-between mb-6 pb-6"
              style={{ borderBottom: "1px solid rgba(28,25,23,0.08)" }}
            >
              <div>
                <p className="font-body text-[10px] tracking-widest uppercase mb-1" style={{ color: "#B8903C" }}>
                  {activeOrder.id}
                </p>
                <h2 className="font-display text-2xl font-400 text-onyx">{activeOrder.name}</h2>
                <p className="font-body text-xs text-charcoal/40 mt-1">{fmtDate(activeOrder.createdAt)}</p>
              </div>
              <button
                onClick={() => onDelete(activeOrder.id)}
                className="flex-shrink-0 px-4 py-2 font-body text-xs uppercase tracking-wide transition-colors hover:bg-red-50"
                style={{ border: "1px solid rgba(224,62,62,0.25)", color: "#E03E3E" }}
              >
                Delete
              </button>
            </div>

            {/* Product */}
            <div className="flex gap-4 mb-6 p-4" style={{ background: "white", border: "1px solid rgba(184,144,60,0.12)" }}>
              {activeOrder.productImage && (
                <img src={activeOrder.productImage} alt="" className="w-24 h-24 object-cover flex-shrink-0" />
              )}
              <div className="min-w-0">
                <p className="font-body text-[10px] tracking-widest uppercase text-charcoal/40 mb-1">
                  {activeOrder.category || "Product"}
                </p>
                <p className="font-display text-lg text-onyx">{activeOrder.productTitle || "—"}</p>
                {activeOrder.finish && (
                  <p className="font-body text-xs text-charcoal/50 mt-1">
                    Finish requested: <span style={{ color: "#8B6350" }}>{activeOrder.finish}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Field label="Phone">
                <a href={`tel:${activeOrder.phone}`} className="text-onyx hover:text-yellow-700">
                  {activeOrder.phone}
                </a>
              </Field>
              <Field label="Email">
                {activeOrder.email ? (
                  <a href={`mailto:${activeOrder.email}`} className="text-onyx hover:text-yellow-700 break-all">
                    {activeOrder.email}
                  </a>
                ) : (
                  <span className="text-charcoal/30">—</span>
                )}
              </Field>
            </div>

            {/* Message */}
            <Field label="Message">
              <p className="font-body text-sm text-charcoal/70 leading-relaxed whitespace-pre-wrap">
                {activeOrder.message || <span className="text-charcoal/30">No message</span>}
              </p>
            </Field>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-8">
              <button
                onClick={() => onCreateProject(activeOrder)}
                className="btn-gold text-xs py-3 px-5"
              >
                + Create project from this inquiry
              </button>
              <a
                href={`https://wa.me/${(activeOrder.phone || "").replace(/[^0-9]/g, "")}`}
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
            Select an inquiry to view details
          </p>
        </div>
      )}
    </div>
  );
}
