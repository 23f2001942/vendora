import { useAuth } from '@/contexts/AuthContext';

export const useOptionalAuth = () => {
  const { user, roles, loading } = useAuth();
  
  return { 
    user, 
    roles, 
    loading,
    isAuthenticated: !!user,
    isCustomer: roles.includes('customer'),
    isRetailer: roles.includes('retailer'),
    isWholesaler: roles.includes('wholesaler')
  };
};
