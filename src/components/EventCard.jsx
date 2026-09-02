const SCENE_COLORS = {
  ruta: { from: "#3b82f6", to: "#1d4ed8", icon: "🚴" },
  mtb: { from: "#22c55e", to: "#15803d", icon: "🚵" },
  running: { from: "#f97316", to: "#c2410c", icon: "🏃" },
  duatlon: { from: "#a855f7", to: "#7e22ce", icon: "🏅" },
  triatlon: { from: "#06b6d4", to: "#0e7490", icon: "🏊" },
  otros: { from: "#8b5cf6", to: "#6d28d9", icon: "📋" },
};

function formatDate(d) {
  if (!d) return "";
  return new Date(d + "T00:00:00").toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatMoney(v) {
  if (!v && v !== 0) return "";
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(v);
}

export default function EventCard({ event, onEdit, onDelete }) {
  const colors = SCENE_COLORS[event.event_type] || SCENE_COLORS.otros;

  return (
    <div className="glass rounded-2xl overflow-hidden animate-slide-up hover:shadow-xl transition-shadow">
      <div
        className="h-32 flex items-center justify-center text-5xl"
        style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}
      >
        {event.image_url ? (
          <img src={event.image_url} alt={event.name} className="w-full h-full object-cover" />
        ) : (
          <span>{colors.icon}</span>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{event.name}</h3>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>📍 {event.location}</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="px-2 py-1 rounded-full bg-brand-100 text-brand-700 font-medium">
            {event.event_type}
          </span>
          <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600">
            {event.chip_type}
          </span>
        </div>
        <div className="text-sm text-slate-600">
          <p>📅 {formatDate(event.event_date)}{event.end_date ? ` — ${formatDate(event.end_date)}` : ""}</p>
          {(event.event_value > 0) && (
            <p className="font-semibold text-brand-700">{formatMoney(event.event_value)}</p>
          )}
          {event.advance_payment > 0 && (
            <p className="text-xs text-slate-500">Anticipo: {formatMoney(event.advance_payment)}</p>
          )}
        </div>
        {event.description && (
          <p className="text-xs text-slate-500 line-clamp-2">{event.description}</p>
        )}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onEdit(event)}
            className="flex-1 py-1.5 text-sm bg-brand-100 hover:bg-brand-200 text-brand-700 rounded-xl font-medium transition"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="py-1.5 px-3 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-medium transition"
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  );
}
