"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Send, Paperclip } from "lucide-react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

type PostType = "text" | "image" | "audio" | "document";

interface FeedItem {
    content: string;
    type: PostType;
    attachmentUrl?: string;
    anonymous: boolean;
}

const uploadToFirebase = async (file: File) => {
    const storage = getStorage();
    const fileRef = ref(storage, `posts/${Date.now()}-${file.name}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
};

export default function PostForm({
    onPostAction,
}: {
    onPostAction: (data: Partial<FeedItem>) => void;
}) {
    const [content, setContent] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [postType, setPostType] = useState<PostType>("text");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const { toast } = useToast();

    const handleFileSelect = (selected: File) => {
        setFile(selected);
        const url = URL.createObjectURL(selected);
        setPreviewUrl(url);

        if (selected.type.startsWith("image/")) setPostType("image");
        else if (selected.type.startsWith("audio/")) setPostType("audio");
        else setPostType("document");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) handleFileSelect(selected);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const dropped = e.dataTransfer.files?.[0];
        if (dropped) handleFileSelect(dropped);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && !file) return;

        let uploadedUrl = "";

        if (file) {
            uploadedUrl = await uploadToFirebase(file);
        }

        onPostAction({
            content,
            type: file ? postType : "text",
            attachmentUrl: uploadedUrl,
            anonymous: isAnonymous,
        });

        toast({ title: "Post sent 🚀" });

        setContent("");
        setFile(null);
        setPreviewUrl(null);
        setPostType("text");
    };

    return (
        <Card className="border-2 border-primary/10">
            <CardContent className="p-4 space-y-3">
                <form onSubmit={handleSubmit} className="space-y-3">
                    <Textarea
                        placeholder="What's happening on campus?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[80px]"
                    />

                    {previewUrl && postType === "image" && (
                        <img src={previewUrl} className="rounded-lg max-h-64 object-cover" />
                    )}

                    {previewUrl && postType === "audio" && (
                        <audio controls src={previewUrl} className="w-full" />
                    )}

                    {previewUrl && postType === "document" && (
                        <p className="text-xs text-muted-foreground">
                            Attached: {file?.name}
                        </p>
                    )}

                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        className="flex items-center justify-between gap-3 border-t pt-3"
                    >
                        <div className="flex items-center gap-3">
                            <label className="cursor-pointer">
                                <Paperclip className="h-5 w-5 text-muted-foreground hover:text-primary" />
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*,audio/*,video/*,.pdf,.doc,.docx"
                                    onChange={handleInputChange}
                                />
                            </label>

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="anon"
                                    checked={isAnonymous}
                                    onCheckedChange={(c) => setIsAnonymous(!!c)}
                                />
                                <label htmlFor="anon" className="text-sm">
                                    Anonymous
                                </label>
                            </div>
                        </div>

                        <Button type="submit" size="sm">
                            <Send className="mr-2 h-4 w-4" /> Post
                        </Button>
                    </div>

                    <p className="text-[10px] text-muted-foreground text-center">
                        Drag & drop files or tap 📎
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
