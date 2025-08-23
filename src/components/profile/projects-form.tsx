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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Award, Plus, Edit, Trash2, ExternalLink, Code2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  url?: string;
}

interface ProjectsFormProps {
  data: Project[];
  onUpdate: (data: Project[]) => void;
  onPrevious: () => void;
  onComplete: () => void;
}

export function ProjectsForm({
  data,
  onUpdate,
  onPrevious,
  onComplete,
}: ProjectsFormProps) {
  const [projects, setProjects] = useState<Project[]>(data);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Omit<Project, "id">>({
    name: "",
    description: "",
    techStack: [],
    url: "",
  });
  const [newTech, setNewTech] = useState("");

  const handleSaveProject = () => {
    const newProject: Project = {
      id: editingProject?.id || Date.now().toString(),
      ...formData,
    };

    let updatedProjects;
    if (editingProject) {
      updatedProjects = projects.map((proj) =>
        proj.id === editingProject.id ? newProject : proj
      );
    } else {
      updatedProjects = [...projects, newProject];
    }

    setProjects(updatedProjects);
    onUpdate(updatedProjects);

    // Reset form
    setFormData({
      name: "",
      description: "",
      techStack: [],
      url: "",
    });
    setEditingProject(null);
    setIsDialogOpen(false);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setFormData(project);
    setIsDialogOpen(true);
  };

  const handleDeleteProject = (id: string) => {
    const updatedProjects = projects.filter((proj) => proj.id !== id);
    setProjects(updatedProjects);
    onUpdate(updatedProjects);
  };

  const addTechnology = () => {
    if (newTech.trim() && !formData.techStack.includes(newTech.trim())) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, newTech.trim()],
      });
      setNewTech("");
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter((t) => t !== tech),
    });
  };

  const handleComplete = () => {
    onUpdate(projects);
    onComplete();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Projects & Portfolio
          </CardTitle>
          <CardDescription>
            Showcase your personal projects, contributions, and portfolio work
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Projects List */}
          <AnimatePresence>
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">
                            {project.name}
                          </h3>
                          {project.url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              asChild
                            >
                              <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {project.description}
                        </p>

                        {project.techStack.length > 0 && (
                          <div className="flex items-center gap-1 mb-2">
                            <Code2 className="h-3 w-3 text-muted-foreground mr-1" />
                            <div className="flex flex-wrap gap-1">
                              {project.techStack.map((tech, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProject(project)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
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

          {/* Add Project Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-20 border-dashed"
                onClick={() => {
                  setEditingProject(null);
                  setFormData({
                    name: "",
                    description: "",
                    techStack: [],
                    url: "",
                  });
                }}
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Project
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingProject ? "Edit" : "Add"} Project
                </DialogTitle>
                <DialogDescription>
                  Provide details about your project, including technologies
                  used
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Project Name */}
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name *</Label>
                  <Input
                    id="projectName"
                    placeholder="e.g., E-commerce Platform"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                {/* Project URL */}
                <div className="space-y-2">
                  <Label htmlFor="projectUrl">Project URL</Label>
                  <Input
                    id="projectUrl"
                    placeholder="https://github.com/username/project"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="projectDescription">Description *</Label>
                  <Textarea
                    id="projectDescription"
                    placeholder="Describe what the project does, your role, and key achievements..."
                    className="min-h-24"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                {/* Tech Stack */}
                <div className="space-y-2">
                  <Label>Technologies Used</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add technology..."
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTechnology();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={addTechnology}
                      disabled={!newTech.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {formData.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.techStack.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="pr-1">
                          {tech}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 ml-2 text-muted-foreground hover:text-destructive"
                            onClick={() => removeTechnology(tech)}
                          >
                            ×
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
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
                  onClick={handleSaveProject}
                  disabled={!formData.name || !formData.description}
                >
                  {editingProject ? "Update" : "Add"} Project
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {projects.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No projects added yet</p>
              <p className="text-xs">
                Showcase your work by adding projects to your profile
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile Completion */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Ready to Create AI-Powered Resumes!
            </h3>
            <p className="text-sm text-green-700">
              Your profile is complete. You can now generate tailored resumes
              for specific job applications.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous: Skills
        </Button>
        <Button
          onClick={handleComplete}
          className="bg-green-600 hover:bg-green-700"
        >
          Complete Profile
        </Button>
      </div>
    </div>
  );
}
