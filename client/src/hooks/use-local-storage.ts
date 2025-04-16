import { useState, useEffect } from 'react';

// Тип для функции-сеттера
type SetValue<T> = (value: T | ((prevValue: T) => T)) => void;

// Хук для работы с localStorage
export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  // Создаем состояние для хранения значения
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Получаем значение из localStorage
      const item = window.localStorage.getItem(key);
      // Парсим JSON или возвращаем initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Возвращаем функцию для обновления значения
  const setValue: SetValue<T> = (value) => {
    try {
      // Позволяем передавать функцию для обновления состояния
      const valueToStore = typeof value === 'function' 
        ? (value as (prevValue: T) => T)(storedValue) 
        : value;
      
      // Сохраняем в состоянии React
      setStoredValue(valueToStore);
      
      // Сохраняем в localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Используем useEffect для синхронизации с другими компонентами
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage value:`, error);
        }
      }
    };
    
    // Слушаем события storage для синхронизации между вкладками
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}