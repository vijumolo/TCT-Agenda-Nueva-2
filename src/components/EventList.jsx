import EventCard from "./EventCard";

export default function EventList({ events, onEdit, onDelete, canEdit }) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p className="text-4xl mb-4">📋</p>
        <p className="text-lg font-medium">No se encontraron eventos</p>
        <p className="text-sm">Ajusta los filtros o vuelve más tarde</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((ev) => (
        <EventCard
          key={ev.id}
          event={ev}
          onEdit={onEdit}
          onDelete={onDelete}
          canEdit={canEdit}
        />
      ))}
    </div>
  );
}
