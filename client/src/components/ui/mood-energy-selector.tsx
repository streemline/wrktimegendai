import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Иконки настроения
const MoodIcons = {
  1: '😔', // Очень плохое
  2: '😕', // Плохое
  3: '😐', // Нейтральное
  4: '🙂', // Хорошее
  5: '😄', // Отличное
};

// Индикаторы уровня энергии
const EnergyLevels = {
  1: { label: 'Низкий', color: 'bg-red-500' },
  2: { label: 'Ниже среднего', color: 'bg-orange-500' },
  3: { label: 'Средний', color: 'bg-yellow-500' },
  4: { label: 'Высокий', color: 'bg-lime-500' },
  5: { label: 'Очень высокий', color: 'bg-green-500' },
};

interface MoodEnergySelectorProps {
  moodRating: number | null;
  energyLevel: number | null;
  onMoodChange: (value: number) => void;
  onEnergyChange: (value: number) => void;
  className?: string;
}

export function MoodEnergySelector({
  moodRating,
  energyLevel,
  onMoodChange,
  onEnergyChange,
  className,
}: MoodEnergySelectorProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Настроение */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Настроение</label>
        <div className="flex justify-between">
          {Object.entries(MoodIcons).map(([value, icon]) => {
            const isSelected = moodRating === Number(value);
            return (
              <motion.button
                key={value}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onMoodChange(Number(value))}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-xl",
                  isSelected 
                    ? "bg-primary text-primary-foreground ring-2 ring-primary-foreground" 
                    : "bg-muted hover:bg-primary/20"
                )}
              >
                {icon}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Энергия */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Уровень энергии</label>
        <div className="flex justify-between">
          {Object.entries(EnergyLevels).map(([value, { color }]) => {
            const isSelected = energyLevel === Number(value);
            return (
              <motion.button
                key={value}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onEnergyChange(Number(value))}
                className={cn(
                  "w-7 h-7 rounded-full",
                  color,
                  isSelected && "ring-2 ring-white"
                )}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function MoodRatingDisplay({ rating }: { rating: number | null }) {
  if (!rating) return null;
  
  return (
    <span className="text-xl" title={`Mood Rating: ${rating}/5`}>
      {MoodIcons[rating as keyof typeof MoodIcons]}
    </span>
  );
}

export function EnergyLevelDisplay({ level }: { level: number | null }) {
  if (!level) return null;
  
  const { color, label } = EnergyLevels[level as keyof typeof EnergyLevels];
  
  return (
    <div 
      className="flex items-center gap-1" 
      title={`Energy Level: ${label}`}
    >
      <div className={cn("w-3 h-3 rounded-full", color)}></div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}