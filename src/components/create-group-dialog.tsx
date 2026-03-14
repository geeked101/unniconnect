"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Loader2, Image as ImageIcon } from "lucide-react"
import { useState, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { db, storage } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

export function CreateGroupDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const { profile } = useAuth()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [formData, setFormData] = useState({
        code: "",
        name: "",
        description: ""
    })
    const [imageFile, setImageFile] = useState<File | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            let imageUrl = "https://placehold.co/600x400?text=Course+Group"; // Default

            if (imageFile) {
                const storageRef = ref(storage, `groups/${Date.now()}_${imageFile.name}`);
                const snapshot = await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(snapshot.ref);
            }

            if (!profile) {
                toast({
                    title: "Authentication required",
                    description: "Please log in to create a group.",
                    variant: "destructive"
                });
                setLoading(false);
                return;
            }

            await addDoc(collection(db, "courseGroups"), {
                courseCode: formData.code,
                courseName: formData.name,
                description: formData.description,
                imageUrl,
                members: 1,
                createdBy: `${profile.firstName} ${profile.lastName}`,
                createdById: profile.uid,
                createdAt: Date.now()
            });

            toast({
                title: "Group created",
                description: "Your study group has been created successfully.",
            })
            setOpen(false)
            setFormData({ code: "", name: "", description: "" })
            setImageFile(null)

        } catch (error) {
            console.error("Error creating group:", error)
            toast({
                title: "Error",
                description: "Failed to create group. Please try again.",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Group
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Course Group</DialogTitle>
                    <DialogDescription>
                        Create a new group for a course. Invite students to join.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="code" className="text-right">
                                Code
                            </Label>
                            <Input
                                id="code"
                                placeholder="CS101"
                                className="col-span-3"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                placeholder="Intro to CS"
                                className="col-span-3"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Discuss course materials..."
                                className="col-span-3"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Image</Label>
                            <div className="col-span-3 flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <ImageIcon className="mr-2 h-4 w-4" />
                                    {imageFile ? "Change Image" : "Choose Image"}
                                </Button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                {imageFile && <span className="text-xs text-muted-foreground truncate max-w-[150px]">{imageFile.name}</span>}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? "Creating..." : "Create Group"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
