"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function FeedbackForm() {
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const data = {
      subject: formData.get("subject"),
      message: formData.get("feedback"),
      name: formData.get("name"),
    };

    await fetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify(data),
    });

    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback! The student council will review it.",
    });

    form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Submit Feedback</CardTitle>
        <CardDescription>
          Speak your suggestions or concerns. Feedback is anonymous.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input name="subject" id="subject" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea name="feedback" id="feedback" className="min-h-[150px]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name (Optional)</Label>
            <Input name="name" id="name" />
          </div>
          <Button type="submit">Submit Feedback</Button>
        </form>
      </CardContent>
    </Card>
  );
}
