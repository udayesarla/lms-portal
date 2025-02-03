import React, { useEffect, useState } from 'react';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserDashboard } from './pages/UserDashboard';
import { User } from './types';
import { supabase } from './lib/supabase';

function App() {
  const [authState, setAuthState] = useState<{
    user: User | null;
    isAuthenticated: boolean;
  }>({
    user: null,
    isAuthenticated: false,
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check active sessions and sets up an auth state listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setAuthState({
          user: {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata.full_name || 'User',
            role: session.user.user_metadata.role || 'user',
          },
          isAuthenticated: true,
        });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuthState({
          user: {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata.full_name || 'User',
            role: session.user.user_metadata.role || 'user',
          },
          isAuthenticated: true,
        });
      } else {
        setAuthState({ user: null, isAuthenticated: false });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      setError(null);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message === 'Invalid login credentials') {
          setError('Invalid email or password. Please try again.');
        } else {
          setError(signInError.message);
        }
      }
    } catch (error: any) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Error logging in:', error);
    }
  };

  const handleRegister = async (email: string, password: string, fullName: string, role: 'admin' | 'user') => {
    try {
      setError(null);
      setSuccessMessage(null);

      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data?.user) {
        setSuccessMessage(
          'Registration successful! You can now log in with your credentials.'
        );
        setIsRegistering(false);
        // Clear the success message after 5 seconds
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    } catch (error: any) {
      if (error.message.includes('duplicate')) {
        setError('An account with this email already exists.');
      } else {
        setError(error.message || 'An error occurred during registration.');
      }
      console.error('Error registering:', error);
    }
  };

  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="max-w-4xl w-full px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Learning Management System</h1>
            <p className="text-gray-600">
              {isRegistering ? 'Create your account' : 'Sign in to access your learning dashboard'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}

          {isRegistering ? (
            <>
              <div className="flex flex-col md:flex-row gap-8 justify-center">
                <RegisterForm type="user" onSubmit={handleRegister} />
                <div className="hidden md:block w-px bg-gray-300"></div>
                <RegisterForm type="admin" onSubmit={handleRegister} />
              </div>
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    setIsRegistering(false);
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col md:flex-row gap-8 justify-center">
                <LoginForm type="user" onSubmit={handleLogin} />
                <div className="hidden md:block w-px bg-gray-300"></div>
                <LoginForm type="admin" onSubmit={handleLogin} />
              </div>
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    setIsRegistering(true);
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Don't have an account? Register
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return authState.user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
}

export default App;