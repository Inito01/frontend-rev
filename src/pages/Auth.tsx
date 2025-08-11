import { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Container } from '../components/ui/container';

export function Auth() {
  const [view, setView] = useState<'login' | 'register'>('login');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSuccess = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Container className="max-w-md">
        {view === 'login' ? (
          <LoginForm
            onSuccess={handleSuccess}
            onRegisterClick={() => setView('register')}
          />
        ) : (
          <RegisterForm
            onSuccess={handleSuccess}
            onLoginClick={() => setView('login')}
          />
        )}
      </Container>
    </div>
  );
}
