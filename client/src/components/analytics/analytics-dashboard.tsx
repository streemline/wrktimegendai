import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as tabs from "@/components/ui/tabs";
import { MonthlyReport, TimeEntry, User } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import AdvancedReporting from "./advanced-reporting";

interface AnalyticsDashboardProps {
  user: User | null | undefined;
  timeEntries: TimeEntry[];
  monthlyReports: MonthlyReport[];
  currentMonth: number;
  currentYear: number;
  isLoading: boolean;
  onDateRangeChange?: (startDate: Date, endDate: Date) => void;
}

export function AnalyticsDashboard({
  user,
  timeEntries,
  monthlyReports,
  currentMonth,
  currentYear,
  isLoading,
}: AnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [] = useState<Date | undefined>(new Date());

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-6"></div>
      <tabs.Tabs value={activeTab} onValueChange={setActiveTab}>
        <tabs.TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Загальні години
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {timeEntries
                    .reduce((acc, entry) => {
                      // Расчет общего количества часов
                      const startTime = entry.startTime.split(":").map(Number);
                      const endTime = entry.endTime.split(":").map(Number);
                      const startMinutes = startTime[0] * 60 + startTime[1];
                      const endMinutes = endTime[0] * 60 + endTime[1];
                      return acc + (endMinutes - startMinutes) / 60;
                    }, 0)
                    .toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {monthlyReports[0]?.workedMinutes &&
                  monthlyReports[0]?.targetMinutes
                    ? `${((monthlyReports[0].workedMinutes / monthlyReports[0].targetMinutes) * 100).toFixed(0)}% від плану`
                    : "Дані відсутні"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Середній робочий день
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {timeEntries.length > 0
                    ? (
                        timeEntries.reduce((acc, entry) => {
                          const startTime = entry.startTime
                            .split(":")
                            .map(Number);
                          const endTime = entry.endTime.split(":").map(Number);
                          const startMinutes = startTime[0] * 60 + startTime[1];
                          const endMinutes = endTime[0] * 60 + endTime[1];
                          return acc + (endMinutes - startMinutes) / 60;
                        }, 0) / timeEntries.length
                      ).toFixed(1) + " год"
                    : "0 год"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {monthlyReports[0]?.workDays
                    ? `За ${monthlyReports[0].workDays} робочих днів`
                    : "Дані відсутні"}
                </p>
              </CardContent>
            </Card>
          </div>

          {user && (
            <AdvancedReporting
              user={user}
              timeEntries={timeEntries}
              monthlyReports={monthlyReports}
              currentYear={currentYear}
              currentMonth={currentMonth}
            />
          )}
        </tabs.TabsContent>
      </tabs.Tabs>
    </div>
  );
}
