"use client";

import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { Loader2, Pencil, MapPin, Mail, Calendar, BookOpen } from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
    const { profile, loading } = useAuth();

    if (loading) return <ProfileSkeleton />;

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <p className="text-zinc-500 font-medium">Please sign in to view your profile.</p>
                <Button asChild>
                    <Link href="/login">Sign In</Link>
                </Button>
            </div>
        );
    }

    const joinedDate = profile.joinedAt
        ? new Date(profile.joinedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
        : "Recent";

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* 1. Header Section */}
            <div className="relative">
                <div className="h-48 w-full rounded-3xl bg-gradient-to-r from-cocoa via-caramel to-gold shadow-lg overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                </div>

                <div className="absolute -bottom-12 left-8 flex items-end gap-6">
                    <div className="p-1.5 bg-background rounded-full shadow-2xl">
                        <Avatar className="h-32 w-32 border-4 border-background">
                            <AvatarImage src={profile.avatarUrl} alt="Profile Picture" />
                            <AvatarFallback className="text-2xl bg-secondary/10 text-secondary">
                                {profile.firstName[0]}{profile.lastName?.[0] || ""}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                <div className="absolute -bottom-10 right-8">
                    <Button variant="outline" className="rounded-xl shadow-sm bg-card/80 backdrop-blur-sm" asChild>
                        <Link href="/settings">
                            <Pencil className="mr-2 h-4 w-4" /> Edit Profile
                        </Link>
                    </Button>
                </div>
            </div>

            {/* 2. Main Content Grid */}
            <div className="pt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <SidebarCard profile={profile} joinedDate={joinedDate} />
                    <AcademicStatsCard />
                </div>

                {/* Right Column: Tabs */}
                <div className="lg:col-span-2">
                    <ProfileTabs profile={profile} />
                </div>
            </div>
        </div>
    );
}

// --- Sub-Components ---

function SidebarCard({ profile, joinedDate }: { profile: any; joinedDate: string }) {
    return (
        <Card className="border-none shadow-sm bg-card">
            <CardContent className="p-6 space-y-4">
                <div>
                    <h1 className="text-2xl font-bold font-headline text-foreground">{profile.firstName} {profile.lastName}</h1>
                    <p className="text-sm text-muted-foreground">@{profile.email?.split('@')[0]}</p>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                    {profile.bio || "No bio added yet."}
                </p>
                <div className="space-y-3 pt-4 border-t border-border">
                    <InfoRow icon={<MapPin className="text-secondary" />} text="Engineering Building, Room 402" />
                    <InfoRow icon={<Mail className="text-secondary" />} text={profile.email} />
                    <InfoRow icon={<Calendar className="text-secondary" />} text={`Joined ${joinedDate}`} />
                </div>
            </CardContent>
        </Card>
    );
}

function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex items-center text-sm text-zinc-500">
            <span className="mr-2 h-4 w-4">{icon}</span>
            <span>{text}</span>
        </div>
    );
}

function AcademicStatsCard() {
    return (
        <Card className="border-none shadow-sm bg-secondary/10">
            <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2 font-headline">
                    <BookOpen className="h-4 w-4 text-secondary" /> Academic Progress
                </h3>
                <div className="space-y-4">
                    <ProgressBar label="Credits Completed" value={75} />
                    <ProgressBar label="GPA" value={92} customValue="3.8 / 4.0" />
                </div>
            </CardContent>
        </Card>
    );
}

function ProgressBar({ label, value, customValue }: { label: string; value: number; customValue?: string }) {
    return (
        <div>
            <div className="flex justify-between text-xs font-medium mb-1.5 text-foreground/70">
                <span>{label}</span>
                <span>{customValue || `${value}%`}</span>
            </div>
            <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}

function ProfileTabs({ profile }: { profile: any }) {
    return (
        <Tabs defaultValue="posts" className="w-full">
            <TabsList className="bg-card p-1 rounded-xl shadow-sm border border-border">
                <TabsTrigger value="posts" className="px-6">Posts</TabsTrigger>
                <TabsTrigger value="courses" className="px-6">Courses</TabsTrigger>
                <TabsTrigger value="files" className="px-6">Files</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="pt-6">
                {/* Post content here */}
                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={profile.avatarUrl} />
                                <AvatarFallback>{profile.firstName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-semibold">{profile.firstName} {profile.lastName}</p>
                                <p className="text-xs text-muted-foreground">2 hours ago</p>
                            </div>
                        </div>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300">
                            Just finished the Advanced Algorithms course! 🚀
                        </p>
                    </CardContent>
                </Card>
            </TabsContent>
            {/* ... other tab contents ... */}
        </Tabs>
    );
}

function ProfileSkeleton() {
    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <Skeleton className="h-48 w-full rounded-3xl" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
                <div className="space-y-6">
                    <Skeleton className="h-64 w-full rounded-2xl" />
                    <Skeleton className="h-32 w-full rounded-2xl" />
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-12 w-full rounded-xl" />
                    <Skeleton className="h-96 w-full rounded-2xl" />
                </div>
            </div>
        </div>
    );
}