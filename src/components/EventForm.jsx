import { useState, useEffect } from "react";
import { uploadImage } from "../services/storage";

const EVENT_TYPES = ["ruta", "mtb", "running", "duatlon", "triatlon", "otros"];
const CHIP_TYPES = ["Retornable", "No retornable"];

const EMPTY = {
  name: "",
  description: "",
  event_date: "",
  end_date: "",
  location: "",
  image_url: "",
  event_type: "otros",
  chip_type: "No retornable",
  event_value: "",
  advance_payment: "",
  notes: "",
};

function detectEventType(name) {
  const n = (name || "").toLowerCase();
  if (/cicl|bmx|ruta/.test(n)) return "ruta";
  if (/trail|run/.test(n)) return "running";
  return "otros";
}

export default function EventForm({ onSave, editingEvent, onCancel }) {
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (editingEvent) {
      setForm({
        name: editingEvent.name || "",
        description: editingEvent.description || "",
        event_date: editingEvent.event_date || "",
        end_date: editingEvent.end_date || "",
        location: editingEvent.location || "",
        image_url: editingEvent.image_url || "",
        event_type: editingEvent.event_type || "otros",
        chip_type: editingEvent.chip_type || "No retornable",
        event_value: editingEvent.event_value ?? "",
        advance_payment: editingEvent.advance_payment ?? "",
        notes: editingEvent.notes || "",
      });
    } else {
      setForm(EMPTY);
    }
    setFile(null);
    setMsg("");
  }, [editingEvent]);

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const handleNameChange = (v) => {
    set("name", v);
    if (!editingEvent && !form.event_type) {
      set("event_type", detectEventType(v));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      let image_url = form.image_url;
      if (file) {
        const path = `events/${Date.now()}_${file.name}`;
        image_url = await uploadImage(file, path);
      }
      const data = {
        ...form,
        event_value: Number(form.event_value) || 0,
        advance_payment: Number(form.advance_payment) || 0,
        image_url,
      };
      await onSave(data);
      setMsg(editingEvent ? "Evento actualizado." : "Evento creado.");
      if (!editingEvent) setForm(EMPTY);
      setFile(null);
    } catch (err) {
      setMsg("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-6 animate-slide-up">
      <h2 className="text-xl font-bold text-brand-700 mb-4">
        {editingEvent ? "Editar evento" : "Nuevo evento"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
            <input
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="Ej: Gran Fondo Bogotá 2026"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ubicación *</label>
            <input
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="Ej: Bogotá, Colombia"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de evento</label>
            <select
              value={form.event_type}
              onChange={(e) => set("event_type", e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
            >
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fecha inicio *</label>
            <input
              type="date"
              value={form.event_date}
              onChange={(e) => set("event_date", e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fecha fin</label>
            <input
              type="date"
              value={form.end_date}
              onChange={(e) => set("end_date", e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de chip</label>
            <select
              value={form.chip_type}
              onChange={(e) => set("chip_type", e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
            >
              {CHIP_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Valor del evento ($)</label>
            <input
              type="number"
              value={form.event_value}
              onChange={(e) => set("event_value", e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Anticipo ($)</label>
            <input
              type="number"
              value={form.advance_payment}
              onChange={(e) => set("advance_payment", e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="0"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={2}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Notas</label>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={2}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-brand-100 file:text-brand-700 hover:file:bg-brand-200"
            />
            {form.image_url && !file && (
              <img src={form.image_url} alt="Preview" className="mt-2 h-24 rounded-xl object-cover" />
            )}
          </div>
        </div>
        {msg && (
          <p className={`text-sm ${msg.startsWith("Error") ? "text-red-600" : "text-green-600"}`}>{msg}</p>
        )}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition disabled:opacity-50"
          >
            {saving ? "Guardando..." : editingEvent ? "Actualizar" : "Crear evento"}
          </button>
          {editingEvent && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
