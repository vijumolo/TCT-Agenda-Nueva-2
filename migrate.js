import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { readFileSync } from "fs";

const firebaseConfig = {
  apiKey: "AIzaSyCGuLckWcL27m_q0pG53yTGsUkYLdn3wmo",
  authDomain: "agenda-eventos-tct.firebaseapp.com",
  projectId: "agenda-eventos-tct",
  storageBucket: "agenda-eventos-tct.firebasestorage.app",
  messagingSenderId: "319137974281",
  appId: "1:319137974281:web:584ebc5c896713b3f710d8",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function parseCSV(text) {
  const lines = [];
  let current = "";
  let inQuotes = false;

  for (const ch of text) {
    if (ch === '"') {
      inQuotes = !inQuotes;
      current += ch;
    } else if (ch === "\n" && !inQuotes) {
      lines.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  if (current) lines.push(current);

  const headers = parseCSVLine(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseCSVLine(lines[i]);
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h.trim()] = (values[idx] || "").trim();
    });
    rows.push(obj);
  }
  return rows;
}

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

async function migrate() {
  const csv = readFileSync("C:\\Users\\VICTOR\\Downloads\\event_config_rows.csv", "utf-8");
  const rows = parseCSV(csv);
  console.log(`Found ${rows.length} events to migrate.\n`);

  let count = 0;
  for (const row of rows) {
    const data = {
      name: row.name || "",
      description: (row.description || "").replace(/\n/g, " "),
      event_date: row.event_date || "",
      end_date: row.end_date || "",
      location: row.location || "",
      image_url: row.image_url || "",
      event_type: row.event_type || "otros",
      chip_type: row.chip_type || "No retornable",
      event_value: parseFloat(row.event_value) || 0,
      advance_payment: parseFloat(row.advance_payment) || 0,
      notes: (row.notes || "").replace(/\n/g, " "),
      created_at: row.created_at || new Date().toISOString(),
      updated_at: row.updated_at || new Date().toISOString(),
    };

    await addDoc(collection(db, "event_config"), data);
    count++;
    console.log(`  ✓ [${count}/${rows.length}] ${data.name}`);
  }

  console.log(`\nMigration complete! ${count} events imported to Firestore.`);
}

migrate().catch(console.error);
