"use client";

import { useAuth } from "@/hooks/use-auth";

export function AuthDebug() {
    const { user, profile, loading } = useAuth();

    return (
        <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-xs z-50">
            <h3 className="font-bold mb-2">Auth Debug</h3>
            <p><strong>Loading:</strong> {loading ? "Yes" : "No"}</p>
            <p><strong>User:</strong> {user ? user.email : "null"}</p>
            <p><strong>UID:</strong> {user?.uid || "none"}</p>
            <p><strong>Profile:</strong> {profile ? "exists" : "null"}</p>
            {profile && (
                <>
                    <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                </>
            )}
        </div>
    );
}
