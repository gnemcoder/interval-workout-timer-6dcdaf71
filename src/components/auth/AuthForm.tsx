
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      
      if (mode === "signin") {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      } else {
        result = await supabase.auth.signUp({
          email,
          password,
        });
      }

      if (result.error) {
        toast.error(result.error.message);
      } else {
        toast.success(mode === "signin" ? "Signed in successfully!" : "Account created successfully!");
        navigate("/");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-spotify-black rounded-2xl border border-spotify-gray/30 shadow-lg">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        {mode === "signin" ? "Sign In" : "Create Account"}
      </h2>
      
      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm text-spotify-lightgray mb-1">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-spotify-darkgray text-white border-spotify-gray"
            placeholder="your@email.com"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm text-spotify-lightgray mb-1">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-spotify-darkgray text-white border-spotify-gray"
            placeholder="••••••••"
            minLength={6}
          />
        </div>
        
        <Button
          type="submit"
          className="w-full py-6 bg-spotify-green hover:bg-spotify-green/90 text-black font-medium text-lg"
          disabled={isLoading}
        >
          {isLoading
            ? "Please wait..."
            : mode === "signin"
            ? "Sign In"
            : "Create Account"}
        </Button>
      </form>
      
      <div className="mt-4 text-center">
        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="text-spotify-green hover:underline text-sm"
        >
          {mode === "signin"
            ? "Don't have an account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
