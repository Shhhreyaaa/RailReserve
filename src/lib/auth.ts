import bcrypt from "bcryptjs";
import { User } from "./types";
import { DEFAULT_USERS } from "./seed";
import { auth as firebaseAuth, isFirebaseConfigured, db } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const KEYS = {
  CURRENT_USER: "railreserve_current_user",
  USERS: "railreserve_users",
};

// LocalStorage helpers
function getLocalUsers(): User[] {
  if (typeof window === "undefined") return DEFAULT_USERS;
  const data = localStorage.getItem(KEYS.USERS);
  if (!data) {
    // Save defaults with hashed passwords
    const hashedDefaults = DEFAULT_USERS.map((u) => ({
      ...u,
      password: bcrypt.hashSync("password123", 10), // Default password is password123
    }));
    localStorage.setItem(KEYS.USERS, JSON.stringify(hashedDefaults));
    return hashedDefaults;
  }
  return JSON.parse(data);
}

function setLocalUsers(users: User[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
}

export function setCurrentUser(user: User | null): void {
  if (typeof window !== "undefined") {
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER);
    }
  }
}

export async function login(loginId: string, password: string): Promise<User> {
  const loginIdClean = loginId.trim().toLowerCase();

  if (isFirebaseConfigured && firebaseAuth && db) {
    try {
      // Map username to a fake email format for Firebase Auth, e.g. loginId@railreserve.local
      const email = `${loginIdClean}@railreserve.local`;
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const fbUser = userCredential.user;

      // Get user profile details from Firestore
      const userDoc = await getDoc(doc(db, "users", fbUser.uid));
      if (userDoc.exists()) {
        const u = userDoc.data() as User;
        setCurrentUser(u);
        return u;
      } else {
        const fallbackUser: User = {
          id: fbUser.uid,
          login_id: loginIdClean,
          full_name: fbUser.displayName || loginIdClean,
          email: fbUser.email || undefined,
          created_at: new Date().toISOString(),
        };
        await setDoc(doc(db, "users", fbUser.uid), fallbackUser);
        setCurrentUser(fallbackUser);
        return fallbackUser;
      }
    } catch (e: any) {
      console.warn("Firebase Auth failed, falling back to LocalStorage auth", e);
      // If firebase fails due to credentials, fallback below
    }
  }

  // Fallback / standard LocalStorage login
  const users = getLocalUsers();
  const found = users.find((u) => u.login_id.toLowerCase() === loginIdClean);
  if (!found) {
    throw new Error("Invalid username/login ID.");
  }

  if (found.password && !bcrypt.compareSync(password, found.password)) {
    throw new Error("Incorrect password.");
  }

  const { password: _, ...userWithoutPassword } = found;
  const userObj = userWithoutPassword as User;
  setCurrentUser(userObj);
  return userObj;
}

export async function register(
  loginId: string,
  password: string,
  fullName: string,
  email?: string,
  phone?: string
): Promise<User> {
  const loginIdClean = loginId.trim().toLowerCase();
  if (!loginIdClean || loginIdClean.length < 3) {
    throw new Error("Username must be at least 3 characters long.");
  }
  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }
  if (!fullName.trim()) {
    throw new Error("Full name is required.");
  }

  if (isFirebaseConfigured && firebaseAuth && db) {
    try {
      const fbEmail = `${loginIdClean}@railreserve.local`;
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, fbEmail, password);
      const fbUser = userCredential.user;

      const newUser: User = {
        id: fbUser.uid,
        login_id: loginIdClean,
        full_name: fullName,
        email: email || undefined,
        phone: phone || undefined,
        created_at: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", fbUser.uid), newUser);
      setCurrentUser(newUser);
      return newUser;
    } catch (e: any) {
      if (e.code === "auth/email-already-in-use") {
        throw new Error("Username / Login ID is already taken.");
      }
      console.warn("Firebase Auth registration failed, falling back to LocalStorage", e);
    }
  }

  // Fallback LocalStorage registration
  const users = getLocalUsers();
  const exists = users.some((u) => u.login_id.toLowerCase() === loginIdClean);
  if (exists) {
    throw new Error("Username / Login ID is already taken.");
  }

  const newUser: User = {
    id: "user-" + Math.random().toString(36).substr(2, 9),
    login_id: loginIdClean,
    password: bcrypt.hashSync(password, 10),
    full_name: fullName,
    email: email || undefined,
    phone: phone || undefined,
    created_at: new Date().toISOString(),
  };

  users.push(newUser);
  setLocalUsers(users);

  const { password: _, ...userWithoutPassword } = newUser;
  const userObj = userWithoutPassword as User;
  setCurrentUser(userObj);
  return userObj;
}

export async function logout(): Promise<void> {
  if (isFirebaseConfigured && firebaseAuth) {
    try {
      await firebaseSignOut(firebaseAuth);
    } catch (e) {
      console.warn("Firebase SignOut failed", e);
    }
  }
  setCurrentUser(null);
}
