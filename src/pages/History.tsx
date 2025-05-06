
import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import Header from "@/components/Header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Play, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface SessionData {
  id: string;
  created_at: string;
  iterations: number;
  run_seconds: number;
  rest_seconds: number;
  total_time: number;
  actual_run_time: number;
  actual_rest_time: number;
}

export default function History() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isDeletingSession, setIsDeletingSession] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  const fetchSessions = async () => {
    if (user) {
      try {
        setIsLoadingSessions(true);
        const { data, error } = await supabase
          .from("sessions")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching sessions:", error);
          toast.error("Could not load your workout history");
          return;
        }

        setSessions(data || []);
      } catch (error) {
        console.error("Error in sessions query:", error);
        toast.error("Something went wrong loading your workouts");
      } finally {
        setIsLoadingSessions(false);
      }
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [user]);

  // Format time in mm:ss format
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!user) return;
    
    try {
      setIsDeletingSession(sessionId);
      const { error } = await supabase
        .from("sessions")
        .delete()
        .eq("id", sessionId);

      if (error) {
        console.error("Error deleting session:", error);
        toast.error("Failed to delete the workout session");
        return;
      }

      // Update the local state to remove the deleted session
      setSessions(sessions.filter(session => session.id !== sessionId));
      toast.success("Workout session deleted");
    } catch (error) {
      console.error("Error in delete operation:", error);
      toast.error("Something went wrong when deleting the session");
    } finally {
      setIsDeletingSession(null);
    }
  };

  if (isLoading || (!user && !isLoading)) {
    return null; // Don't render anything if loading or not authenticated
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-screen-xl mx-auto w-full px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Your Workout History</h1>
        
        {isLoadingSessions ? (
          <div className="text-center py-8">
            <p className="text-spotify-lightgray">Loading your sessions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12 border border-spotify-gray/30 rounded-lg">
            <p className="text-spotify-lightgray text-xl">You haven't completed any workouts yet.</p>
            <button 
              onClick={() => navigate("/")}
              className="mt-4 px-6 py-3 bg-spotify-green hover:bg-spotify-green/90 text-black rounded-full font-medium"
            >
              <Play className="inline mr-2" size={16} />
              Start your first workout
            </button>
          </div>
        ) : (
          <div className="border border-spotify-gray/30 rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-spotify-darkgray">
                <TableRow>
                  <TableHead className="text-white">Date</TableHead>
                  <TableHead className="text-white">Rounds</TableHead>
                  <TableHead className="text-white">Run/Rest</TableHead>
                  <TableHead className="text-white">Total Time</TableHead>
                  <TableHead className="text-white">Work Time</TableHead>
                  <TableHead className="text-white">Rest Time</TableHead>
                  <TableHead className="text-white w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id} className="hover:bg-spotify-black/50">
                    <TableCell className="text-white">
                      {new Date(session.created_at).toLocaleDateString()} 
                      <span className="block text-xs text-spotify-lightgray">
                        {formatDistanceToNow(new Date(session.created_at), { addSuffix: true })}
                      </span>
                    </TableCell>
                    <TableCell className="text-white">{session.iterations}×</TableCell>
                    <TableCell className="text-white">
                      {formatTime(session.run_seconds)} / {formatTime(session.rest_seconds)}
                    </TableCell>
                    <TableCell className="text-white">{formatTime(session.total_time)}</TableCell>
                    <TableCell className="text-white">{formatTime(session.actual_run_time)}</TableCell>
                    <TableCell className="text-white">{formatTime(session.actual_rest_time)}</TableCell>
                    <TableCell className="text-white">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-red-500/20 text-gray-400 hover:text-red-500"
                        onClick={() => handleDeleteSession(session.id)}
                        disabled={isDeletingSession === session.id}
                      >
                        <Trash2 size={18} />
                        <span className="sr-only">Delete workout</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
      
      <footer className="py-6 text-center text-xs text-gray-600">
        <p>© {new Date().getFullYear()} Stride Sync. All rights reserved.</p>
      </footer>
    </div>
  );
}
