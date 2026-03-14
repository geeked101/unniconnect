"use client";

import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Bug, ChevronUp, ChevronDown, User, ShieldCheck, Mail } from "lucide-react";

export function AuthDebug() {
    const { user, profile, loading } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    if (process.env.NODE_ENV === "production") return null;

    return (
        <div className="fixed bottom-20 left-4 z-[9999] lg:bottom-4">
            <div className={`overflow-hidden rounded-xl border border-zinc-200 bg-white/80 shadow-2xl backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80 transition-all duration-300 ${isOpen ? 'w-80 h-96' : 'w-12 h-12'}`}>
                {!isOpen ? (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex h-12 w-12 items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                        title="Auth Debug"
                    >
                        <Bug className="h-5 w-5" />
                    </button>
                ) : (
                    <div className="flex h-full flex-col">
                        <div className="flex items-center justify-between border-b border-border px-4 py-3">
                            <div className="flex items-center gap-2 font-semibold text-foreground">
                                <Bug className="h-4 w-4 text-secondary" />
                                <span className="font-headline">Auth Debug</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                            >
                                <ChevronDown className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto p-4 space-y-4">
                            {/* Loading State */}
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-500">Loading State:</span>
                                <span className={`font-mono ${loading ? 'text-amber-500' : 'text-emerald-500'}`}>
                                    {loading ? 'TRUE' : 'FALSE'}
                                </span>
                            </div>

                            {/* User Object */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
                                    <User className="h-3 w-3" />
                                    <span>FIREBASE USER</span>
                                </div>
                                <div className="rounded-lg bg-background p-2">
                                    {user ? (
                                        <div className="space-y-1 text-[10px] font-mono">
                                            <div className="truncate text-foreground/70">UID: {user.uid}</div>
                                            <div className="truncate text-primary">Email: {user.email}</div>
                                        </div>
                                    ) : (
                                        <div className="text-[10px] italic text-zinc-400">Not authenticated</div>
                                    )}
                                </div>
                            </div>

                            {/* Profile Data */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
                                    <ShieldCheck className="h-3 w-3" />
                                    <span>FIRESTORE PROFILE</span>
                                </div>
                                <div className="rounded-lg bg-zinc-50 p-2 dark:bg-zinc-950/50">
                                    {profile ? (
                                        <div className="space-y-1 text-[10px] font-mono text-zinc-600 dark:text-zinc-400">
                                            <div>Name: {profile.firstName} {profile.lastName}</div>
                                            <div className="truncate">Bio: {profile.bio.substring(0, 30)}...</div>
                                            <div>Groups: {profile.joinedGroups?.length || 0}</div>
                                        </div>
                                    ) : (
                                        <div className="text-[10px] italic text-zinc-400">No profile found</div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-2 border-t border-border">
                                <button
                                    onClick={() => console.log({ user, profile, loading })}
                                    className="w-full rounded-md bg-secondary/10 px-3 py-1.5 text-[10px] font-medium text-secondary hover:bg-secondary/20"
                                >
                                    Log to Console
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
