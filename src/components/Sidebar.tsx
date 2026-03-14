"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import {
    LayoutDashboard,
    BookOpen,
    ShoppingBag,
    UsersRound
} from "lucide-react";

const navItems = [
    {
        name: "Community Feed",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Course Groups",
        href: "/courses",
        icon: BookOpen,
    },
    {
        name: "Marketplace",
        href: "/marketplace",
        icon: ShoppingBag,
    },
    {
        name: "Student Council",
        href: "/council",
        icon: UsersRound,
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut(auth);
        router.push("/");
    };

    return (
        <Card className="h-fit sticky top-8 border-none shadow-sm hidden lg:block bg-card">
            <CardContent className="p-4 space-y-2">
                <div className="mb-6 px-2">
                    <h2 className="text-xl font-bold text-primary">UnniConnect</h2>
                    <p className="text-xs text-muted-foreground mt-1">Campus Life & More</p>
                </div>
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                        : "text-muted-foreground hover:bg-secondary/10 hover:text-foreground"
                                )}
                            >
                                <item.icon className={cn(
                                    "h-5 w-5",
                                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                                )} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="pt-6 mt-6 border-t border-border">
                    <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                        Help & Settings
                    </p>
                    <div className="mt-2 space-y-1">
                        <button
                            onClick={handleSignOut}
                            className="flex w-full items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
