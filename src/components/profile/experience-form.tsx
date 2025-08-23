"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Briefcase,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Building2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface ExperienceFormProps {
  data: Experience[];
  onUpdate: (data: Experience[]) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function ExperienceForm({
  data,
  onUpdate,
  onNext,
  onPrevious,
}: ExperienceFormProps) {
  const [experiences, setExperiences] = useState<Experience[]>(data);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null
  );
  const [formData, setFormData] = useState<Omit<Experience, "id">>({
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });

  const handleSaveExperience = () => {
    const newExperience: Experience = {
      id: editingExperience?.id || Date.now().toString(),
      ...formData,
      endDate: formData.current ? "Present" : formData.endDate,
    };

    let updatedExperiences;
    if (editingExperience) {
      updatedExperiences = experiences.map((exp) =>
        exp.id === editingExperience.id ? newExperience : exp
      );
    } else {
      updatedExperiences = [...experiences, newExperience];
    }

    setExperiences(updatedExperiences);
    onUpdate(updatedExperiences);

    // Reset form
    setFormData({
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    });
    setEditingExperience(null);
    setIsDialogOpen(false);
  };

  const handleEditExperience = (experience: Experience) => {
    setEditingExperience(experience);
    setFormData({
      title: experience.title,
      company: experience.company,
      startDate: experience.startDate,
      endDate: experience.endDate === "Present" ? "" : experience.endDate,
      current: experience.endDate === "Present",
      description: experience.description,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteExperience = (id: string) => {
    const updatedExperiences = experiences.filter((exp) => exp.id !== id);
    setExperiences(updatedExperiences);
    onUpdate(updatedExperiences);
  };

  const handleNext = () => {
    onUpdate(experiences);
    onNext();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Work Experience
          </CardTitle>
          <CardDescription>
            Add your professional work history and achievements
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Experience List */}
          <AnimatePresence>
            {experiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {experience.title}
                        </h3>
                        <div className="flex items-center text-muted-foreground text-sm mb-2">
                          <Building2 className="h-4 w-4 mr-1" />
                          <span>{experience.company}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground text-sm mb-3">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            {experience.startDate} - {experience.endDate}
                          </span>
                          {experience.current && (
                            <Badge variant="secondary" className="ml-2">
                              Current
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {experience.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditExperience(experience)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteExperience(experience.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add Experience Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-20 border-dashed"
                onClick={() => {
                  setEditingExperience(null);
                  setFormData({
                    title: "",
                    company: "",
                    startDate: "",
                    endDate: "",
                    current: false,
                    description: "",
                  });
                }}
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Work Experience
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingExperience ? "Edit" : "Add"} Work Experience
                </DialogTitle>
                <DialogDescription>
                  Provide details about your professional experience
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Job Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Software Engineer"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                {/* Company */}
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    placeholder="e.g., Tech Corp Inc."
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Start Date */}
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="month"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                    />
                  </div>

                  {/* End Date */}
                  <div className="space-y-2">
                    <Label htmlFor="endDate">
                      End Date {!formData.current && "*"}
                    </Label>
                    <Input
                      id="endDate"
                      type="month"
                      disabled={formData.current}
                      value={formData.current ? "" : formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Current Job Toggle */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="current"
                    checked={formData.current}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, current: checked })
                    }
                  />
                  <Label htmlFor="current">I currently work here</Label>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your role, responsibilities, and achievements..."
                    className="min-h-24"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Focus on achievements and quantifiable results
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveExperience}
                  disabled={
                    !formData.title ||
                    !formData.company ||
                    !formData.startDate ||
                    !formData.description
                  }
                >
                  {editingExperience ? "Update" : "Add"} Experience
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {experiences.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No work experience added yet</p>
              <p className="text-xs">
                Click "Add Work Experience" to get started
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous: Personal Info
        </Button>
        <Button onClick={handleNext}>Continue to Education</Button>
      </div>
    </div>
  );
}
