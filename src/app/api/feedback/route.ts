import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function POST(req: Request) {
    const body = await req.json();

    try {
        await addDoc(collection(db, "feedback"), {
            subject: body.subject,
            message: body.message,
            name: body.name || "Anonymous",
            createdAt: Date.now(),
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
    }
}
