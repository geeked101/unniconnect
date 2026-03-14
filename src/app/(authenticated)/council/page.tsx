import Link from "next/link";
import { getAnnouncements, getSurveys } from "@/lib/council";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeedbackForm from "./feedback-form";

export const dynamic = "force-dynamic";

export default async function CouncilPage() {
    const announcements = await getAnnouncements();
    const surveys = await getSurveys();

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold font-headline text-primary">Student Council Hub</h1>

            <Tabs defaultValue="announcements" className="w-full">
                <TabsList className="grid w-full grid-cols-3 md:w-[400px] bg-card border border-border">
                    <TabsTrigger value="announcements">Announcements</TabsTrigger>
                    <TabsTrigger value="surveys">Surveys</TabsTrigger>
                    <TabsTrigger value="feedback">Feedback</TabsTrigger>
                </TabsList>

                <TabsContent value="announcements" className="mt-6">
                    <div className="space-y-4">
                        {announcements.map((announcement: any) => (
                            <Card key={announcement.id} className="bg-card border-none shadow-sm">
                                <CardHeader>
                                    <CardTitle className="font-headline text-foreground">{announcement.title}</CardTitle>
                                    <CardDescription className="text-muted-foreground">{announcement.date}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-foreground/80">{announcement.summary}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="surveys" className="mt-6">
                    <div className="space-y-6">
                        {surveys.map((survey: any) => (
                            <Card key={survey.id} className="bg-card border-none shadow-sm">
                                <CardHeader>
                                    <CardTitle className="font-headline text-foreground">{survey.title}</CardTitle>
                                    <CardDescription className="text-muted-foreground">{survey.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Progress value={(survey.participants / survey.total) * 100} className="h-2 bg-background" />
                                    <p className="text-xs text-muted-foreground">
                                        {survey.participants.toLocaleString()} / {survey.total.toLocaleString()} participants
                                    </p>
                                </CardContent>
                                <CardContent>
                                    <Link href={`/council/surveys/${survey.id}`}>
                                        <Button className="w-full sm:w-auto">
                                            Take Survey
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="feedback" className="mt-6">
                    <FeedbackForm />
                </TabsContent>
            </Tabs>
        </div>
    );
}
