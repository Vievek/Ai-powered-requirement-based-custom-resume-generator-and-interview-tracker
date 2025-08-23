import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import {
  Lightbulb,
  BookOpen,
  Award,
  Code,
  ExternalLink,
  CheckCircle,
  Clock,
  Target,
  MoreHorizontal,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SuggestionsListProps {
  userId: string;
}

const suggestionIcons = {
  SKILL: Code,
  COURSE: BookOpen,
  PROJECT: Target,
  CERTIFICATION: Award,
};

const statusColors = {
  PENDING: "secondary",
  IN_PROGRESS: "blue",
  COMPLETED: "green",
} as const;

const statusLabels = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

export async function SuggestionsList({ userId }: SuggestionsListProps) {
  const suggestions = await prisma.careerSuggestion.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            No Career Suggestions Yet
          </h3>
          <p className="text-muted-foreground text-center mb-4">
            Generate personalized career suggestions based on your goals and
            profile
          </p>
          <Button>Generate Suggestions</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Career Development Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestions.map((suggestion) => {
            const IconComponent = suggestionIcons[suggestion.type];

            return (
              <Card
                key={suggestion.id}
                className="border-l-4 border-l-primary hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {suggestion.type}
                            </Badge>
                            <Badge
                              variant={statusColors[suggestion.status] as any}
                              className="text-xs"
                            >
                              {statusLabels[suggestion.status]}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-base leading-tight">
                            {suggestion.description}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1">
                          {suggestion.resourceLink && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              asChild
                            >
                              <a
                                href={suggestion.resourceLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Reasoning */}
                      {suggestion.reasoning && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {suggestion.reasoning}
                        </p>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(suggestion.createdAt, {
                              addSuffix: true,
                            })}
                          </span>
                          {suggestion.status === "COMPLETED" && (
                            <span className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="h-3 w-3" />
                              Completed
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {suggestion.status === "PENDING" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                            >
                              Start
                            </Button>
                          )}
                          {suggestion.status === "IN_PROGRESS" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                            >
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Load More */}
        {suggestions.length >= 50 && (
          <div className="text-center pt-4">
            <Button variant="outline">Load More Suggestions</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
