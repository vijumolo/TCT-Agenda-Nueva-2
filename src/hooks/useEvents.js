import { useState, useEffect } from "react";
import { getEvents, createEvent, updateEvent, deleteEvent } from "../services/events";

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEvents();
      setEvents(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const add = async (data) => {
    const created = await createEvent(data);
    setEvents((prev) => [...prev, created]);
    return created;
  };

  const edit = async (id, data) => {
    const updated = await updateEvent(id, data);
    setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
    return updated;
  };

  const remove = async (id) => {
    await deleteEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return { events, loading, error, add, edit, remove, reload: load };
}
