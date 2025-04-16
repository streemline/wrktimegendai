import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { dictionaries, Dictionary, SupportedLanguage, getLanguageName } from '../translations';
import { useLocalStorage } from './use-local-storage';

// Контекст для переводов
interface TranslationContextType {
  t: Dictionary;
  currentLanguage: SupportedLanguage;
  changeLanguage: (lang: SupportedLanguage) => void;
  availableLanguages: { code: SupportedLanguage; name: string }[];
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Провайдер контекста
export function TranslationProvider({ children }: { children: ReactNode }) {
  // Получаем текущий язык из localStorage или используем украинский по умолчанию
  const [currentLanguage, setCurrentLanguage] = useLocalStorage<SupportedLanguage>('language', 'uk');
  
  // Получаем соответствующий словарь
  const [translations, setTranslations] = useState<Dictionary>(dictionaries[currentLanguage]);
  
  // Список доступных языков для выбора
  const availableLanguages = [
    { code: 'uk' as SupportedLanguage, name: getLanguageName('uk') },
    { code: 'cs' as SupportedLanguage, name: getLanguageName('cs') },
    { code: 'ru' as SupportedLanguage, name: getLanguageName('ru') },
  ];

  // При изменении языка обновляем словарь
  useEffect(() => {
    setTranslations(dictionaries[currentLanguage]);
  }, [currentLanguage]);

  // Функция для изменения языка
  const changeLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
  };

  return (
    <TranslationContext.Provider
      value={{
        t: translations,
        currentLanguage,
        changeLanguage,
        availableLanguages
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

// Хук для использования переводов в компонентах
export function useTranslations() {
  const context = useContext(TranslationContext);
  
  if (context === undefined) {
    throw new Error('useTranslations must be used within a TranslationProvider');
  }
  
  return context;
}