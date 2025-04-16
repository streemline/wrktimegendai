import React, { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, HelpCircle, X } from 'lucide-react';

interface OnboardingTooltipProps {
  id: string;
  content: string;
  title?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  children: ReactNode;
  persistKey?: string;
  delay?: number;
  onComplete?: () => void;
  forceShow?: boolean;
}

export function OnboardingTooltip({
  id,
  content,
  title,
  placement = 'top',
  children,
  persistKey,
  delay = 1000,
  onComplete,
  forceShow = false,
}: OnboardingTooltipProps) {
  const [show, setShow] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  
  // Определяем, нужно ли показывать подсказку
  useEffect(() => {
    // Проверяем локальное хранилище, если есть persistKey
    if (persistKey) {
      const hasSeenTip = localStorage.getItem(`tip-${persistKey}`);
      if (hasSeenTip) {
        return;
      }
    }
    
    // Задержка перед показом
    const timer = setTimeout(() => {
      setShow(true);
      setHasShown(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [persistKey, delay]);
  
  // Если forceShow = true, показываем принудительно
  useEffect(() => {
    if (forceShow) {
      setShow(true);
      setHasShown(true);
    }
  }, [forceShow]);
  
  const handleClose = () => {
    setShow(false);
    
    // Если есть persistKey, сохраняем в localStorage, что подсказка уже показана
    if (persistKey) {
      localStorage.setItem(`tip-${persistKey}`, 'true');
    }
    
    // Вызываем обратный вызов при закрытии, если он есть
    if (onComplete) {
      onComplete();
    }
  };
  
  // Определяем позиционирование в зависимости от placement
  const getTooltipPosition = () => {
    switch (placement) {
      case 'bottom':
        return 'top-full mt-2';
      case 'left':
        return 'right-full mr-2';
      case 'right':
        return 'left-full ml-2';
      case 'top':
      default:
        return 'bottom-full mb-2';
    }
  };
  
  // Определяем анимацию в зависимости от placement
  const getAnimationVariants = () => {
    switch (placement) {
      case 'bottom':
        return {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 }
        };
      case 'left':
        return {
          initial: { opacity: 0, x: 10 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 10 }
        };
      case 'right':
        return {
          initial: { opacity: 0, x: -10 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -10 }
        };
      case 'top':
      default:
        return {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 10 }
        };
    }
  };
  
  return (
    <div className="relative inline-block" id={id}>
      {children}
      
      {/* Иконка подсказки, если подсказка еще не показывалась */}
      {!hasShown && !forceShow && (
        <div className="absolute -top-2 -right-2 bg-primary rounded-full p-0.5 text-white animate-pulse">
          <HelpCircle className="h-4 w-4" />
        </div>
      )}
      
      <AnimatePresence>
        {show && (
          <motion.div
            {...getAnimationVariants()}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`absolute z-50 ${getTooltipPosition()} w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden`}
          >
            <div className="relative">
              {title && <div className="font-semibold text-sm p-3 pb-2 bg-primary text-white">{title}</div>}
              <div className="p-3 text-sm">
                {content}
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700">
                <Button variant="ghost" size="sm" onClick={handleClose} className="text-xs">
                  Закрити
                </Button>
                <Button variant="ghost" size="sm" onClick={handleClose} className="text-primary text-xs">
                  <span>Зрозуміло</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-1 right-1 h-6 w-6 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white" 
                onClick={handleClose}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface OnboardingStepProps {
  steps: Array<{
    id: string;
    title?: string;
    content: string;
    elementId: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
  }>;
  onComplete?: () => void;
  persistKey?: string;
}

export function OnboardingSequence({ steps, onComplete, persistKey }: OnboardingStepProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  
  // Инициализация последовательности
  useEffect(() => {
    // Если persistKey указан, проверяем, завершена ли уже последовательность
    if (persistKey) {
      const isComplete = localStorage.getItem(`onboarding-${persistKey}-complete`);
      if (isComplete) {
        return;
      }
    }
    
    // Запускаем первый шаг с задержкой
    setTimeout(() => {
      setCurrentStepIndex(0);
    }, 1000);
  }, [persistKey]);
  
  // Обработчик завершения шага
  const handleStepComplete = () => {
    if (currentStepIndex < steps.length - 1) {
      // Переходим к следующему шагу
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Последовательность завершена
      setCurrentStepIndex(-1);
      
      // Сохраняем в localStorage, если указан persistKey
      if (persistKey) {
        localStorage.setItem(`onboarding-${persistKey}-complete`, 'true');
      }
      
      // Вызываем колбэк завершения, если он указан
      if (onComplete) {
        onComplete();
      }
    }
  };
  
  // Если текущий шаг не выбран, ничего не отображаем
  if (currentStepIndex === -1) {
    return null;
  }
  
  const currentStep = steps[currentStepIndex];
  
  // Ищем элемент по ID
  const targetElement = document.getElementById(currentStep.elementId);
  
  // Если элемент не найден, пропускаем шаг
  if (!targetElement) {
    handleStepComplete();
    return null;
  }
  
  // Прокручиваем к элементу с плавной анимацией
  targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
  // Подготавливаем оверлей
  return (
    <>
      {/* Полупрозрачный оверлей на весь экран */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={handleStepComplete} />
      
      {/* Выделение целевого элемента */}
      <div className="fixed z-50 pointer-events-none">
        <div 
          className="absolute bg-white/10 border-2 border-primary animate-pulse rounded-lg"
          style={{
            left: targetElement.getBoundingClientRect().left - 4,
            top: targetElement.getBoundingClientRect().top - 4,
            width: targetElement.offsetWidth + 8,
            height: targetElement.offsetHeight + 8,
          }}
        />
      </div>
      
      {/* Подсказка */}
      <div className="fixed z-50 pointer-events-none">
        <div
          style={{
            left: targetElement.getBoundingClientRect().left,
            top: targetElement.getBoundingClientRect().top,
            width: targetElement.offsetWidth,
            height: targetElement.offsetHeight,
            position: 'absolute',
          }}
        >
          <div className="pointer-events-auto">
            <OnboardingTooltip
              id={`onboarding-step-${currentStepIndex}`}
              title={currentStep.title || `Крок ${currentStepIndex + 1} з ${steps.length}`}
              content={currentStep.content}
              placement={currentStep.placement || 'bottom'}
              forceShow={true}
              onComplete={handleStepComplete}
            >
              <div className="w-0 h-0"></div>
            </OnboardingTooltip>
          </div>
        </div>
      </div>
    </>
  );
}