
import { useAuth } from "./auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { History, LogOut } from "lucide-react";

export default function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="w-full bg-spotify-black border-b border-spotify-gray/30 py-4 px-6">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <h1 
            className="text-xl font-bold text-white cursor-pointer"
            onClick={() => navigate("/")}
          >
            Stride Sync
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button 
                variant="ghost" 
                className="text-spotify-lightgray hover:text-white hover:bg-spotify-darkgray"
                onClick={() => navigate("/history")}
              >
                <History className="mr-2 h-4 w-4" />
                History
              </Button>
              
              <Button 
                variant="ghost" 
                className="text-spotify-lightgray hover:text-white hover:bg-spotify-darkgray"
                onClick={() => signOut()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => navigate("/auth")}
              className="bg-spotify-green hover:bg-spotify-green/90 text-black"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
