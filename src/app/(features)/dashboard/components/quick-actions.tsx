"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Upload,
  Target,
  Briefcase,
  Users,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const quickActions = [
  {
    icon: FileText,
    title: "Create Resume",
    description: "Start a new resume project",
    href: "/dashboard/projects/new",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900",
  },
  {
    icon: Upload,
    title: "Upload Resume",
    description: "Import existing resume",
    href: "/dashboard/profile?tab=upload",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900",
  },
  {
    icon: Briefcase,
    title: "Track Job",
    description: "Add new job application",
    href: "/dashboard/tracker/new",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900",
  },
  {
    icon: Target,
    title: "Career Tips",
    description: "Get AI suggestions",
    href: "/dashboard/suggestions",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900",
  },
  {
    icon: Users,
    title: "Share & Collaborate",
    description: "Get feedback on resume",
    href: "/dashboard/projects?tab=shared",
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-100 dark:bg-indigo-900",
  },
  {
    icon: HelpCircle,
    title: "Help & Guides",
    description: "Learn best practices",
    href: "/dashboard/help",
    color: "text-gray-600 dark:text-gray-400",
    bgColor: "bg-gray-100 dark:bg-gray-900",
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Button
                variant="ghost"
                className="w-full h-auto p-4 justify-start hover:bg-accent group"
                asChild
              >
                <Link href={action.href}>
                  <div
                    className={`h-10 w-10 rounded-lg ${action.bgColor} flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}
                  >
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
