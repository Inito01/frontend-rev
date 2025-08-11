import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { Container } from './ui/container';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md py-4">
      <Container>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              RevTec Analyzer
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="text-sm text-gray-700">
                  Hola, <span className="font-medium">{user?.name}</span>
                </div>

                <Link
                  to="/history"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Historial
                </Link>

                <Button variant="outline" size="sm" onClick={logout}>
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button size="sm">Iniciar Sesión</Button>
              </Link>
            )}
          </div>
        </div>
      </Container>
    </nav>
  );
}
