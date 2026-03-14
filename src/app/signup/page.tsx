"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            // Validation removed for general use/testing. Uncomment if needed.
            // if (!email.toLowerCase().endsWith("@university.edu")) {
            //     throw new Error("Please use your official university email.");
            // }

            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCred.user;

            // Set the display name in Firebase Auth
            await updateProfile(user, {
                displayName: `${firstName} ${lastName}`
            });

            // Create the Firestore document immediately with the provided names
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: email,
                firstName: firstName,
                lastName: lastName,
                bio: `Hi there! I'm ${firstName}`,
                avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
                joinedAt: new Date().toISOString(),
            });

            await sendEmailVerification(user);

            setSuccess("Account created! Please check your email inbox to verify your account before logging in.");
            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");

            // Sign out immediately so they have to verify first
            await auth.signOut();

        } catch (err: any) {
            setError(err.message || "Failed to create account.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        setIsLoading(true);
        try {
            await signInWithPopup(auth, googleProvider);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Failed to sign up with Google.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-background font-sans">
            {/* Left Side: Illustration or Design */}
            <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12 overflow-hidden relative">
                <div className="absolute top-0 -right-4 w-96 h-96 bg-caramel rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

                <div className="relative z-10 text-primary-foreground max-w-lg">
                    <h2 className="text-4xl font-bold leading-tight mb-6 font-headline">Join Your Campus Digital Square.</h2>
                    <p className="text-primary-foreground/80 text-lg mb-8">
                        The easiest way to stay in the loop with what's happening at your university.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">🎓</div>
                            <div>
                                <h4 className="font-semibold text-white font-headline">Verified Students Only</h4>
                                <p className="text-white/70 text-sm">Its a campus connect for students.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
                <div className="w-full max-w-md">
                    <div className="mb-10 text-center lg:text-left">
                        <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:bg-primary/90 transition-colors">
                                <span className="text-primary-foreground font-bold">U</span>
                            </div>
                            <span className="text-xl font-bold text-foreground font-headline">UnniConnect</span>
                        </Link>
                        <h1 className="text-3xl font-bold text-foreground mb-2 font-headline">Create Account</h1>
                        <p className="text-muted-foreground">Join UnniConnect with your student email.</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSignup}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="firstName">
                                    First Name
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                                    placeholder="John"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="lastName">
                                    Last Name
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                                    placeholder="Doe"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="email">
                                University Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                                placeholder="name@mnu.ac.ke"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="password">
                                Create Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                minLength={6}
                                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-300 text-sm">
                                {success}
                                <div className="mt-2">
                                    <Link href="/login" className="font-bold underline">Go to Login</Link>
                                </div>
                            </div>
                        )}

                        {!success && (
                            <div className="space-y-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : "Create Account"}
                                </button>

                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-border"></span>
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-muted-foreground">Or join with</span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border border-border bg-card text-foreground hover:bg-background transition-all active:scale-95 disabled:opacity-50"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    <span className="font-semibold">Google Account</span>
                                </button>
                            </div>
                        )}

                        <div className="text-center mt-6">
                            <p className="text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link href="/login" className="font-semibold text-primary hover:text-primary/80">Sign In</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
