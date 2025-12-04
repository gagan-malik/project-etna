"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Heart, MoreVertical, CheckCircle2, Clock, XCircle } from "lucide-react";

interface ActivityItem {
  id: string;
  name: string;
  description: string;
  status: "preparing" | "done" | "failed";
  progress?: number;
  timestamp: string;
  credits: string;
  favorite: boolean;
  agent: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    name: "Silicon Verification",
    description: "Verifying SystemVerilog design for edge cases",
    status: "done",
    progress: 100,
    timestamp: "2 hours ago",
    credits: "250 credits",
    favorite: false,
    agent: "Verification Agent",
  },
  {
    id: "2",
    name: "Code Analysis",
    description: "Analyzing GitHub repository structure",
    status: "preparing",
    progress: 45,
    timestamp: "5 minutes ago",
    credits: "150 credits",
    favorite: true,
    agent: "Code Analysis Agent",
  },
  {
    id: "3",
    name: "Test Generation",
    description: "Generating test cases for RTL design",
    status: "failed",
    timestamp: "1 day ago",
    credits: "100 credits",
    favorite: false,
    agent: "Test Generator Agent",
  },
];

export default function ActivityPage() {
  const [filterType, setFilterType] = useState<"all" | "favorites">("all");
  const [timeFilter, setTimeFilter] = useState<"day" | "week" | "month">("day");
  const [activities, setActivities] = useState(mockActivities);

  const toggleFavorite = (id: string) => {
    setActivities((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, favorite: !item.favorite } : item
      )
    );
  };

  const filteredActivities = activities.filter((item) => {
    if (filterType === "favorites" && !item.favorite) return false;
    return true;
  });

  const getStatusIcon = (status: ActivityItem["status"]) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="h-4 w-4 text-[var(--component-colors-utility-success-utility-success-700)]" />;
      case "preparing":
        return <Clock className="h-4 w-4 text-[var(--component-colors-utility-warning-utility-warning-700)]" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-[var(--component-colors-utility-error-utility-error-700)]" />;
    }
  };

  const getStatusBadge = (status: ActivityItem["status"]) => {
    switch (status) {
      case "done":
        return (
          <Badge className="bg-[var(--component-colors-utility-success-utility-success-50)] text-[var(--component-colors-utility-success-utility-success-700)]">
            Done
          </Badge>
        );
      case "preparing":
        return (
          <Badge className="bg-[var(--component-colors-utility-warning-utility-warning-50)] text-[var(--component-colors-utility-warning-utility-warning-700)]">
            Preparing
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-[var(--component-colors-utility-error-utility-error-50)] text-[var(--component-colors-utility-error-utility-error-700)]">
            Failed
          </Badge>
        );
    }
  };

  return (
    <main className="flex-1 max-w-[var(--width-2xl)] mx-auto w-full px-[var(--container-padding-desktop)] py-[var(--spacing-4xl)]">
        {/* Page Header */}
        <div className="mb-[var(--spacing-3xl)]">
          <h1 className="text-[24px] font-semibold leading-[32px] text-[var(--colours-text-text-primary-900)] mb-[var(--spacing-xs)]">
            History
          </h1>
          <p className="text-[14px] font-normal leading-[20px] text-[var(--colours-text-text-tertiary-600)]">
            View and manage your recent activity
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-[var(--spacing-xl)] mb-[var(--spacing-3xl)]">
          <div className="flex items-center gap-[var(--spacing-xl)] flex-wrap">
            <Tabs value={filterType} onValueChange={(v) => setFilterType(v as typeof filterType)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="favorites">Favourites</TabsTrigger>
              </TabsList>
            </Tabs>

            <Tabs value={timeFilter} onValueChange={(v) => setTimeFilter(v as typeof timeFilter)}>
              <TabsList>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>

            <Select>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="verification">Verification</SelectItem>
                <SelectItem value="analysis">Analysis</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="done">Done</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Activity List */}
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="flex flex-col gap-[var(--spacing-md)]">
            {filteredActivities.map((activity) => (
              <Card
                key={activity.id}
                className="p-[var(--spacing-xl)] hover:bg-[var(--colours-background-bg-primary_hover)] transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-[var(--spacing-xl)]">
                  <div className="w-10 h-10 rounded-[var(--radius-full)] bg-[var(--component-colors-utility-gray-utility-gray-200)] flex items-center justify-center flex-shrink-0">
                    {getStatusIcon(activity.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-[var(--spacing-md)] mb-[var(--spacing-xs)]">
                      <h3 className="text-[16px] font-semibold text-[var(--colours-text-text-primary-900)]">
                        {activity.name}
                      </h3>
                      {getStatusBadge(activity.status)}
                    </div>
                    <p className="text-[14px] text-[var(--colours-text-text-tertiary-600)] mb-[var(--spacing-md)]">
                      {activity.description}
                    </p>
                    {activity.status === "preparing" && activity.progress !== undefined && (
                      <div className="mb-[var(--spacing-md)]">
                        <Progress value={activity.progress} className="h-1" />
                      </div>
                    )}
                    <div className="flex items-center gap-[var(--spacing-xl)] text-[12px] text-[var(--colours-text-text-tertiary-600)]">
                      <span>{activity.agent}</span>
                      <span>•</span>
                      <span>{activity.timestamp}</span>
                      <span>•</span>
                      <span>{activity.credits}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-[var(--spacing-md)] flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(activity.id)}
                      className={activity.favorite ? "text-[var(--component-colors-components-buttons-primary-button-primary-bg)]" : ""}
                    >
                      <Heart className={`h-4 w-4 ${activity.favorite ? "fill-current" : ""}`} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </main>
  );
}
