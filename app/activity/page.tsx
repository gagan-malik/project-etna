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
        return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case "preparing":
        return <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusBadge = (status: ActivityItem["status"]) => {
    switch (status) {
      case "done":
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            Done
          </Badge>
        );
      case "preparing":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
            Preparing
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive">
            Failed
          </Badge>
        );
    }
  };

  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-8 py-16">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-2xl font-semibold leading-8 text-foreground mb-1">
            History
          </h1>
          <p className="text-sm font-normal leading-5 text-muted-foreground">
            View and manage your recent activity
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 mb-12">
          <div className="flex items-center gap-4 flex-wrap">
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
          <div className="flex flex-col gap-2">
            {filteredActivities.map((activity) => (
              <Card
                key={activity.id}
                className="p-4 hover:bg-accent transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    {getStatusIcon(activity.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-foreground">
                        {activity.name}
                      </h3>
                      {getStatusBadge(activity.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {activity.description}
                    </p>
                    {activity.status === "preparing" && activity.progress !== undefined && (
                      <div className="mb-2">
                        <Progress value={activity.progress} className="h-1" />
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{activity.agent}</span>
                      <span>•</span>
                      <span>{activity.timestamp}</span>
                      <span>•</span>
                      <span>{activity.credits}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(activity.id)}
                      className={activity.favorite ? "text-primary" : ""}
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
