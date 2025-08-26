"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  Calendar,
  School,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Education {
  id: string;
  degree: string;
  institution: string;
  startYear: string;
  endYear: string;
  gpa?: string;
}

interface EducationFormProps {
  data: Education[];
  onUpdate: (data: Education[]) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function EducationForm({
  data,
  onUpdate,
  onNext,
  onPrevious,
}: EducationFormProps) {
  const [educations, setEducations] = useState<Education[]>(data);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(
    null
  );
  const [formData, setFormData] = useState<Omit<Education, "id">>({
    degree: "",
    institution: "",
    startYear: "",
    endYear: "",
    gpa: "",
  });

  const handleSaveEducation = () => {
    const newEducation: Education = {
      id: editingEducation?.id || Date.now().toString(),
      ...formData,
    };

    let updatedEducations;
    if (editingEducation) {
      updatedEducations = educations.map((edu) =>
        edu.id === editingEducation.id ? newEducation : edu
      );
    } else {
      updatedEducations = [...educations, newEducation];
    }

    setEducations(updatedEducations);
    onUpdate(updatedEducations);

    // Reset form
    setFormData({
      degree: "",
      institution: "",
      startYear: "",
      endYear: "",
      gpa: "",
    });
    setEditingEducation(null);
    setIsDialogOpen(false);
  };

  const handleEditEducation = (education: Education) => {
    setEditingEducation(education);
    setFormData(education);
    setIsDialogOpen(true);
  };

  const handleDeleteEducation = (id: string) => {
    const updatedEducations = educations.filter((edu) => edu.id !== id);
    setEducations(updatedEducations);
    onUpdate(updatedEducations);
  };

  const handleNext = () => {
    onUpdate(educations);
    onNext();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Education
          </CardTitle>
          <CardDescription>
            Add your educational background and qualifications
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Education List */}
          <AnimatePresence>
            {educations.map((education, index) => (
              <motion.div
                key={education.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {education.degree}
                        </h3>
                        <div className="flex items-center text-muted-foreground text-sm mb-2">
                          <School className="h-4 w-4 mr-1" />
                          <span>{education.institution}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            {education.startYear} - {education.endYear}
                          </span>
                          {education.gpa && (
                            <span className="ml-4">GPA: {education.gpa}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditEducation(education)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteEducation(education.id)}
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

          {/* Add Education Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-20 border-dashed"
                onClick={() => {
                  setEditingEducation(null);
                  setFormData({
                    degree: "",
                    institution: "",
                    startYear: "",
                    endYear: "",
                    gpa: "",
                  });
                }}
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Education
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingEducation ? "Edit" : "Add"} Education
                </DialogTitle>
                <DialogDescription>
                  Provide details about your educational background
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Degree */}
                <div className="space-y-2">
                  <Label htmlFor="degree">Degree *</Label>
                  <Input
                    id="degree"
                    placeholder="e.g., Bachelor of Computer Science"
                    value={formData.degree}
                    onChange={(e) =>
                      setFormData({ ...formData, degree: e.target.value })
                    }
                  />
                </div>

                {/* Institution */}
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution *</Label>
                  <Input
                    id="institution"
                    placeholder="e.g., University of California, Berkeley"
                    value={formData.institution}
                    onChange={(e) =>
                      setFormData({ ...formData, institution: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {/* Start Year */}
                  <div className="space-y-2">
                    <Label htmlFor="startYear">Start Year *</Label>
                    <Input
                      id="startYear"
                      placeholder="2018"
                      value={formData.startYear}
                      onChange={(e) =>
                        setFormData({ ...formData, startYear: e.target.value })
                      }
                    />
                  </div>

                  {/* End Year */}
                  <div className="space-y-2">
                    <Label htmlFor="endYear">End Year *</Label>
                    <Input
                      id="endYear"
                      placeholder="2022"
                      value={formData.endYear}
                      onChange={(e) =>
                        setFormData({ ...formData, endYear: e.target.value })
                      }
                    />
                  </div>

                  {/* GPA */}
                  <div className="space-y-2">
                    <Label htmlFor="gpa">GPA</Label>
                    <Input
                      id="gpa"
                      placeholder="3.8"
                      value={formData.gpa}
                      onChange={(e) =>
                        setFormData({ ...formData, gpa: e.target.value })
                      }
                    />
                  </div>
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
                  onClick={handleSaveEducation}
                  disabled={
                    !formData.degree ||
                    !formData.institution ||
                    !formData.startYear ||
                    !formData.endYear
                  }
                >
                  {editingEducation ? "Update" : "Add"} Education
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {educations.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No education added yet</p>
              <p className="text-xs">Click "Add Education" to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous: Experience
        </Button>
        <Button onClick={handleNext}>Continue to Skills</Button>
      </div>
    </div>
  );
}
