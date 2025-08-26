"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Check, Palette, Crown, Zap, FileText, Eye } from "lucide-react";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  category: "modern" | "classic" | "creative" | "minimal";
  description: string;
  preview: string;
  features: string[];
  isPro?: boolean;
  atsOptimized: boolean;
  colorTheme: string;
}

interface TemplateSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
}

const templates: Template[] = [
  {
    id: "modern",
    name: "Modern Professional",
    category: "modern",
    description:
      "Clean and contemporary design with subtle colors and excellent readability",
    preview: "/templates/modern-preview.jpg",
    features: [
      "ATS Optimized",
      "Clean Typography",
      "Color Accents",
      "Professional Layout",
    ],
    atsOptimized: true,
    colorTheme: "blue",
  },
  {
    id: "classic",
    name: "Classic Executive",
    category: "classic",
    description:
      "Traditional and formal design perfect for executive and corporate roles",
    preview: "/templates/classic-preview.jpg",
    features: [
      "Traditional Layout",
      "Professional Fonts",
      "Minimal Design",
      "ATS Friendly",
    ],
    atsOptimized: true,
    colorTheme: "black",
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    category: "minimal",
    description:
      "Ultra-clean design focusing on content with maximum white space",
    preview: "/templates/minimal-preview.jpg",
    features: [
      "Maximum Readability",
      "Minimal Design",
      "Focus on Content",
      "ATS Perfect",
    ],
    atsOptimized: true,
    colorTheme: "gray",
  },
  {
    id: "creative",
    name: "Creative Designer",
    category: "creative",
    description: "Eye-catching design for creative professionals and designers",
    preview: "/templates/creative-preview.jpg",
    features: [
      "Visual Appeal",
      "Creative Layout",
      "Color Variety",
      "Unique Design",
    ],
    isPro: true,
    atsOptimized: false,
    colorTheme: "purple",
  },
  {
    id: "tech",
    name: "Tech Professional",
    category: "modern",
    description:
      "Modern template designed specifically for tech and engineering roles",
    preview: "/templates/tech-preview.jpg",
    features: [
      "Tech-Focused",
      "Skills Highlight",
      "Project Showcase",
      "ATS Optimized",
    ],
    atsOptimized: true,
    colorTheme: "green",
  },
  {
    id: "executive",
    name: "Executive Premium",
    category: "classic",
    description:
      "Premium template for C-level executives and senior management",
    preview: "/templates/executive-preview.jpg",
    features: [
      "Executive Layout",
      "Premium Design",
      "Leadership Focus",
      "ATS Compatible",
    ],
    isPro: true,
    atsOptimized: true,
    colorTheme: "navy",
  },
];

const categoryLabels = {
  modern: "Modern",
  classic: "Classic",
  creative: "Creative",
  minimal: "Minimal",
};

export function TemplateSelector({
  open,
  onOpenChange,
  selectedTemplate,
  onTemplateSelect,
}: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const filteredTemplates =
    selectedCategory === "all"
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  const handleTemplateSelect = (templateId: string) => {
    onTemplateSelect(templateId);
    toast.success("Template applied successfully!");
    onOpenChange(false);
  };

  const handlePreview = (template: Template) => {
    setPreviewTemplate(template);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Choose Resume Template
            </DialogTitle>
            <DialogDescription>
              Select a professional template optimized for ATS systems
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col lg:flex-row gap-6 h-[70vh]">
            {/* Categories Sidebar */}
            <div className="lg:w-48 flex-shrink-0">
              <div className="space-y-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory("all")}
                >
                  All Templates
                </Button>
                {Object.entries(categoryLabels).map(([category, label]) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "ghost"
                    }
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {label}
                    <Badge variant="secondary" className="ml-auto">
                      {templates.filter((t) => t.category === category).length}
                    </Badge>
                  </Button>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Filter Info */}
              <div className="text-xs text-muted-foreground space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-3 w-3 text-green-500" />
                  <span>ATS Optimized</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="h-3 w-3 text-yellow-500" />
                  <span>Pro Template</span>
                </div>
              </div>
            </div>

            {/* Templates Grid */}
            <ScrollArea className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pr-4">
                {filteredTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className={`group cursor-pointer border-2 transition-all hover:shadow-lg ${
                      selectedTemplate === template.id
                        ? "border-primary shadow-md"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <CardContent className="p-4">
                      {/* Template Preview */}
                      <div className="relative mb-3">
                        <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center border">
                          <FileText className="h-12 w-12 text-gray-400" />
                          {/* In a real app, this would be an actual image */}
                        </div>

                        {/* Overlay with actions */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreview(template);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Selected indicator */}
                        {selectedTemplate === template.id && (
                          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                            <Check className="h-3 w-3" />
                          </div>
                        )}

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {template.atsOptimized && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-green-100 text-green-800"
                            >
                              <Zap className="h-2 w-2 mr-1" />
                              ATS
                            </Badge>
                          )}
                          {template.isPro && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-yellow-100 text-yellow-800"
                            >
                              <Crown className="h-2 w-2 mr-1" />
                              Pro
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Template Info */}
                      <div>
                        <h3 className="font-semibold text-sm mb-1">
                          {template.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {template.description}
                        </p>

                        {/* Features */}
                        <div className="flex flex-wrap gap-1">
                          {template.features
                            .slice(0, 2)
                            .map((feature, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {feature}
                              </Badge>
                            ))}
                          {template.features.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.features.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-xs text-muted-foreground">
              {filteredTemplates.length} templates available
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleTemplateSelect(selectedTemplate)}>
                Apply Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Preview Dialog */}
      <Dialog
        open={!!previewTemplate}
        onOpenChange={(open) => !open && setPreviewTemplate(null)}
      >
        <DialogContent className="sm:max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Template Preview</DialogTitle>
            <DialogDescription>
              {previewTemplate?.name} - {previewTemplate?.description}
            </DialogDescription>
          </DialogHeader>

          {previewTemplate && (
            <div className="flex flex-col lg:flex-row gap-6 h-[70vh]">
              {/* Preview */}
              <div className="flex-1 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FileText className="h-24 w-24 mx-auto mb-4" />
                  <p className="text-lg font-medium">{previewTemplate.name}</p>
                  <p className="text-sm">Template Preview</p>
                </div>
              </div>

              {/* Details */}
              <div className="lg:w-80 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Features</h3>
                  <ul className="space-y-2">
                    {previewTemplate.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Check className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Template Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span className="capitalize">
                        {previewTemplate.category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>ATS Optimized:</span>
                      <Badge
                        variant={
                          previewTemplate.atsOptimized ? "secondary" : "outline"
                        }
                      >
                        {previewTemplate.atsOptimized ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Color Theme:</span>
                      <span className="capitalize">
                        {previewTemplate.colorTheme}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleTemplateSelect(previewTemplate.id)}
                  >
                    Use This Template
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setPreviewTemplate(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
