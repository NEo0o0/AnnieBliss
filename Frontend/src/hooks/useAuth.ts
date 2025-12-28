import { useState, useEffect } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase/client';
import type { Tables } from '../types/database.types';

type Profile = Tables<'profiles'>;

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (mounted) {
          if (session?.user) {
            const profile = await fetchProfile(session.user.id);
            setAuthState({
              user: session.user,
              profile,
              session,
              loading: false,
              error: null,
            });
          } else {
            setAuthState({
              user: null,
              profile: null,
              session: null,
              loading: false,
              error: null,
            });
          }
        }
      } catch (error) {
        if (mounted) {
          setAuthState({
            user: null,
            profile: null,
            session: null,
            loading: false,
            error: error as AuthError,
          });
        }
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          if (session?.user) {
            const profile = await fetchProfile(session.user.id);
            setAuthState({
              user: session.user,
              profile,
              session,
              loading: false,
              error: null,
            });
          } else {
            setAuthState({
              user: null,
              profile: null,
              session: null,
              loading: false,
              error: null,
            });
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function fetchProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  const signUp = async (options: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    contactInfo: string;
    contactPlatform?: string;
  }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: options.email,
        password: options.password,
        options: {
          data: {
            full_name: options.fullName,
            phone: options.phone,
            contact_info: options.contactInfo,
            contact_platform: options.contactPlatform,
          },
        },
      });

      if (error) throw error;

      // Fetch the created profile
      if (data.user) {
        const profile = await fetchProfile(data.user.id);
        return { data: { ...data, profile }, error: null };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!authState.user) {
      return { data: null, error: new Error('No user logged in') };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', authState.user.id)
        .select()
        .single();

      if (error) throw error;

      setAuthState(prev => ({
        ...prev,
        profile: data,
      }));

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isAuthenticated: !!authState.user,
    isAdmin: authState.profile?.role === 'admin',
    isInstructor: authState.profile?.role === 'instructor',
    isMember: authState.profile?.role === 'member',
  };
}
