"use client";

import Link from "next/link";
import { UserNav } from "./user-nav";
import { cn } from "@/lib/utils";

export function Navbar() {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
            <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between lg:px-8">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="lg:hidden">
                        <h2 className="text-xl font-bold text-indigo-600">UnniConnect</h2>
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <nav className="flex items-center space-x-2">
                        <UserNav />
                    </nav>
                </div>
            </div>
        </header>
    );
}
