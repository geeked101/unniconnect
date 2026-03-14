"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search, Users, MessageCircle } from "lucide-react";
import Image from "next/image";
import { CreateGroupDialog } from "@/components/create-group-dialog";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function CoursesPage() {
    const { profile, updateProfile } = useAuth();
    const { toast } = useToast();
    const [groups, setGroups] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch real-time groups from Firestore
    useEffect(() => {
        const q = query(collection(db, "courseGroups"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedGroups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setGroups(fetchedGroups);
        });
        return () => unsubscribe();
    }, []);

    const joinedGroupIds = profile?.joinedGroups || [];

    const handleJoin = async (groupId: string) => {
        if (!profile) {
            toast({ title: "Please sign in", variant: "destructive" });
            return;
        }

        if (joinedGroupIds.includes(groupId)) return;

        try {
            // Add groupId to user's profile
            await updateProfile({
                joinedGroups: [...joinedGroupIds, groupId]
            });

            // Increment members count in the group
            const groupRef = doc(db, "courseGroups", groupId);
            await updateDoc(groupRef, { members: increment(1) });

            toast({ title: "Joined Group!", description: "You are now a member." });
        } catch (error) {
            console.error("Join failed", error);
            toast({ title: "Failed to join", variant: "destructive" });
        }
    };

    // Filter logic
    const filteredGroups = groups.filter(g =>
        g.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const joinedGroups = filteredGroups.filter(g => joinedGroupIds.includes(g.id));
    const availableGroups = filteredGroups.filter(g => !joinedGroupIds.includes(g.id));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-3xl font-bold font-headline">Course Groups</h1>
                <div className="flex w-full sm:w-auto items-center gap-2">
                    <div className="relative flex-1 sm:flex-initial">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search courses..."
                            className="pl-8 sm:w-64 bg-card border-border"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <CreateGroupDialog />
            </div>

            <Tabs defaultValue="available" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-8">
                    <TabsTrigger value="available">Available Groups</TabsTrigger>
                    <TabsTrigger value="joined">Joined Groups ({joinedGroups.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="available">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {availableGroups.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-muted-foreground">
                                No available groups found matching your search.
                            </div>
                        ) : (
                            availableGroups.map((group) => (
                                <GroupCard key={group.id} group={group} onJoin={() => handleJoin(group.id)} />
                            ))
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="joined">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {joinedGroups.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-muted-foreground">
                                You haven&apos;t joined any groups yet.
                            </div>
                        ) : (
                            joinedGroups.map((group) => (
                                <GroupCard key={group.id} group={group} isJoined />
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function GroupCard({ group, isJoined, onJoin }: { group: any, isJoined?: boolean, onJoin?: () => void }) {
    return (
        <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-none bg-card">
            <div className="relative h-40 w-full group">
                <Image
                    src={group.imageUrl || "https://placehold.co/600x400?text=Course"}
                    alt={group.courseName}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-4 text-white">
                    <p className="font-bold text-lg">{group.courseCode}</p>
                </div>
            </div>
            <CardHeader>
                <CardTitle className="line-clamp-1">{group.courseName}</CardTitle>
                <CardDescription className="line-clamp-2">{group.description || "No description provided."}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2 text-secondary" />
                    <span>{group.members || 0} members</span>
                </div>
            </CardContent>
            <CardFooter>
                {isJoined ? (
                    <Button className="w-full bg-green-700 hover:bg-green-800 text-white" asChild>
                        <Link href={`/courses/chat/${group.id}`}>
                            <MessageCircle className="mr-2 h-4 w-4" /> Open Chat
                        </Link>
                    </Button>
                ) : (
                    <Button
                        className="w-full"
                        onClick={onJoin}
                    >
                        Join Group
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
