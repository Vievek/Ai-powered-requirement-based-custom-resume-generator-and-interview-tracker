"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter, Download } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export function JobApplicationsHeader() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  return (
    <div className="flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Job Applications
          </h1>
          <p className="text-muted-foreground">
            Track and manage all your job applications in one place
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button asChild>
            <Link href="/dashboard/tracker/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Application
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies, positions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="APPLIED">Applied</SelectItem>
            <SelectItem value="INTERVIEWING">Interviewing</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="OFFER">Offer</SelectItem>
          </SelectContent>
        </Select>

        {/* Advanced Filters Button */}
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
        <span className="flex items-center">
          <Badge variant="secondary" className="mr-2">
            12
          </Badge>
          Total Applications
        </span>
        <span className="flex items-center">
          <Badge variant="default" className="mr-2">
            3
          </Badge>
          In Progress
        </span>
        <span className="flex items-center">
          <Badge variant="secondary" className="mr-2">
            2
          </Badge>
          Interviews
        </span>
      </div>
    </div>
  );
}
