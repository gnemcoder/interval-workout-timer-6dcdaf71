
import AuthForm from "@/components/auth/AuthForm";

export default function Auth() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-8">
      <AuthForm />
      
      <footer className="mt-8 text-xs text-gray-600">
        <p>© {new Date().getFullYear()} Stride Sync. All rights reserved.</p>
      </footer>
    </div>
  );
}
