"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
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

    return (
        <Card className="h-fit sticky top-8 border-none shadow-sm hidden lg:block">
            <CardContent className="p-4 space-y-2">
                <div className="mb-6 px-2">
                    <h2 className="text-xl font-bold text-indigo-600">UnniConnect</h2>
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
                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                                )}
                            >
                                <item.icon className={cn(
                                    "h-5 w-5",
                                    isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-900"
                                )} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="pt-6 mt-6 border-t border-zinc-100">
                    <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        Help & Settings
                    </p>
                    <div className="mt-2 space-y-1">
                        <button className="flex w-full items-center gap-3 px-3 py-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
                            Sign Out
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
