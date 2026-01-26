"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { councilAnnouncements, councilSurveys, CouncilAnnouncement, CouncilSurvey } from "@/lib/placeholder-data";
import { useToast } from "@/hooks/use-toast";

export default function CouncilPage() {
    const { toast } = useToast();

    const handleFeedbackSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Feedback Submitted",
            description: "Thank you for your feedback! The student council will review it.",
        });
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold font-headline">Student Council Hub</h1>
            <Tabs defaultValue="announcements" className="w-full">
                <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
                    <TabsTrigger value="announcements">Announcements</TabsTrigger>
                    <TabsTrigger value="surveys">Surveys</TabsTrigger>
                    <TabsTrigger value="feedback">Feedback</TabsTrigger>
                </TabsList>
                <TabsContent value="announcements" className="mt-6">
                    <div className="space-y-4">
                        {councilAnnouncements.map((announcement: CouncilAnnouncement) => (
                            <Card key={announcement.id}>
                                <CardHeader>
                                    <CardTitle className="font-headline">{announcement.title}</CardTitle>
                                    <CardDescription>{announcement.date}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm">{announcement.summary}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="surveys" className="mt-6">
                    <div className="space-y-6">
                        {councilSurveys.map((survey: CouncilSurvey) => (
                            <Card key={survey.id}>
                                <CardHeader>
                                    <CardTitle className="font-headline">{survey.title}</CardTitle>
                                    <CardDescription>{survey.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Progress value={(survey.participants / survey.total) * 100} className="h-2" />
                                    <p className="text-xs text-muted-foreground">{survey.participants.toLocaleString()} / {survey.total.toLocaleString()} participants</p>
                                </CardContent>
                                <CardContent>
                                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Take Survey</Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="feedback" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Submit Feedback</CardTitle>
                            <CardDescription>Have a suggestion or concern? Let us know. Your feedback can be submitted anonymously.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input id="subject" placeholder="e.g., More study spaces in the library" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="feedback">Feedback</Label>
                                    <Textarea id="feedback" placeholder="Describe your suggestion or concern in detail." className="min-h-[150px]" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name (Optional)</Label>
                                    <Input id="name" placeholder="John Doe" />
                                </div>
                                <Button type="submit">Submit Feedback</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
