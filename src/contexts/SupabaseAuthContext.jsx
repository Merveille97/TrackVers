import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId) => {
    if (!userId) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, full_name, email')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.warn('Error fetching profile:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      return null;
    }
  }, []);

  const handleAuthChange = useCallback(async (currentSession) => {
    setSession(currentSession);
    const currentUser = currentSession?.user;

    if (currentUser) {
      const userProfile = await fetchProfile(currentUser.id);
      setUser(currentUser);
      setProfile(userProfile);
    } else {
      setUser(null);
      setProfile(null);
    }
    setLoading(false);
  }, [fetchProfile]);

  useEffect(() => {
    setLoading(true);
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      handleAuthChange(currentSession);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        handleAuthChange(currentSession);
      }
    );

    return () => subscription.unsubscribe();
  }, [handleAuthChange]);
  
  const augmentedUser = useMemo(() => {
    if (!user) return null;
    // Augment the user object with the role from the profile table.
    // If profile.role is '' (empty string), the || operator will treat it as falsy and use 'user'.
    // This aligns with the requirement to store '' in DB but use 'user' as default in app.
    const role = profile?.role || 'user';
    return {
      ...user,
      role: role,
      full_name: profile?.full_name || user.user_metadata?.full_name || '',
    };
  }, [user, profile]);

  const signUp = useCallback(async (email, password, options) => {
    // Ensure metadata has no nulls before sending
    const cleanOptions = {
      ...options,
      data: {
        ...options?.data,
        full_name: options?.data?.full_name || '',
        role: options?.data?.role || 'user',
      }
    };

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: cleanOptions,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign up Failed",
        description: error.message || "Something went wrong",
      });
    }
    return { data, error };
  }, [toast]);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign in Failed",
        description: error.message || "Something went wrong",
      });
    }
    return { data, error };
  }, [toast]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign out Failed",
        description: error.message || "Something went wrong",
      });
    } else {
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    }
    return { error };
  }, [toast]);

  const value = useMemo(() => ({
    user: augmentedUser,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  }), [augmentedUser, session, loading, signUp, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};