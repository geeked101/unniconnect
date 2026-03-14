"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Send } from "lucide-react";

export default function ChatPage() {
    const params = useParams();
    const groupId = params?.groupId as string;
    const { profile } = useAuth();
    const { toast } = useToast();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        if (!groupId) return;
        const q = query(collection(db, "courseGroups", groupId, "messages"), orderBy("createdAt", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(fetched);
        });
        return () => unsubscribe();
    }, [groupId]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;
        if (!profile) {
            toast({ title: "Sign in required", variant: "destructive" });
            return;
        }

        try {
            await addDoc(collection(db, "courseGroups", groupId, "messages"), {
                text: newMessage,
                senderId: profile.uid,
                senderName: `${profile.firstName} ${profile.lastName}`,
                createdAt: Date.now(),
            });
            setNewMessage("");
        } catch (err) {
            console.error("Failed to send message", err);
            toast({ title: "Failed to send", variant: "destructive" });
        }
    };

    return (
        <div className="flex flex-col h-[80vh] w-full max-w-3xl mx-auto space-y-4 p-4">
            <h1 className="text-2xl font-bold font-headline text-foreground">Group Chat</h1>

            <div className="flex flex-col flex-grow overflow-y-auto space-y-2">
                {messages.length === 0 && (
                    <p className="text-center text-muted-foreground mt-4">No messages yet. Say hi! 👋</p>
                )}
                {messages.map(msg => (
                    <Card key={msg.id} className={`self-start max-w-[70%] border-none ${msg.senderId === profile?.uid ? "bg-primary text-primary-foreground self-end" : "bg-card text-foreground"}`}>
                        <CardContent className="py-2 px-3">
                            <p className="text-sm font-semibold">{msg.senderName}</p>
                            <p className="mt-1 text-sm">{msg.text}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex gap-2">
                <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSend()}
                />
                <Button onClick={handleSend}>
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
