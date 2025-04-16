import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorAnimationProps {
  show: boolean;
  message: string;
  onClose?: () => void;
}

export function ErrorAnimation({ show, message, onClose }: ErrorAnimationProps) {
  const [isVisible, setIsVisible] = useState(show);
  
  useEffect(() => {
    setIsVisible(show);
    
    if (show) {
      // Автоматически скрываем уведомление через 5 секунд
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);
  
  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-destructive text-white py-2 px-4 rounded-lg shadow-lg z-50 max-w-md w-full flex items-center"
        >
          <motion.div 
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -15, 15, -15, 15, -15, 15, 0] }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mr-3 flex-shrink-0"
          >
            <AlertTriangle className="h-6 w-6" />
          </motion.div>
          
          <div className="flex-1">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-medium"
            >
              {message}
            </motion.p>
          </div>
          
          <Button 
            size="icon" 
            variant="ghost" 
            className="ml-2 text-white hover:bg-white/20 flex-shrink-0"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useErrorAnimation() {
  const [errorState, setErrorState] = useState({
    show: false,
    message: ''
  });
  
  const showError = (message: string) => {
    setErrorState({ show: true, message });
  };
  
  const hideError = () => {
    setErrorState({ show: false, message: '' });
  };
  
  const ErrorComponent = () => (
    <ErrorAnimation 
      show={errorState.show} 
      message={errorState.message} 
      onClose={hideError} 
    />
  );
  
  return {
    showError,
    hideError,
    ErrorComponent
  };
}