
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  // Function to check if user is admin using the new metadata function
  const checkUserRole = async (userId: string) => {
    try {
      console.log('Checking role for user:', userId);
      
      // Use the new function that doesn't cause recursion
      const { data, error } = await supabase.rpc('get_user_role_from_metadata');
      
      if (error) {
        console.error('Error fetching user role:', error);
        return;
      }
      
      const isUserAdmin = data === 'admin';
      console.log('User role data:', data, 'Is admin:', isUserAdmin);
      setIsAdmin(isUserAdmin);
    } catch (error) {
      console.error('Failed to check user role:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);

        if (currentSession?.user) {
          // Defer Supabase calls to avoid deadlocks
          setTimeout(() => {
            checkUserRole(currentSession.user.id);
          }, 0);
        } else {
          setIsAdmin(false); // Reset admin status when logged out
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);

      if (currentSession?.user) {
        // Check user role
        checkUserRole(currentSession.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function signIn(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "An error occurred during sign in.",
        variant: "destructive",
      });
      throw error;
    }
  }

  async function signUp(email: string, password: string, fullName: string) {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created",
        description: "Please check your email for verification.",
      });
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "An error occurred during sign up.",
        variant: "destructive",
      });
      throw error;
    }
  }

  async function signOut() {
    try {
      // Clear local state immediately
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      
      // Attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      // Only show error if it's not a session-related error
      if (error && !error.message.includes('session') && !error.message.includes('Session')) {
        console.error('Sign out error:', error);
        toast({
          title: "Sign out warning",
          description: "You have been signed out locally, but there was an issue with the server.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signed out",
          description: "You have been successfully signed out.",
        });
      }
    } catch (error: any) {
      // Even if logout fails on server, we've cleared local state
      console.error('Sign out error:', error);
      toast({
        title: "Signed out",
        description: "You have been signed out locally.",
      });
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
