"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

export default function SignUpForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!email.endsWith(".edu")) {
                alert("Please use a .edu email address.");
                return;
            }
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(userCred.user);
            alert("Account created! Check your email for verification.");
            await auth.signOut();
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <form onSubmit={handleSignup} className="space-y-4">
            <h2 className="text-xl font-bold">Sign Up</h2>

            <input
                type="email"
                placeholder="Uni Email (.edu)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border p-2 w-full text-black"
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border p-2 w-full text-black"
            />

            <button type="submit" className="bg-black text-white px-4 py-2">
                Sign Up
            </button>
        </form>
    );
}
