"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  user: {
    name?: string | null;
  };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 17
      ? "Good afternoon"
      : "Good evening";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {greeting}, {user.name?.split(" ")[0] || "there"}! 👋
        </h1>
        <p className="text-muted-foreground">
          Ready to craft your next winning resume?
        </p>
      </div>

      <Badge variant="secondary" className="hidden sm:inline-flex">
        ✨ AI-Powered
      </Badge>
    </motion.div>
  );
}
