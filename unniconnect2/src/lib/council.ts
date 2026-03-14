import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export async function getAnnouncements() {
  const snap = await getDocs(collection(db, "announcements"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getSurveys() {
  const snap = await getDocs(collection(db, "surveys"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
