import { useState, useMemo } from "react";
import { useEvents } from "./hooks/useEvents";
import { useAuth } from "./hooks/useAuth";
import LoginForm from "./components/LoginForm";
import EventForm from "./components/EventForm";
import EventList from "./components/EventList";
import FilterBar from "./components/FilterBar";

const ALL_TYPES = ["ruta", "mtb", "running", "duatlon", "triatlon", "otros"];
const ALL_CHIPS = ["Retornable", "No retornable"];

export default function App() {
  const { user, loading: authLoading, login, register, logout } = useAuth();
  const { events, loading, add, edit, remove } = useEvents();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    event_type: "",
    chip_type: "",
    month: "",
  });

  const locations = useMemo(
    () => [...new Set(events.map((e) => e.location).filter(Boolean))].sort(),
    [events]
  );

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (filters.search) {
        const s = filters.search.toLowerCase();
        if (
          !e.name?.toLowerCase().includes(s) &&
          !e.description?.toLowerCase().includes(s) &&
          !e.location?.toLowerCase().includes(s)
        )
          return false;
      }
      if (filters.location && e.location !== filters.location) return false;
      if (filters.event_type && e.event_type !== filters.event_type) return false;
      if (filters.chip_type && e.chip_type !== filters.chip_type) return false;
      if (filters.month && e.event_date) {
        const eventMonth = e.event_date.substring(5, 7);
        if (eventMonth !== filters.month) return false;
      } else if (filters.month && !e.event_date) {
        return false;
      }
      return true;
    });
  }, [events, filters]);

  const handleSave = async (data) => {
    if (editing) {
      await edit(editing.id, data);
      setEditing(null);
    } else {
      await add(data);
    }
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este evento?")) {
      await remove(id);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-brand-600 text-lg animate-pulse">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={login} onRegister={register} onResetPassword={() => {}} />;
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-700">Agenda de Cronometrajes</h1>
          <p className="text-slate-500 text-sm">TCT Colombia</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setEditing(null); setShowForm(!showForm); }}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition"
          >
            {showForm ? "Cerrar" : "+ Nuevo evento"}
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition"
          >
            Salir
          </button>
        </div>
      </header>

      {showForm && (
        <EventForm
          onSave={handleSave}
          editingEvent={editing}
          onCancel={() => { setEditing(null); setShowForm(false); }}
        />
      )}

      <FilterBar
        filters={filters}
        setFilters={setFilters}
        locations={locations}
        eventTypes={ALL_TYPES}
        chipTypes={ALL_CHIPS}
      />

      <div className="text-sm text-slate-500">
        {filtered.length} evento{filtered.length !== 1 ? "s" : ""}
        {filtered.length !== events.length && ` de ${events.length}`}
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 animate-pulse">Cargando eventos...</div>
      ) : (
        <EventList events={filtered} onEdit={(e) => { setEditing(e); setShowForm(true); }} onDelete={handleDelete} />
      )}
    </div>
  );
}
