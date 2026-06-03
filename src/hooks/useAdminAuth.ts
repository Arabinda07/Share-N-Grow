import { useState, useEffect } from 'react';
import { supabase, hasSupabaseConfig } from '../lib/supabase';
import { api } from '../lib/api';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      if (!hasSupabaseConfig) {
        setIsCheckingAuth(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await verifyAdminAccess(session.user.id);
      } else {
        setIsCheckingAuth(false);
      }
    };

    checkSession();
  }, []);

  const verifyAdminAccess = async (userId: string) => {
    try {
      const { data, error } = await api.verifyAdminAccess(userId);
        
      if (error || !data) {
        console.error("Admin verification failed:", error);
        setAuthError("Account does not have admin privileges.");
        await supabase.auth.signOut();
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error("Error verifying admin status:", err);
      setAuthError("An error occurred during verification.");
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setAuthError(null);
    setIsCheckingAuth(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthError(error.message);
        setIsCheckingAuth(false);
        return false;
      }

      if (data.user) {
        await verifyAdminAccess(data.user.id);
        return true;
      }
      return false;
    } catch (err) {
      setAuthError("Failed to sign in.");
      setIsCheckingAuth(false);
      return false;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isCheckingAuth,
    authError,
    signIn,
    signOut
  };
}
