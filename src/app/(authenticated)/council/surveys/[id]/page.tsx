import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default async function SurveyPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const ref = doc(db, "surveys", id);
    const snap = await getDoc(ref);
    const survey = snap.data();

    if (!survey) {
        return <div className="p-8 text-center">Survey not found</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">{survey.title}</h1>
            <p className="text-muted-foreground">{survey.description}</p>
            {/* Add questions later */}
        </div>
    );
}
