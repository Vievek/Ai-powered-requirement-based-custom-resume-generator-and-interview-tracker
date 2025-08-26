"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lightbulb, Sparkles, Target, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { generateCareerSuggestions } from "@/lib/ai/services";

interface SuggestionsHeaderProps {
  userId: string;
}

export function SuggestionsHeader({ userId }: SuggestionsHeaderProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [careerGoal, setCareerGoal] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [currentRole, setCurrentRole] = useState("");

  const handleGenerateSuggestions = async () => {
    if (!careerGoal.trim()) {
      toast.error("Please describe your career goal");
      return;
    }

    setIsGenerating(true);
    try {
      // Mock profile data - in real app, fetch from database
      const mockProfile = {
        id: userId,
        education: [],
        experience: [],
        skills: ["JavaScript", "React", "Node.js"],
        projects: [],
        certifications: [],
        softSkills: ["Communication", "Leadership"],
        updatedAt: new Date(),
      };

      const suggestions = await generateCareerSuggestions(
        mockProfile,
        careerGoal
      );

      // In a real app, save suggestions to database
      // await saveSuggestions(userId, suggestions);

      toast.success(
        `Generated ${suggestions.length} personalized suggestions!`
      );
      setIsDialogOpen(false);
      setCareerGoal("");
      setTimeframe("");
      setCurrentRole("");

      // Refresh the page to show new suggestions
      window.location.reload();
    } catch (error) {
      console.error("Failed to generate suggestions:", error);
      toast.error("Failed to generate suggestions. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Lightbulb className="h-8 w-8 text-yellow-600" />
            Career Suggestions
          </h1>
          <p className="text-muted-foreground">
            AI-powered recommendations to accelerate your career growth
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate New Suggestions
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Generate Career Suggestions</DialogTitle>
                <DialogDescription>
                  Tell us about your career goals and we'll provide personalized
                  recommendations
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Current Role */}
                <div className="space-y-2">
                  <Label htmlFor="currentRole">Current Role (Optional)</Label>
                  <Input
                    id="currentRole"
                    placeholder="e.g., Software Developer, Product Manager"
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value)}
                  />
                </div>

                {/* Career Goal */}
                <div className="space-y-2">
                  <Label htmlFor="careerGoal">Career Goal *</Label>
                  <Textarea
                    id="careerGoal"
                    placeholder="Describe your career aspirations... e.g., I want to become a Senior Frontend Developer at a tech company, specializing in React and leading a small team."
                    className="min-h-24"
                    value={careerGoal}
                    onChange={(e) => setCareerGoal(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Be specific about your desired role, industry, and timeline
                  </p>
                </div>

                {/* Timeframe */}
                <div className="space-y-2">
                  <Label htmlFor="timeframe">Target Timeframe</Label>
                  <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3-months">3 months</SelectItem>
                      <SelectItem value="6-months">6 months</SelectItem>
                      <SelectItem value="1-year">1 year</SelectItem>
                      <SelectItem value="2-years">2 years</SelectItem>
                      <SelectItem value="3-years">3+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Examples */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium mb-2">
                    Example Career Goals:
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>
                      • "Transition from junior to senior developer in 18
                      months"
                    </li>
                    <li>
                      • "Move from individual contributor to tech lead role"
                    </li>
                    <li>• "Switch from backend to full-stack development"</li>
                    <li>
                      • "Break into the fintech industry as a product manager"
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isGenerating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleGenerateSuggestions}
                  disabled={isGenerating || !careerGoal.trim()}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Target className="h-4 w-4 mr-2" />
                      Generate Suggestions
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Info */}
      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
        <span className="flex items-center">
          <Lightbulb className="h-4 w-4 mr-1 text-yellow-600" />
          AI-Powered Insights
        </span>
        <span className="flex items-center">
          <Target className="h-4 w-4 mr-1 text-blue-600" />
          Personalized Roadmap
        </span>
        <span className="flex items-center">
          <Sparkles className="h-4 w-4 mr-1 text-purple-600" />
          Career Growth
        </span>
      </div>
    </div>
  );
}
