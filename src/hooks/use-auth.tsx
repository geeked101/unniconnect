"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot, enableNetwork } from "firebase/firestore";

interface UserProfile {
    uid: string;
    email: string | null;
    firstName: string;
    lastName: string;
    bio: string;
    avatarUrl: string;
    major?: string;
    yearOfStudy?: string;
    joinedAt: string;
    instagram?: string;
    joinedGroups?: string[];
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    updateProfile: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribeProfile: (() => void) | null = null;

        // Make sure Firestore network is enabled
        enableNetwork(db).catch((err) => console.warn("Firestore network enable failed:", err));

        const unsubscribeAuth = onAuthStateChanged(auth, async (authenticatedUser) => {
            setLoading(true);
            setUser(authenticatedUser);

            // Stop old profile listener
            if (unsubscribeProfile) {
                unsubscribeProfile();
                unsubscribeProfile = null;
            }

            if (!authenticatedUser) {
                setProfile(null);
                setLoading(false); // definitely not loading anymore
                return;
            }

            try {
                const userDocRef = doc(db, "users", authenticatedUser.uid);

                // Helper: extract first/last name
                const extractName = (email: string | null) => {
                    if (!email) return { first: "Student", last: "User" };
                    const part = email.split("@")[0];
                    const pieces = part.split(/[._-]/);
                    const first = pieces[0].charAt(0).toUpperCase() + pieces[0].slice(1);
                    const last =
                        pieces.length > 1
                            ? pieces[pieces.length - 1].charAt(0).toUpperCase() + pieces[pieces.length - 1].slice(1)
                            : "User";
                    return { first, last };
                };

                const { first, last } = authenticatedUser.displayName
                    ? {
                        first: authenticatedUser.displayName.split(" ")[0],
                        last: authenticatedUser.displayName.split(" ").slice(1).join(" ") || "User",
                    }
                    : extractName(authenticatedUser.email);

                const initialProfile: UserProfile = {
                    uid: authenticatedUser.uid,
                    email: authenticatedUser.email,
                    firstName: first,
                    lastName: last,
                    bio: `Hi there! I'm ${first}, a student using UnniConnect.`,
                    avatarUrl:
                        authenticatedUser.photoURL ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${authenticatedUser.uid}`,
                    joinedAt: new Date().toISOString(),
                    instagram: "",
                    joinedGroups: [],
                };

                // Check if profile exists
                const snap = await getDoc(userDocRef);
                if (!snap.exists()) await setDoc(userDocRef, initialProfile);

                // ✅ At this point, profile exists, set it immediately
                const freshSnap = await getDoc(userDocRef);
                if (freshSnap.exists()) setProfile(freshSnap.data() as UserProfile);

                // Listen for live updates
                unsubscribeProfile = onSnapshot(
                    userDocRef,
                    (docSnap) => {
                        if (docSnap.exists()) setProfile(docSnap.data() as UserProfile);
                    },
                    (err) => console.error("Profile listener error:", err)
                );

                setLoading(false); // done loading after we have profile
            } catch (err) {
                console.error("Auth setup failed:", err);

                // Fallback: Use basic Auth data if Firestore fails (e.g. permission error)
                if (authenticatedUser) {
                    const { first, last } = authenticatedUser.displayName
                        ? {
                            first: authenticatedUser.displayName.split(" ")[0],
                            last: authenticatedUser.displayName.split(" ").slice(1).join(" ") || "User",
                        }
                        : { first: "Student", last: "User" };

                    setProfile({
                        uid: authenticatedUser.uid,
                        email: authenticatedUser.email,
                        firstName: first,
                        lastName: last,
                        bio: "Profile data unavailable (Offline or Permission Error)",
                        avatarUrl: authenticatedUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authenticatedUser.uid}`,
                        joinedAt: new Date().toISOString(),
                        instagram: "",
                        joinedGroups: [],
                    });
                }
                setLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeProfile) unsubscribeProfile();
        };
    }, []);

    const updateProfile = async (data: Partial<UserProfile>) => {
        if (!user) throw new Error("No authenticated user found");
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, data, { merge: true });
    };

    return <AuthContext.Provider value={{ user, profile, loading, updateProfile }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
