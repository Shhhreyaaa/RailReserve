import { Train, Reservation, User } from "./types";
import { DEFAULT_TRAINS, DEFAULT_RESERVATIONS, DEFAULT_USERS } from "./seed";
import { db, isFirebaseConfigured } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  addDoc,
} from "firebase/firestore";

// LocalStorage helpers
const KEYS = {
  TRAINS: "railreserve_trains",
  RESERVATIONS: "railreserve_reservations",
  USERS: "railreserve_users",
};

function getLocal<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
}

function setLocal<T>(key: string, value: T): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export function initializeDatabase() {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(KEYS.TRAINS)) {
    setLocal(KEYS.TRAINS, DEFAULT_TRAINS);
  }
  if (!localStorage.getItem(KEYS.RESERVATIONS)) {
    setLocal(KEYS.RESERVATIONS, DEFAULT_RESERVATIONS);
  }
  if (!localStorage.getItem(KEYS.USERS)) {
    setLocal(KEYS.USERS, DEFAULT_USERS);
  }
}

// Generate PNR: 10-character alphanumeric
export function generatePNR(): string {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "PNR";
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// TRAINS
export async function getTrains(): Promise<Train[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, "trains"));
      if (snap.empty) {
        // If Firestore is empty, seed it
        const trains: Train[] = [];
        for (const train of DEFAULT_TRAINS) {
          await setDoc(doc(db, "trains", train.train_number), train);
          trains.push(train);
        }
        return trains;
      }
      return snap.docs.map((d) => d.data() as Train);
    } catch (e) {
      console.warn("Firebase Firestore failed, falling back to LocalStorage", e);
    }
  }

  // Fallback to LocalStorage
  initializeDatabase();
  return getLocal<Train[]>(KEYS.TRAINS, DEFAULT_TRAINS);
}

// RESERVATIONS
export async function getReservations(userId?: string): Promise<Reservation[]> {
  if (isFirebaseConfigured && db) {
    try {
      const q = collection(db, "reservations");
      let snap;
      if (userId) {
        const queryRef = query(q, where("user_id", "==", userId));
        snap = await getDocs(queryRef);
      } else {
        snap = await getDocs(q);
      }
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Reservation);
    } catch (e) {
      console.warn("Firebase Firestore failed, falling back to LocalStorage", e);
    }
  }

  // Fallback to LocalStorage
  initializeDatabase();
  const list = getLocal<Reservation[]>(KEYS.RESERVATIONS, DEFAULT_RESERVATIONS);
  if (userId) {
    return list.filter((r) => r.user_id === userId);
  }
  return list;
}

export async function getReservationByPnr(pnr: string): Promise<Reservation | null> {
  const pnrUpper = pnr.toUpperCase();
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, "reservations"), where("pnr", "==", pnrUpper));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const docSnap = snap.docs[0];
        return { id: docSnap.id, ...docSnap.data() } as Reservation;
      }
      return null;
    } catch (e) {
      console.warn("Firebase Firestore failed, falling back to LocalStorage", e);
    }
  }

  // Fallback to LocalStorage
  initializeDatabase();
  const list = getLocal<Reservation[]>(KEYS.RESERVATIONS, DEFAULT_RESERVATIONS);
  const found = list.find((r) => r.pnr.toUpperCase() === pnrUpper);
  return found || null;
}

export async function createReservation(
  data: Omit<Reservation, "id" | "pnr" | "booking_timestamp" | "status">
): Promise<Reservation> {
  const pnr = generatePNR();
  const booking_timestamp = new Date().toISOString();
  const status = "Confirmed";

  if (isFirebaseConfigured && db) {
    try {
      const resRef = collection(db, "reservations");
      const docData = {
        ...data,
        pnr,
        booking_timestamp,
        status,
      };
      const docRef = await addDoc(resRef, docData);
      return {
        id: docRef.id,
        ...docData,
      } as Reservation;
    } catch (e) {
      console.warn("Firebase Firestore failed, falling back to LocalStorage", e);
    }
  }

  // Fallback to LocalStorage
  initializeDatabase();
  const list = getLocal<Reservation[]>(KEYS.RESERVATIONS, DEFAULT_RESERVATIONS);
  const newReservation: Reservation = {
    id: "res-" + Math.random().toString(36).substr(2, 9),
    pnr,
    booking_timestamp,
    status,
    ...data,
  };
  list.unshift(newReservation); // Add to beginning of array
  setLocal(KEYS.RESERVATIONS, list);
  return newReservation;
}

export async function cancelReservation(id: string): Promise<boolean> {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "reservations", id);
      await updateDoc(docRef, { status: "Cancelled" });
      return true;
    } catch (e) {
      console.warn("Firebase Firestore failed, falling back to LocalStorage", e);
    }
  }

  // Fallback to LocalStorage
  initializeDatabase();
  const list = getLocal<Reservation[]>(KEYS.RESERVATIONS, DEFAULT_RESERVATIONS);
  const idx = list.findIndex((r) => r.id === id);
  if (idx !== -1) {
    list[idx].status = "Cancelled";
    setLocal(KEYS.RESERVATIONS, list);
    return true;
  }
  return false;
}
