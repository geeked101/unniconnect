import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { AuthDebug } from "@/components/AuthDebug";
import Link from "next/link";
import { LayoutDashboard, BookOpen, ShoppingBag, UsersRound } from "lucide-react";

import { AuthGuard } from "@/components/AuthGuard";

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="min-h-screen bg-background pb-20 lg:pb-0">
                <Navbar />
                <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
                        <aside className="hidden lg:block h-fit sticky top-8">
                            <Sidebar />
                        </aside>
                        <main className="min-w-0 pb-10">
                            {children}
                            <div className="mt-20 text-center text-xs text-muted-foreground">
                                <p>Created by Pluto &copy; {new Date().getFullYear()}</p>
                            </div>
                        </main>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-t border-border lg:hidden px-6 py-3">
                    <div className="flex justify-between items-center max-w-md mx-auto">
                        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                            <LayoutDashboard className="h-5 w-5" />
                            <span className="text-[10px] font-medium">Feed</span>
                        </Link>
                        <Link href="/courses" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                            <BookOpen className="h-5 w-5" />
                            <span className="text-[10px] font-medium">Courses</span>
                        </Link>
                        <Link href="/marketplace" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                            <ShoppingBag className="h-5 w-5" />
                            <span className="text-[10px] font-medium">Market</span>
                        </Link>
                        <Link href="/council" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                            <UsersRound className="h-5 w-5" />
                            <span className="text-[10px] font-medium">Council</span>
                        </Link>
                    </div>
                </div>
                <AuthDebug />
            </div>
        </AuthGuard>
    );
}

