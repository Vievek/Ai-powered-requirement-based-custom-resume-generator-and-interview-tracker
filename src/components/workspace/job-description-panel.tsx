"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Sparkles,
  Target,
  TrendingUp,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { findRelevantCVs } from "@/lib/ai/services";
import { getUserResumeProjects } from "@/lib/actions/projects";
import { toast } from "sonner";
import Link from "next/link";

interface Branch {
  id: string;
  name: string;
  versions: any[];
}

interface JobDescriptionPanelProps {
  projectId: string;
  currentBranch?: Branch;
  userId: string;
}

interface RelevantProject {
  id: string;
  name: string;
  score: number;
}

export function JobDescriptionPanel({
  projectId,
  currentBranch,
  userId,
}: JobDescriptionPanelProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [relevantProjects, setRelevantProjects] = useState<RelevantProject[]>(
    []
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [keywordSuggestions, setKeywordSuggestions] = useState<string[]>([]);

  const handleAnalyzeJD = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description first");
      return;
    }

    setIsAnalyzing(true);
    try {
      // Get user's existing projects
      const userProjects = await getUserResumeProjects();

      // Find relevant CVs using AI
      const projectsForAI = userProjects.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description || undefined,
      }));
      const relevant = await findRelevantCVs(jobDescription, projectsForAI);
      setRelevantProjects(relevant);

      // Extract keywords (simplified version)
      const keywords = extractKeywords(jobDescription);
      setKeywordSuggestions(keywords);

      toast.success("Job description analyzed successfully!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze job description");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUseRelevantProject = (project: RelevantProject) => {
    toast.success(`Switching to ${project.name} for reference`);
    // TODO: Implement project switching or content copying
  };

  // Simple keyword extraction (in a real app, this would use AI)
  const extractKeywords = (text: string): string[] => {
    const techKeywords = [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "Python",
      "Java",
      "AWS",
      "Docker",
      "Kubernetes",
      "SQL",
      "NoSQL",
      "API",
      "REST",
      "GraphQL",
      "Git",
      "Agile",
      "Scrum",
      "CI/CD",
      "Testing",
      "MongoDB",
      "PostgreSQL",
      "Redux",
      "Vue",
      "Angular",
    ];

    const lowerText = text.toLowerCase();
    return techKeywords
      .filter((keyword) => lowerText.includes(keyword.toLowerCase()))
      .slice(0, 10);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2 mb-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold">Job Description</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Paste the job description to get AI-powered resume suggestions
        </p>
      </div>

      <ScrollArea className="flex-1 p-4 space-y-4">
        {/* Job Description Input */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Paste Job Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              placeholder="Paste the full job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={8}
              className="text-sm"
            />
            <Button
              onClick={handleAnalyzeJD}
              disabled={isAnalyzing || !jobDescription.trim()}
              size="sm"
              className="w-full"
            >
              {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Sparkles className="mr-2 h-4 w-4" />
              Analyze with AI
            </Button>
          </CardContent>
        </Card>

        {/* Keyword Suggestions */}
        {keywordSuggestions.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Target className="mr-2 h-4 w-4 text-green-600" />
                Key Technologies Detected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {keywordSuggestions.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Make sure your resume includes these technologies
              </p>
            </CardContent>
          </Card>
        )}

        {/* Relevant Projects */}
        {relevantProjects.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <TrendingUp className="mr-2 h-4 w-4 text-purple-600" />
                Similar Resume Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {relevantProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div>
                    <div className="font-medium text-sm">{project.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round(project.score * 100)}% match
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-12 bg-muted rounded-full h-1">
                      <div
                        className="bg-primary h-1 rounded-full"
                        style={{ width: `${project.score * 100}%` }}
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUseRelevantProject(project)}
                    >
                      Use
                    </Button>
                  </div>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                Consider using content from these projects as reference
              </p>
            </CardContent>
          </Card>
        )}

        {/* AI Suggestions */}
        {jobDescription && !isAnalyzing && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Sparkles className="mr-2 h-4 w-4 text-yellow-600" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-start space-x-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                  <span>Highlight quantifiable achievements with metrics</span>
                </div>
                <div className="flex items-start space-x-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                  <span>
                    Use action verbs like "developed", "implemented",
                    "optimized"
                  </span>
                </div>
                <div className="flex items-start space-x-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-2" />
                  <span>
                    Include relevant technical skills from the job posting
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/dashboard/suggestions">
                <Target className="mr-2 h-4 w-4" />
                Career Suggestions
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/dashboard/tracker">
                <FileText className="mr-2 h-4 w-4" />
                Track Application
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Help Tips */}
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <CardContent className="pt-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-orange-800 dark:text-orange-200">
                  Pro Tip
                </p>
                <p className="text-orange-700 dark:text-orange-300 text-xs mt-1">
                  Copy the entire job posting for better AI analysis. Include
                  requirements, responsibilities, and preferred qualifications.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollArea>
    </div>
  );
}
