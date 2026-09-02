import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION = "event_config";

export const getEvents = async () => {
  const q = query(collection(db, COLLECTION), orderBy("event_date", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getEvent = async (id) => {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};

export const createEvent = async (data) => {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  const snap = await getDoc(docRef);
  return { id: snap.id, ...snap.data() };
};

export const updateEvent = async (id, data) => {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, {
    ...data,
    updated_at: new Date().toISOString(),
  });
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
};

export const deleteEvent = async (id) => {
  await deleteDoc(doc(db, COLLECTION, id));
  return { id };
};
