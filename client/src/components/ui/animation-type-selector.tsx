import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AnimationType } from './animated-action-button';

interface AnimationTypeSelectorProps {
  selectedType: AnimationType;
  onTypeChange: (type: AnimationType) => void;
  className?: string;
}

// Иконки для типов анимации
const AnimationIcons: Record<AnimationType, { icon: string; label: string }> = {
  spring: { icon: '🔄', label: 'Пружина' },
  bounce: { icon: '🏀', label: 'Отскок' },
  pulse: { icon: '💓', label: 'Пульс' },
  rotate: { icon: '🔄', label: 'Вращение' },
  flip: { icon: '🔁', label: 'Переворот' },
};

export function AnimationTypeSelector({
  selectedType,
  onTypeChange,
  className,
}: AnimationTypeSelectorProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium">Тип анимации</label>
      <div className="flex justify-between flex-wrap gap-2">
        {Object.entries(AnimationIcons).map(([type, { icon, label }]) => {
          const isSelected = selectedType === type;
          return (
            <motion.button
              key={type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTypeChange(type as AnimationType)}
              className={cn(
                "px-3 py-2 rounded-lg flex flex-col items-center justify-center",
                isSelected 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted hover:bg-primary/20"
              )}
            >
              <span className="text-lg mb-1">{icon}</span>
              <span className="text-xs">{label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export function AnimationTypeDisplay({ type }: { type: AnimationType }) {
  if (!type) return null;
  
  const { icon, label } = AnimationIcons[type];
  
  return (
    <div 
      className="flex items-center gap-1" 
      title={`Animation Type: ${label}`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}