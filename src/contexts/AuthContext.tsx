
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: { username: string; full_name: string }) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event, newSession);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log("Initial session:", initialSession);
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Signing in with:", email);
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      console.log("Sign in result:", error, data);
      
      if (error) {
        toast({ 
          title: "Sign in failed", 
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }
      
      toast({
        title: "Signed in successfully",
        description: "Welcome back!",
      });
      
      return { error: null };
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({ 
        title: "Sign in failed", 
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: { username: string; full_name: string }) => {
    try {
      console.log("Signing up with:", email, userData);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: userData.username,
            full_name: userData.full_name,
          },
        },
      });

      if (error) {
        toast({ 
          title: "Sign up failed", 
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      toast({
        title: "Sign up successful!",
        description: "Please check your email for verification (if enabled).",
      });
      
      return { error: null };
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({ 
        title: "Sign up failed", 
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({ 
        title: "Sign out failed", 
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
