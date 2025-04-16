import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { database, comparePasswords } from '../database/db';
import { User } from '../database/schema';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: User) => Promise<boolean>;
  updateProfile: (userId: number, data: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for saved session on load
  useEffect(() => {
    const checkSavedUser = async () => {
      try {
        // In a real app, you'd use AsyncStorage to persist the logged-in user
        // For this demo, we'll just use the default user
        const defaultUser = await database.getUserByUsername("demo");
        if (defaultUser) {
          setUser(defaultUser);
        }
      } catch (e) {
        console.error('Error loading saved user:', e);
      } finally {
        setIsLoading(false);
      }
    };

    checkSavedUser();
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const foundUser = await database.getUserByUsername(username);
      
      if (!foundUser) {
        setError('User not found');
        return false;
      }
      
      const isPasswordValid = await comparePasswords(password, foundUser.password);
      
      if (!isPasswordValid) {
        setError('Invalid password');
        return false;
      }
      
      setUser(foundUser);
      // In a real app, save the user to AsyncStorage here
      return true;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    // In a real app, clear AsyncStorage here
  };

  // Register function
  const register = async (userData: User): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const existingUser = await database.getUserByUsername(userData.username);
      
      if (existingUser) {
        setError('Username already taken');
        return false;
      }
      
      const newUser = await database.createUser(userData);
      setUser(newUser);
      // In a real app, save the user to AsyncStorage here
      return true;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (userId: number, data: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedUser = await database.updateUser(userId, data);
      
      if (updatedUser) {
        setUser(updatedUser);
        // In a real app, update AsyncStorage here
        return true;
      } else {
        setError('Failed to update profile');
        return false;
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        error, 
        login, 
        logout, 
        register,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}