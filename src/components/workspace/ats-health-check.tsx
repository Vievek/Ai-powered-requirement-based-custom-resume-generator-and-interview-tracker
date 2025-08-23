"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Zap,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Lightbulb,
  FileSearch,
  Target,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { generateATSHealthCheck } from "@/lib/ai/services";
import { toast } from "sonner";

interface ATSHealthCheckProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: any;
  projectId: string;
}

interface HealthCheckResult {
  score: number;
  issues: string[];
  suggestions: string[];
  categories: {
    formatting: { score: number; issues: string[]; suggestions: string[] };
    keywords: { score: number; issues: string[]; suggestions: string[] };
    structure: { score: number; issues: string[]; suggestions: string[] };
    content: { score: number; issues: string[]; suggestions: string[] };
  };
}

export function ATSHealthCheck({
  open,
  onOpenChange,
  content,
  projectId,
}: ATSHealthCheckProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<HealthCheckResult | null>(null);
  const [jobDescription, setJobDescription] = useState("");

  const runHealthCheck = async () => {
    setIsAnalyzing(true);
    try {
      // Mock detailed results for now
      const mockResults: HealthCheckResult = {
        score: 85,
        issues: [
          "Missing quantifiable achievements in work experience",
          "Some technical keywords could be better integrated",
          "Contact information could be more prominent",
        ],
        suggestions: [
          "Add specific metrics and numbers to demonstrate impact",
          "Include relevant keywords naturally in your experience descriptions",
          "Consider moving contact info to a more prominent location",
          "Use standard section headings like 'Work Experience' and 'Education'",
          "Ensure consistent formatting throughout the document",
        ],
        categories: {
          formatting: {
            score: 90,
            issues: ["Inconsistent bullet point formatting"],
            suggestions: [
              "Use consistent bullet points throughout all sections",
            ],
          },
          keywords: {
            score: 75,
            issues: [
              "Missing some key technical terms",
              "Keywords not naturally integrated",
            ],
            suggestions: [
              "Research job-specific keywords",
              "Integrate keywords naturally in context",
            ],
          },
          structure: {
            score: 95,
            issues: [],
            suggestions: ["Structure is excellent for ATS scanning"],
          },
          content: {
            score: 80,
            issues: [
              "Missing quantifiable achievements",
              "Some sections could be more detailed",
            ],
            suggestions: [
              "Add metrics to achievements",
              "Expand on key responsibilities",
            ],
          },
        },
      };

      // Simulate AI processing time
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setResults(mockResults);
      toast.success("ATS health check completed!");
    } catch (error) {
      console.error("Health check error:", error);
      toast.error("Failed to analyze resume");
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (open && content) {
      runHealthCheck();
    }
  }, [open, content]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4" />;
    if (score >= 60) return <AlertTriangle className="h-4 w-4" />;
    return <XCircle className="h-4 w-4" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            ATS Health Check
          </DialogTitle>
          <DialogDescription>
            Analyze your resume for Applicant Tracking System compatibility
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[70vh]">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Analyzing Your Resume
              </h3>
              <p className="text-muted-foreground text-center max-w-md">
                Our AI is checking your resume for ATS compatibility, keyword
                optimization, and formatting best practices...
              </p>
            </div>
          ) : results ? (
            <div className="space-y-6">
              {/* Overall Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FileSearch className="h-5 w-5" />
                      Overall ATS Score
                    </span>
                    <div
                      className={`flex items-center gap-2 ${getScoreColor(
                        results.score
                      )}`}
                    >
                      {getScoreIcon(results.score)}
                      <span className="text-2xl font-bold">
                        {results.score}/100
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={results.score} className="mb-4" />
                  <div className="flex justify-between text-sm">
                    <span>Poor (0-40)</span>
                    <span>Good (60-79)</span>
                    <span>Excellent (80+)</span>
                  </div>
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(results.categories).map(
                      ([category, data]) => (
                        <div key={category} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium capitalize">
                              {category}
                            </h4>
                            <Badge className={getScoreBadge(data.score)}>
                              {data.score}/100
                            </Badge>
                          </div>
                          <Progress value={data.score} className="h-2" />

                          {data.issues.length > 0 && (
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium text-red-600 flex items-center gap-1">
                                <XCircle className="h-3 w-3" />
                                Issues
                              </h5>
                              <ul className="space-y-1">
                                {data.issues.map((issue, index) => (
                                  <li
                                    key={index}
                                    className="text-xs text-red-600"
                                  >
                                    • {issue}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {data.suggestions.length > 0 && (
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium text-blue-600 flex items-center gap-1">
                                <Lightbulb className="h-3 w-3" />
                                Suggestions
                              </h5>
                              <ul className="space-y-1">
                                {data.suggestions.map((suggestion, index) => (
                                  <li
                                    key={index}
                                    className="text-xs text-blue-600"
                                  >
                                    • {suggestion}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Key Issues */}
              {results.issues.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="h-5 w-5" />
                      Priority Issues to Fix
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {results.issues.map((issue, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 p-3 bg-red-50 rounded-lg"
                        >
                          <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-red-700">{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Actionable Suggestions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-600">
                    <Lightbulb className="h-5 w-5" />
                    Improvement Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {results.suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
                      >
                        <Target className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-blue-700">
                          {suggestion}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* ATS Tips */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-800">
                    ATS Optimization Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-green-700">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>
                        Use standard fonts like Arial, Calibri, or Times New
                        Roman
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>
                        Include relevant keywords naturally in your content
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>
                        Use standard section headings (Experience, Education,
                        Skills)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Avoid images, tables, and complex formatting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Save as both PDF and Word formats</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-16">
              <FileSearch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Ready to Analyze</h3>
              <p className="text-muted-foreground mb-4">
                Click the button below to run an ATS compatibility check on your
                resume
              </p>
              <Button onClick={runHealthCheck}>
                <Zap className="h-4 w-4 mr-2" />
                Run ATS Check
              </Button>
            </div>
          )}
        </ScrollArea>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center gap-2">
            {results && (
              <Button variant="outline" size="sm" onClick={runHealthCheck}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Re-analyze
              </Button>
            )}
          </div>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
