const MONTHS = [
  { value: "01", label: "Enero" },
  { value: "02", label: "Febrero" },
  { value: "03", label: "Marzo" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Mayo" },
  { value: "06", label: "Junio" },
  { value: "07", label: "Julio" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];

export default function FilterBar({ filters, setFilters, locations, eventTypes, chipTypes }) {
  const set = (k, v) => setFilters((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="glass rounded-2xl p-4 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <input
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          placeholder="Buscar evento..."
          className="px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none text-sm"
        />
        <select
          value={filters.month}
          onChange={(e) => set("month", e.target.value)}
          className="px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none text-sm"
        >
          <option value="">Todos los meses</option>
          {MONTHS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
        <select
          value={filters.location}
          onChange={(e) => set("location", e.target.value)}
          className="px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none text-sm"
        >
          <option value="">Todas las ubicaciones</option>
          {locations.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <select
          value={filters.event_type}
          onChange={(e) => set("event_type", e.target.value)}
          className="px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none text-sm"
        >
          <option value="">Todos los tipos</option>
          {eventTypes.map((t) => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
        <select
          value={filters.chip_type}
          onChange={(e) => set("chip_type", e.target.value)}
          className="px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none text-sm"
        >
          <option value="">Todos los chips</option>
          {chipTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button
          onClick={() => setFilters({ search: "", location: "", event_type: "", chip_type: "", month: "" })}
          className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium transition"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}
