import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { subMonths } from "date-fns";
import { User, TimeEntry, MonthlyReport } from "@shared/schema";
import { formatMinutesToHours } from "@/lib/utils";
import { CalendarDays, Clock, TrendingUp, Filter } from "lucide-react";

interface AdvancedReportingProps {
  user: User;
  timeEntries: TimeEntry[];
  monthlyReports: MonthlyReport[];
  currentYear: number;
  currentMonth: number;
}

export default function AdvancedReporting({
  timeEntries,
  monthlyReports,
  currentYear,
  currentMonth,
}: AdvancedReportingProps) {
  const [] = useState("distribution");
  const [timeFrame, setTimeFrame] = useState<
    "3months" | "6months" | "12months"
  >("6months");

  // Фильтрация данных по временному периоду
  const filteredData = useMemo(() => {
    const now = new Date(currentYear, currentMonth - 1);
    let monthsToSubtract;

    switch (timeFrame) {
      case "3months":
        monthsToSubtract = 3;
        break;
      case "12months":
        monthsToSubtract = 12;
        break;
      case "6months":
      default:
        monthsToSubtract = 6;
        break;
    }

    const startDate = subMonths(now, monthsToSubtract);

    return {
      timeEntries: timeEntries.filter((entry) => {
        let entryDate: Date;
        try {
          if (entry.date instanceof Date) {
            entryDate = entry.date;
          } else {
            entryDate = new Date(entry.date as string | number);
          }
        } catch (e) {
          // В случае ошибки используем текущую дату
          console.warn("Invalid date format in time entry:", entry);
          entryDate = new Date();
        }
        return entryDate >= startDate;
      }),
      monthlyReports: monthlyReports.filter((report) => {
        const reportDate = new Date(report.year, report.month - 1);
        return reportDate >= startDate;
      }),
    };
  }, [timeEntries, monthlyReports, timeFrame, currentYear, currentMonth]);

  // Суммарная статистика
  const summary = useMemo(() => {
    const totalWorkedMinutes = filteredData.monthlyReports.reduce(
      (acc, report) => acc + report.workedMinutes,
      0,
    );

    const totalTargetMinutes = filteredData.monthlyReports.reduce(
      (acc, report) => acc + report.targetMinutes,
      0,
    );

    const avgEfficiency =
      totalTargetMinutes > 0
        ? (totalWorkedMinutes / totalTargetMinutes) * 100
        : 0;

    const totalEntries = filteredData.timeEntries.length;

    // Сгруппируем записи по датам, чтобы получить уникальные дни
    const uniqueDatesMap: Record<string, boolean> = {};

    // Обработаем каждую запись
    filteredData.timeEntries.forEach((entry) => {
      let dateObj: Date;

      // Преобразуем date в объект Date, независимо от его типа
      if (entry.date instanceof Date) {
        dateObj = entry.date;
      } else {
        try {
          dateObj = new Date(entry.date as string | number);
        } catch (e) {
          // В случае ошибки используем текущую дату
          dateObj = new Date();
        }
      }

      // Форматируем дату в строку YYYY-MM-DD
      const dateStr = dateObj.toISOString().split("T")[0];
      uniqueDatesMap[dateStr] = true;
    });

    const uniqueDays = Object.keys(uniqueDatesMap).length;

    return {
      totalWorkedHours: totalWorkedMinutes / 60,
      avgEfficiency: Math.round(avgEfficiency),
      totalEntries,
      uniqueDays,
    };
  }, [filteredData]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              Розширена аналітика
            </CardTitle>
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTimeFrame("3months")}
                className={
                  timeFrame === "3months" ? "bg-primary text-white" : ""
                }
              >
                3 міс.
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTimeFrame("6months")}
                className={
                  timeFrame === "6months" ? "bg-primary text-white" : ""
                }
              >
                6 міс.
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTimeFrame("12months")}
                className={
                  timeFrame === "12months" ? "bg-primary text-white" : ""
                }
              >
                1 рік
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-secondary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Загальний час
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      {formatMinutesToHours(summary.totalWorkedHours * 60)}
                    </div>
                  </div>
                  <Clock className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Ефективність
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      {summary.avgEfficiency}%
                    </div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Робочих днів
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      {summary.uniqueDays}
                    </div>
                  </div>
                  <CalendarDays className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Кількість записів
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      {summary.totalEntries}
                    </div>
                  </div>
                  <Filter className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-6"></div>
    </motion.div>
  );
}
