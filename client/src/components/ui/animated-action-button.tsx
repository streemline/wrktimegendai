import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { motion } from 'framer-motion';

// Типы анимаций для кнопок действий
export type AnimationType = 'spring' | 'bounce' | 'pulse' | 'rotate' | 'flip';

interface AnimatedActionButtonProps extends ButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  hoverColor?: string;
  label?: string;
  showTooltip?: boolean;
  animationType?: AnimationType;
}

export function AnimatedActionButton({
  icon,
  onClick,
  hoverColor = 'text-primary',
  label,
  showTooltip = false,
  className,
  animationType = 'spring',
  ...rest
}: AnimatedActionButtonProps) {
  // Определяем анимации на основе выбранного типа
  const getAnimationProps = () => {
    switch (animationType) {
      case 'spring':
        return {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 },
          transition: { type: "spring", stiffness: 400, damping: 15 }
        };
      case 'bounce':
        return {
          whileHover: { y: -5 },
          whileTap: { y: 2 },
          transition: { type: "spring", stiffness: 400, damping: 10 }
        };
      case 'pulse':
        return {
          whileHover: { scale: [1, 1.05, 1] },
          transition: { repeat: Infinity, duration: 1 }
        };
      case 'rotate':
        return {
          whileHover: { rotate: 10 },
          whileTap: { rotate: -10, scale: 0.95 }
        };
      case 'flip':
        return {
          whileHover: { rotateY: 180 },
          transition: { duration: 0.4 }
        };
      default:
        return {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 }
        };
    }
  };

  const animationProps = getAnimationProps();
  
  return (
    <motion.div
      {...animationProps}
      className="relative"
    >
      <Button
        size="icon"
        variant="ghost"
        className={`h-8 w-8 text-muted-foreground hover:${hoverColor} transition-all duration-200 ease-in-out ${className}`}
        onClick={onClick}
        {...rest}
      >
        {icon}
      </Button>
      {showTooltip && label && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap z-50"
        >
          {label}
        </motion.div>
      )}
    </motion.div>
  );
}

export function AnimatedActionGroup({ children }: { children: React.ReactNode }) {
  return (
    <motion.div 
      className="flex justify-center space-x-1" 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ staggerChildren: 0.05 }}
    >
      {children}
    </motion.div>
  );
}