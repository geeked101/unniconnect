// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager, Firestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore with proper persistence settings for Next.js
let db: Firestore;

if (typeof window !== "undefined") {
    try {
        // Try to initialize with persistence (better for production)
        db = initializeFirestore(app, {
            localCache: persistentLocalCache({
                tabManager: persistentMultipleTabManager()
            })
        });
    } catch (error) {
        // If already initialized or persistence fails, get the existing instance
        db = getFirestore(app);
    }
} else {
    db = getFirestore(app);
}

const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);

export { app, analytics, auth, googleProvider, db, storage };