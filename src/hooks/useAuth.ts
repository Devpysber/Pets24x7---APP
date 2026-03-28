import { useMemo, useCallback, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { UserRole } from '../types';
import { userApi } from '../api/user.api';

export const useAuth = () => {
  const { user, userRole, setUserRole, setUser } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = useMemo(() => userRole === 'admin', [userRole]);
  const isVendor = useMemo(() => userRole === 'vendor', [userRole]);
  const isUser = useMemo(() => userRole === 'user', [userRole]);

  const login = useCallback(async (email: string, pass: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user: userData, token } = await userApi.login(email, pass);
      localStorage.setItem('auth_token', token);
      setUser(userData);
      setUserRole(userData.role);
      return userData;
    } catch (err) {
      setError('Invalid email or password.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setUser, setUserRole]);

  const switchRole = useCallback((role: UserRole) => {
    setUserRole(role);
  }, [setUserRole]);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setUserRole('user');
  }, [setUser, setUserRole]);

  return {
    user,
    userRole,
    isAdmin,
    isVendor,
    isUser,
    isLoading,
    error,
    login,
    switchRole,
    logout,
  };
};
