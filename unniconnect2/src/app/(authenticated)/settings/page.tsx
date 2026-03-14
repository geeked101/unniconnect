"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Loader2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function SettingsPage() {
    const { profile, updateProfile, loading } = useAuth();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        bio: "",
        instagram: ""
    });
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        if (profile) {
            setFormData({
                firstName: profile.firstName || "",
                lastName: profile.lastName || "",
                email: profile.email || "",
                bio: profile.bio || "",
                instagram: profile.instagram || ""
            });
        }
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0] || !profile) return;

        const file = e.target.files[0];
        const fileSizeInMB = file.size / (1024 * 1024);

        if (fileSizeInMB > 5) {
            toast({
                title: "File too large",
                description: "Please upload an image smaller than 5MB.",
                variant: "destructive"
            });
            return;
        }

        try {
            setUploadingImage(true);
            const storageRef = ref(storage, `avatars/${profile.uid}_${Date.now()}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            await updateProfile({ avatarUrl: downloadURL });
            toast({
                title: "Profile picture updated",
                description: "Your new avatar looks great!",
            });
        } catch (error) {
            console.error("Image upload failed", error);
            toast({
                title: "Upload failed",
                description: "Could not upload image. Please try again.",
                variant: "destructive"
            });
        } finally {
            setUploadingImage(false);
        }
    };

    async function handleSave() {
        try {
            setSaving(true);
            await updateProfile({
                firstName: formData.firstName,
                lastName: formData.lastName,
                bio: formData.bio,
                instagram: formData.instagram,
                email: formData.email
            });
            toast({
                title: "Profile updated",
                description: "Your changes have been saved successfully.",
            });
        } catch (error) {
            console.error("Failed to update profile", error);
            toast({
                title: "Error",
                description: "Failed to save changes. Please try again.",
                variant: "destructive"
            });
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>;
    if (!profile) return <div className="text-center py-20">Please sign in to view this page.</div>;

    return (
        <Card className="max-w-xl mx-auto mt-8 border-none shadow-none sm:border sm:border-border sm:shadow-sm bg-card">
            <CardHeader>
                <CardTitle className="text-2xl font-bold font-headline text-foreground">Edit Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <Avatar className="h-28 w-28 border-4 border-background shadow-lg ring-2 ring-border">
                            <AvatarImage src={profile.avatarUrl} className="object-cover" />
                            <AvatarFallback className="bg-secondary/10 text-secondary">{profile.firstName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="text-white h-8 w-8" />
                        </div>
                        {uploadingImage && (
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center z-10">
                                <Loader2 className="text-white h-8 w-8 animate-spin" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage}>
                            {uploadingImage ? "Uploading..." : "Change Profile Photo"}
                        </Button>
                        <p className="text-[10px] text-muted-foreground">JPG, PNG or GIF. Max 5MB.</p>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-foreground/80">First Name</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="bg-background border-border"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-foreground/80">Last Name</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="bg-background border-border"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-foreground/80">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="student@university.edu"
                            className="bg-background border-border"
                        />
                        <p className="text-[10px] text-muted-foreground">
                            Note: Changing this only updates your public profile email.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="instagram" className="text-foreground/80">Instagram Handle</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">@</span>
                            <Input
                                id="instagram"
                                name="instagram"
                                value={formData.instagram?.replace('@', '')}
                                onChange={handleChange}
                                placeholder="username"
                                className="pl-7 bg-background border-border"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio" className="text-foreground/80">Bio</Label>
                        <Textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell everyone a bit about yourself..."
                            rows={4}
                            className="resize-none bg-background border-border"
                        />
                    </div>
                </div>

                <Button
                    className="w-full bg-primary font-semibold h-11"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {saving ? "Saving Changes..." : "Save Changes"}
                </Button>
            </CardContent>
        </Card>
    );
}