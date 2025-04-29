import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Define the auth context type
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: { username: string; password: string; email: string; name?: string }) => Promise<void>;
  logout: () => Promise<void>;
  loginModalOpen: boolean;
  registerModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openRegisterModal: () => void;
  closeRegisterModal: () => void;
}

// Create the auth context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [registerModalOpen, setRegisterModalOpen] = useState<boolean>(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/auth/me', { 
          credentials: 'include'
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Login function
  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiRequest("POST", "/api/auth/login", { username, password });
      const userData = await response.json();
      
      setUser(userData);
      
      // Invalidate queries that might depend on authentication state
      queryClient.invalidateQueries();
      
      return userData;
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Register function
  const register = async (userData: { username: string; password: string; email: string; name?: string }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiRequest("POST", "/api/auth/register", userData);
      const registeredUser = await response.json();
      
      setUser(registeredUser);
      
      // Invalidate queries that might depend on authentication state
      queryClient.invalidateQueries();
      
      return registeredUser;
    } catch (err: any) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      await apiRequest("POST", "/api/auth/logout");
      setUser(null);
      
      // Clear all queries in the cache
      queryClient.clear();
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (err: any) {
      setError(err.message || "Logout failed");
      toast({
        title: "Logout failed",
        description: err.message || "An error occurred during logout.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Modal control functions
  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => setLoginModalOpen(false);
  const openRegisterModal = () => setRegisterModalOpen(true);
  const closeRegisterModal = () => setRegisterModalOpen(false);
  
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    loginModalOpen,
    registerModalOpen,
    openLoginModal,
    closeLoginModal,
    openRegisterModal,
    closeRegisterModal,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
