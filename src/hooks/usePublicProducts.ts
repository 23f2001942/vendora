import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePublicProducts = (category: string = 'all', searchTerm: string = '') => {
  return useQuery({
    queryKey: ['public-products', category, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('retailer_products')
        .select(`
          *,
          product:products(*),
          retailer:retailers(id, business_name, address)
        `)
        .eq('is_available', true);
      
      const { data, error } = await query;
      
      if (error) throw error;

      // Filter in memory for category and search
      let filtered = data || [];
      
      if (category !== 'all') {
        filtered = filtered.filter(item => item.product?.category === category);
      }
      
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        filtered = filtered.filter(item => 
          item.product?.name?.toLowerCase().includes(search) ||
          item.product?.description?.toLowerCase().includes(search)
        );
      }
      
      return filtered;
    }
  });
};
