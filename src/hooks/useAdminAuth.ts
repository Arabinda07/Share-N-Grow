import { useState, useEffect } from 'react';
import { supabase, hasSupabaseConfig } from '../lib/supabase';
import { api } from '../lib/api';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [requiresPasswordUpdate, setRequiresPasswordUpdate] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      if (!hasSupabaseConfig) {
        setIsCheckingAuth(false);
        return;
      }

      // Intercept hash token for recovery
      if (window.location.hash.includes('type=recovery')) {
        setRequiresPasswordUpdate(true);
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await verifyAdminAccess(session.user.id);
      } else {
        setIsCheckingAuth(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setRequiresPasswordUpdate(true);
      }
    });

    return () => subscription.unsubscribe();
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

  const resetPassword = async (email: string) => {
    setAuthError(null);
    try {
      const isAdmin = await api.checkAdminEmailExists(email);
      if (!isAdmin) {
        setAuthError("Email is not registered as an admin.");
        return false;
      }
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/admin',
      });
      if (error) {
        setAuthError(error.message);
        return false;
      }
      return true;
    } catch (err) {
      setAuthError("Failed to send reset email.");
      return false;
    }
  };

  const updatePassword = async (newPassword: string) => {
    setAuthError(null);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setAuthError(error.message);
        return false;
      }
      return true;
    } catch (err) {
      setAuthError("Failed to update password.");
      return false;
    }
  };

  return {
    isAuthenticated,
    isCheckingAuth,
    authError,
    setAuthError,
    requiresPasswordUpdate,
    setRequiresPasswordUpdate,
    signIn,
    signOut,
    resetPassword,
    updatePassword
  };
}
