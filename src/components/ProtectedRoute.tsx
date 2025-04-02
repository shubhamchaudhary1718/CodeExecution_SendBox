
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  // Use Navigate component instead of useNavigate hook
  if (!isLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-editor-bg">
        <LoadingSpinner size={48} text="Authenticating..." />
      </div>
    );
  }

  return <>{children}</>;
}
