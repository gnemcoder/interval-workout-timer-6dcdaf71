
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { validatePasswordStrength, checkPasswordBreached } from "@/utils/passwordUtils";
import { AlertTriangle } from "lucide-react";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [passwordFeedback, setPasswordFeedback] = useState<string[]>([]);
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);
  const [breachInfo, setBreachInfo] = useState<{ isBreached: boolean; count?: number } | null>(null);
  const navigate = useNavigate();

  const handlePasswordChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    // Only perform validation for signup and when password has some content
    if (mode === "signup" && newPassword.length > 0) {
      // Check password strength
      const { feedback } = validatePasswordStrength(newPassword);
      setPasswordFeedback(feedback);
      
      // Debounce the breach check to avoid too many API calls
      if (newPassword.length >= 8) {
        setIsCheckingPassword(true);
        
        const timeoutId = setTimeout(async () => {
          const result = await checkPasswordBreached(newPassword);
          setBreachInfo(result.isBreached ? result : null);
          setIsCheckingPassword(false);
        }, 800);
        
        return () => clearTimeout(timeoutId);
      } else {
        setBreachInfo(null);
      }
    } else {
      setPasswordFeedback([]);
      setBreachInfo(null);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For signup, perform final password validation
      if (mode === "signup") {
        const { isStrong, feedback } = validatePasswordStrength(password);
        if (!isStrong) {
          setPasswordFeedback(feedback);
          toast.error("Please use a stronger password");
          setIsLoading(false);
          return;
        }
        
        // Final breach check
        const breachCheck = await checkPasswordBreached(password);
        if (breachCheck.isBreached) {
          setBreachInfo(breachCheck);
          toast.error("This password appears in data breaches. Please choose a different one.");
          setIsLoading(false);
          return;
        }
      }
      
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
            onChange={handlePasswordChange}
            required
            className="w-full bg-spotify-darkgray text-white border-spotify-gray"
            placeholder="••••••••"
            minLength={6}
          />
          
          {/* Password feedback for signup */}
          {mode === "signup" && passwordFeedback.length > 0 && (
            <div className="mt-2 space-y-1">
              {passwordFeedback.map((feedback, index) => (
                <p key={index} className="text-xs text-amber-500 flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {feedback}
                </p>
              ))}
            </div>
          )}
          
          {/* Breach information */}
          {breachInfo?.isBreached && (
            <div className="mt-2 bg-red-900/30 border border-red-500/50 rounded p-2">
              <p className="text-xs text-red-400 flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" />
                This password appears in {breachInfo.count?.toLocaleString()} data breaches and should not be used.
              </p>
            </div>
          )}
          
          {isCheckingPassword && (
            <p className="text-xs text-spotify-lightgray mt-1">Checking password security...</p>
          )}
        </div>
        
        <Button
          type="submit"
          className="w-full py-6 bg-spotify-green hover:bg-spotify-green/90 text-black font-medium text-lg"
          disabled={isLoading || (mode === "signup" && (passwordFeedback.length > 0 || isCheckingPassword || breachInfo?.isBreached))}
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
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setPasswordFeedback([]);
            setBreachInfo(null);
          }}
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
