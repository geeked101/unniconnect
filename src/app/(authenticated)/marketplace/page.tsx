"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { PlusCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from 'swiper/modules';

import { marketplaceItems } from "@/lib/placeholder-data";

interface MarketplaceItemType {
    id: string;
    name: string;
    price: number;
    description: string;
    seller: string;
    imageUrls: string[];
}

interface LostItemType {
    id: string;
    title: string;
    description: string;
    uploader: string;
    imageUrls: string[];
}

export default function MarketplacePage() {
    const { toast } = useToast();
    const { profile } = useAuth();

    // State
    const [items, setItems] = useState<MarketplaceItemType[]>([]);
    const [lostItems, setLostItems] = useState<LostItemType[]>([]);
    const [sellOpen, setSellOpen] = useState(false);
    const [lostOpen, setLostOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [sellForm, setSellForm] = useState({ name: "", price: "", description: "" });
    const [sellImages, setSellImages] = useState<File[]>([]);
    const [sellPreviews, setSellPreviews] = useState<string[]>([]);

    const [lostForm, setLostForm] = useState({ title: "", description: "" });
    const [lostImages, setLostImages] = useState<File[]>([]);
    const [lostPreviews, setLostPreviews] = useState<string[]>([]);

    const [currentSeller, setCurrentSeller] = useState<{ seller: string; item: MarketplaceItemType } | null>(null);
    const [buyMessage, setBuyMessage] = useState("");
    const [currentUploader, setCurrentUploader] = useState<string | null>(null);
    const [lostMessage, setLostMessage] = useState("");

    // Fetch marketplace items
    useEffect(() => {
        const fetchMarketplaceItems = async () => {
            try {
                const q = query(collection(db, "marketplaceItems"), orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);
                const fetchedItems = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as MarketplaceItemType));

                const placeholders: MarketplaceItemType[] = marketplaceItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    description: "Excellent condition.",
                    seller: item.seller,
                    imageUrls: [`https://placehold.co/600x400?text=${item.name.replace(/ /g, '+')}`]
                }));

                setItems([...fetchedItems, ...placeholders]);
            } catch (e) {
                console.error("Error fetching market items", e);
            }
        };
        fetchMarketplaceItems();
    }, []);

    // Fetch lost items
    useEffect(() => {
        const fetchLostItems = async () => {
            try {
                const q = query(collection(db, "lostItems"), orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);
                const fetchedLost = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as LostItemType));
                setLostItems(fetchedLost);
            } catch (e) {
                console.error("Error fetching lost items", e);
            }
        };
        fetchLostItems();
    }, []);

    // --- Handlers ---
    const handleSellImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const filesArray = Array.from(e.target.files).slice(0, 3);
        setSellImages(filesArray);
        setSellPreviews(filesArray.map(file => URL.createObjectURL(file)));
    };

    const handleLostImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const filesArray = Array.from(e.target.files).slice(0, 3);
        setLostImages(filesArray);
        setLostPreviews(filesArray.map(file => URL.createObjectURL(file)));
    };

    const handleMarketplaceSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) {
            toast({ title: "Authentication required", description: "Please log in to list items.", variant: "destructive" });
            return;
        }
        if (!sellForm.name || !sellForm.price || !sellForm.description || sellImages.length === 0) {
            toast({ title: "Missing fields", description: "Please fill all fields and add an image.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            const imageUrls: string[] = [];
            for (const file of sellImages) {
                const imageRef = ref(storage, `marketplace/${Date.now()}_${file.name}`);
                const snapshot = await uploadBytes(imageRef, file);
                imageUrls.push(await getDownloadURL(snapshot.ref));
            }

            const newItem = {
                name: sellForm.name,
                price: parseFloat(sellForm.price),
                description: sellForm.description,
                seller: `${profile.firstName} ${profile.lastName}`,
                imageUrls,
                createdAt: Date.now(),
            };

            const docRef = await addDoc(collection(db, "marketplaceItems"), newItem);
            setItems([{ id: docRef.id, ...newItem }, ...items]);

            // Reset form & previews
            setSellForm({ name: "", price: "", description: "" });
            setSellImages([]);
            setSellPreviews([]);
            setSellOpen(false);

            toast({ title: "Item Listed!", description: "Your item is now on the marketplace." });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to list item.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) {
            toast({ title: "Authentication required", description: "Please log in to report items.", variant: "destructive" });
            return;
        }
        if (!lostForm.title || !lostForm.description || lostImages.length === 0) {
            toast({ title: "Missing fields", description: "Please fill all fields and add an image.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            const imageUrls: string[] = [];
            for (const file of lostImages) {
                const imageRef = ref(storage, `lost/${Date.now()}_${file.name}`);
                const snapshot = await uploadBytes(imageRef, file);
                imageUrls.push(await getDownloadURL(snapshot.ref));
            }

            const newItem = {
                title: lostForm.title,
                description: lostForm.description,
                uploader: `${profile.firstName} ${profile.lastName}`,
                imageUrls,
                createdAt: Date.now(),
            };

            const docRef = await addDoc(collection(db, "lostItems"), newItem);
            setLostItems([{ id: docRef.id, ...newItem }, ...lostItems]);

            setLostForm({ title: "", description: "" });
            setLostImages([]);
            setLostPreviews([]);
            setLostOpen(false);

            toast({ title: "Item Posted", description: "Lost item has been posted." });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to post item.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Header + Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-3xl font-bold font-headline">Student Marketplace</h1>
                <div className="flex gap-2 w-full sm:w-auto">
                    {/* Sell Item Modal */}
                    <Dialog open={sellOpen} onOpenChange={setSellOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20">
                                <PlusCircle className="mr-2 h-4 w-4" /> Sell Item
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Sell Your Item</DialogTitle>
                            </DialogHeader>
                            <form className="flex flex-col gap-4 py-4" onSubmit={handleMarketplaceSubmit}>
                                <Input placeholder="Item Name" value={sellForm.name} onChange={e => setSellForm({ ...sellForm, name: e.target.value })} className="bg-background border-border" />
                                <Input type="number" placeholder="Price (KSH)" value={sellForm.price} onChange={e => setSellForm({ ...sellForm, price: e.target.value })} className="bg-background border-border" />
                                <Textarea placeholder="Description" value={sellForm.description} onChange={e => setSellForm({ ...sellForm, description: e.target.value })} className="bg-background border-border" />

                                {/* File Input */}
                                <div>
                                    <span className="text-sm font-medium">Images (Max 3)</span>
                                    <Input type="file" multiple accept="image/*" onChange={handleSellImageChange} className="mt-1 bg-background border-border" />
                                    <div className="flex gap-2 mt-2">
                                        {sellPreviews.map((src, idx) => (
                                            <img key={idx} src={src} alt={`Preview ${idx}`} className="h-20 w-20 object-cover rounded border" />
                                        ))}
                                    </div>
                                </div>

                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {isSubmitting ? "Listing..." : "List Item"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Lost & Found Button */}
                    <Button variant="secondary" asChild className="flex-1 sm:flex-none">
                        <a href="#lostFound">Lost & Found</a>
                    </Button>
                </div>
            </div>

            {/* Marketplace Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map(item => (
                    <Card key={item.id} className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col relative group border-none bg-card">
                        <div className="relative aspect-[4/3] w-full bg-zinc-100 dark:bg-zinc-800">
                            <Swiper navigation modules={[Navigation]} className="h-full w-full">
                                {item.imageUrls.map((url, idx) => (
                                    <SwiperSlide key={idx}>
                                        <div className="relative h-full w-full">
                                            <Image src={url} alt={item.name} fill className="object-cover" />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                        <CardHeader className="flex-grow p-4">
                            <div className="flex justify-between items-start mb-2">
                                <CardTitle className="text-base font-semibold line-clamp-1 text-foreground">{item.name}</CardTitle>
                                <span className="font-bold text-secondary">{item.price.toLocaleString()}</span>
                            </div>
                            <CardDescription className="line-clamp-2 text-muted-foreground">{item.description}</CardDescription>
                            <Button className="mt-4 w-full" variant="outline" onClick={() => setCurrentSeller({ seller: item.seller, item })}>
                                Buy Item
                            </Button>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            {/* Lost & Found Section */}
            <section id="lostFound" className="pt-12 border-t border-border px-1">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                    <h2 className="text-2xl font-bold font-headline text-foreground">Lost & Found</h2>

                    {/* Lost Modal */}
                    <Dialog open={lostOpen} onOpenChange={setLostOpen}>
                        <DialogTrigger asChild>
                            <Button variant="destructive" className="flex-1 sm:flex-none">
                                <PlusCircle className="mr-2 h-4 w-4" /> Report Lost Item
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle className="font-headline">Report Lost Item</DialogTitle>
                            </DialogHeader>
                            <form className="flex flex-col gap-4 py-4" onSubmit={handleLostSubmit}>
                                <Input placeholder="What did you lose?" value={lostForm.title} onChange={e => setLostForm({ ...lostForm, title: e.target.value })} className="bg-background border-border" />
                                <Textarea placeholder="Description (Where/When)" value={lostForm.description} onChange={e => setLostForm({ ...lostForm, description: e.target.value })} className="bg-background border-border" />

                                <div>
                                    <span className="text-sm font-medium">Images</span>
                                    <Input type="file" multiple accept="image/*" onChange={handleLostImageChange} className="mt-1 bg-background border-border" />
                                    <div className="flex gap-2 mt-2">
                                        {lostPreviews.map((src, idx) => (
                                            <img key={idx} src={src} alt={`Preview ${idx}`} className="h-20 w-20 object-cover rounded border" />
                                        ))}
                                    </div>
                                </div>

                                <Button type="submit" variant="destructive" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {isSubmitting ? "Posting..." : "Post Alert"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Lost Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {lostItems.map(lost => (
                        <Card key={lost.id} className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col relative group border-none bg-accent/10">
                            <div className="relative aspect-[4/3] w-full bg-zinc-100 dark:bg-zinc-800">
                                <Swiper navigation modules={[Navigation]} className="h-full w-full">
                                    {lost.imageUrls.map((url, idx) => (
                                        <SwiperSlide key={idx}>
                                            <div className="relative h-full w-full">
                                                <Image src={url} alt={lost.title} fill className="object-cover" />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                            <CardHeader className="flex-grow p-4">
                                <CardTitle className="text-base font-bold line-clamp-1 text-accent font-headline">{lost.title}</CardTitle>
                                <CardDescription className="line-clamp-2">{lost.description}</CardDescription>
                                <Button className="mt-4 w-full" variant="outline" onClick={() => setCurrentUploader(lost.uploader)}>
                                    Help / Message
                                </Button>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Messaging Modals */}
            {/* Buy Item Modal */}
            <Dialog open={!!currentSeller} onOpenChange={() => setCurrentSeller(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Message Seller</DialogTitle>
                    </DialogHeader>
                    <form className="flex flex-col gap-4" onSubmit={(e) => {
                        e.preventDefault();
                        toast({ title: "Message Sent", description: `Message sent to ${currentSeller?.seller}.` });
                        setBuyMessage("");
                        setCurrentSeller(null);
                    }}>
                        {currentSeller && (
                                <div className="flex gap-2 items-center border border-border p-2 rounded bg-background">
                                    <div className="relative w-12 h-12">
                                        <Image src={currentSeller.item.imageUrls[0]} alt={currentSeller.item.name} fill className="object-cover rounded" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-foreground">{currentSeller.item.name}</span>
                                        <span className="text-sm font-bold text-secondary">{currentSeller.item.price.toLocaleString()} KSH</span>
                                    </div>
                                </div>
                        )}
                        <textarea placeholder="Write your message..." value={buyMessage} onChange={e => setBuyMessage(e.target.value)} className="textarea" />
                        <Button type="submit">Send Message</Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Lost Item Modal */}
            <Dialog open={!!currentUploader} onOpenChange={() => setCurrentUploader(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Message Uploader</DialogTitle>
                    </DialogHeader>
                    <form className="flex flex-col gap-4" onSubmit={(e) => {
                        e.preventDefault();
                        toast({ title: "Message Sent", description: "The uploader has been notified." });
                        setLostMessage("");
                        setCurrentUploader(null);
                    }}>
                        <Textarea placeholder="I found this item..." value={lostMessage} onChange={e => setLostMessage(e.target.value)} className="bg-background border-border" />
                        <Button type="submit" className="bg-primary text-primary-foreground">Send Message</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
