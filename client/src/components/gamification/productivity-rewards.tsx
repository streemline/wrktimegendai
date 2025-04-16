import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Trophy,
  Star,
  Medal,
  Flame,
  Calendar,
  Clock,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, TimeEntry, MonthlyReport } from "@shared/schema";
import { formatMinutesToHours } from "@/lib/utils";

interface ProductivityRewardsProps {
  user: User;
  timeEntries: TimeEntry[];
  monthlyReports: MonthlyReport[];
  currentYear?: number;
  currentMonth?: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number; // 0-100
  unlocked: boolean;
  color: string;
  category: "time" | "consistency" | "efficiency";
}

export default function ProductivityRewards({
  timeEntries,
  monthlyReports,
}: ProductivityRewardsProps) {
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [currentAchievement, setCurrentAchievement] =
    useState<Achievement | null>(null);
  const [stats, setStats] = useState({
    totalHours: 0,
    averageHoursPerDay: 0,
    efficiency: 0,
    streaks: {
      current: 0,
      best: 0,
      thisWeek: 0,
      thisMonth: 0,
    },
  });

  // Рассчитываем статистику пользователя на основе данных
  useEffect(() => {
    // Расчет общего времени
    const totalMinutes = timeEntries.reduce((acc, entry) => {
      const startParts = entry.startTime.split(":").map(Number);
      const endParts = entry.endTime.split(":").map(Number);
      const startMinutes = startParts[0] * 60 + startParts[1];
      const endMinutes = endParts[0] * 60 + endParts[1];
      const duration = endMinutes - startMinutes;
      return acc + (duration > 0 ? duration : 0);
    }, 0);

    // Расчет среднего времени в день
    const uniqueDatesMap = timeEntries.reduce(
      (acc, entry) => {
        const dateStr =
          typeof entry.date === "string"
            ? entry.date
            : (entry.date as Date).toISOString().split("T")[0];
        acc[dateStr] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    const uniqueDaysCount = Object.keys(uniqueDatesMap).length;
    const averageMinutesPerDay =
      uniqueDaysCount > 0 ? totalMinutes / uniqueDaysCount : 0;

    // Расчет эффективности (отработанные минуты / плановые минуты)
    const totalWorkedMinutes = monthlyReports.reduce(
      (acc, report) => acc + report.workedMinutes,
      0,
    );
    const totalTargetMinutes = monthlyReports.reduce(
      (acc, report) => acc + report.targetMinutes,
      0,
    );
    const efficiency =
      totalTargetMinutes > 0
        ? (totalWorkedMinutes / totalTargetMinutes) * 100
        : 0;

    // Расчет текущей серии дней
    const sortedDates = timeEntries
      .map((entry) => new Date(entry.date))
      .sort((a, b) => b.getTime() - a.getTime());

    // Получаем уникальные строки дат
    const uniqueDatesStringMap = sortedDates.reduce(
      (acc, date) => {
        const dateStr = date.toISOString().split("T")[0];
        acc[dateStr] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    const uniqueDateStrings = Object.keys(uniqueDatesStringMap);
    // Текущая серия
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < uniqueDateStrings.length; i++) {
      const date = new Date(uniqueDateStrings[i]);
      const previousDay = new Date(today);
      previousDay.setDate(today.getDate() - i - 1);

      if (
        date.toISOString().split("T")[0] ===
        previousDay.toISOString().split("T")[0]
      ) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Серия на этой неделе
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weekStreak = uniqueDateStrings.filter((dateStr) => {
      const date = new Date(dateStr);
      return date >= startOfWeek;
    }).length;

    // Серия в этом месяце
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthStreak = uniqueDateStrings.filter((dateStr) => {
      const date = new Date(dateStr);
      return date >= startOfMonth;
    }).length;

    // Лучшая серия (из локального хранилища)
    let bestStreak = parseInt(localStorage.getItem("bestWorkStreak") || "0");
    if (currentStreak > bestStreak) {
      bestStreak = currentStreak;
      localStorage.setItem("bestWorkStreak", bestStreak.toString());
    }

    setStats({
      totalHours: totalMinutes / 60,
      averageHoursPerDay: averageMinutesPerDay / 60,
      efficiency,
      streaks: {
        current: currentStreak,
        best: bestStreak,
        thisWeek: weekStreak,
        thisMonth: monthStreak,
      },
    });
  }, [timeEntries, monthlyReports]);

  // Проверяем и генерируем достижения на основе статистики
  const achievements: Achievement[] = [
    {
      id: "first-day",
      title: "Перший день",
      description: "Успішно відстежили свій перший робочий день",
      icon: <Star className="h-8 w-8" />,
      progress: timeEntries.length > 0 ? 100 : 0,
      unlocked: timeEntries.length > 0,
      color: "bg-blue-500",
      category: "time",
    },
    {
      id: "time-tracker-10",
      title: "Відстежувач часу",
      description: "Відстежено 10 годин робочого часу",
      icon: <Clock className="h-8 w-8" />,
      progress: Math.min((stats.totalHours / 10) * 100, 100),
      unlocked: stats.totalHours >= 10,
      color: "bg-indigo-500",
      category: "time",
    },
    {
      id: "time-tracker-100",
      title: "Професіонал",
      description: "Відстежено 100 годин робочого часу",
      icon: <Award className="h-8 w-8" />,
      progress: Math.min((stats.totalHours / 100) * 100, 100),
      unlocked: stats.totalHours >= 100,
      color: "bg-purple-500",
      category: "time",
    },
    {
      id: "streak-3",
      title: "Мінісерія",
      description: "Відстеження робочого часу протягом 3 днів поспіль",
      icon: <Flame className="h-8 w-8" />,
      progress: Math.min((stats.streaks.current / 3) * 100, 100),
      unlocked: stats.streaks.current >= 3,
      color: "bg-orange-500",
      category: "consistency",
    },
    {
      id: "streak-7",
      title: "Тижнева серія",
      description: "Відстеження робочого часу протягом 7 днів поспіль",
      icon: <Calendar className="h-8 w-8" />,
      progress: Math.min((stats.streaks.current / 7) * 100, 100),
      unlocked: stats.streaks.current >= 7,
      color: "bg-red-500",
      category: "consistency",
    },
    {
      id: "efficiency-100",
      title: "Ефективний працівник",
      description: "Досягнення 100% ефективності за місяць",
      icon: <Zap className="h-8 w-8" />,
      progress: Math.min(stats.efficiency, 100),
      unlocked: stats.efficiency >= 100,
      color: "bg-yellow-500",
      category: "efficiency",
    },
    {
      id: "efficiency-120",
      title: "Надзвичайна продуктивність",
      description: "Досягнення 120% ефективності за місяць",
      icon: <Trophy className="h-8 w-8" />,
      progress: Math.min((stats.efficiency / 120) * 100, 100),
      unlocked: stats.efficiency >= 120,
      color: "bg-green-500",
      category: "efficiency",
    },
    {
      id: "month-perfect",
      title: "Ідеальний місяць",
      description:
        "Відстеження робочого часу кожен робочий день протягом місяця",
      icon: <Medal className="h-8 w-8" />,
      progress: Math.min((stats.streaks.thisMonth / 20) * 100, 100),
      unlocked: stats.streaks.thisMonth >= 20,
      color: "bg-pink-500",
      category: "consistency",
    },
  ];

  // Проверка новых достижений
  useEffect(() => {
    // Получаем разблокированные достижения из localStorage
    const unlockedAchievements = JSON.parse(
      localStorage.getItem("unlockedAchievements") || "[]",
    );

    // Проверяем, есть ли новые разблокированные достижения
    const newlyUnlocked = achievements.filter(
      (ach) => ach.unlocked && !unlockedAchievements.includes(ach.id),
    );

    if (newlyUnlocked.length > 0) {
      // Показываем последнее разблокированное достижение
      setCurrentAchievement(newlyUnlocked[0]);
      setShowAchievementModal(true);

      // Сохраняем обновленный список разблокированных достижений
      const updatedUnlocked = [
        ...unlockedAchievements,
        ...newlyUnlocked.map((ach) => ach.id),
      ];
      localStorage.setItem(
        "unlockedAchievements",
        JSON.stringify(updatedUnlocked),
      );
    }
  }, [achievements]);

  // Фильтрация достижений по категориям
  const timeAchievements = achievements.filter(
    (ach) => ach.category === "time",
  );
  const consistencyAchievements = achievements.filter(
    (ach) => ach.category === "consistency",
  );
  const efficiencyAchievements = achievements.filter(
    (ach) => ach.category === "efficiency",
  );

  // Количество разблокированных достижений
  const unlockedCount = achievements.filter((ach) => ach.unlocked).length;
  const progressPercentage = (unlockedCount / achievements.length) * 100;

  return (
    <div className="space-y-6">
      <div className="space-y-6"></div>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold">
            Мотивація та досягнення
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-secondary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Поточна серія
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      {stats.streaks.current} дн.
                    </div>
                  </div>
                  <Flame className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Найкраща серія
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      {stats.streaks.best} дн.
                    </div>
                  </div>
                  <Trophy className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Разблоковано
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      {unlockedCount}/{achievements.length}
                    </div>
                  </div>
                  <Medal className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Всього годин
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      {formatMinutesToHours(stats.totalHours * 60)}
                    </div>
                  </div>
                  <Clock className="h-8 w-8 text-indigo-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Загальний прогрес</h3>
            <div className="flex items-center gap-2">
              <Progress value={progressPercentage} className="h-3" />
              <span className="text-sm font-medium">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">
                Час та продуктивність
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {timeAchievements.map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Стабільність</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {consistencyAchievements.map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Ефективність</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {efficiencyAchievements.map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Модальное окно нового достижения */}
      <AnimatePresence>
        {showAchievementModal && currentAchievement && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full text-center"
            >
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{
                  type: "spring",
                  repeat: 3,
                  repeatType: "mirror",
                  duration: 0.4,
                }}
                className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${currentAchievement.color} text-white mb-4`}
              >
                {currentAchievement.icon}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-2">Нове досягнення!</h2>
                <h3 className="text-xl text-primary font-semibold mb-3">
                  {currentAchievement.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {currentAchievement.description}
                </p>

                <Button onClick={() => setShowAchievementModal(false)}>
                  Чудово!
                </Button>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface AchievementCardProps {
  achievement: Achievement;
}

function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <Card
      className={`${achievement.unlocked ? "border-primary" : "opacity-75"}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${achievement.unlocked ? achievement.color : "bg-gray-300 dark:bg-gray-700"} text-white`}
          >
            {achievement.icon}
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h4 className="font-semibold text-sm">{achievement.title}</h4>
              {achievement.unlocked && (
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/30 text-xs"
                >
                  Розблоковано
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-xs mt-1">
              {achievement.description}
            </p>

            <div className="mt-2">
              <Progress value={achievement.progress} className="h-1.5" />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">
                  {achievement.progress.toFixed(0)}%
                </span>
                {!achievement.unlocked && (
                  <span className="text-xs text-muted-foreground">
                    Заблоковано
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
