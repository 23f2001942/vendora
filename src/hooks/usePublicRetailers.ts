import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PublicRetailer {
  id: string;
  business_name: string;
  business_address: string;
  is_active: boolean;
  user_id: string;
  profiles: {
    full_name: string;
    avatar_url: string | null;
  } | null;
  retailer_products: Array<{
    id: string;
  }>;
}

export const usePublicRetailers = (searchQuery?: string) => {
  return useQuery({
    queryKey: ["public-retailers", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("retailers")
        .select(`
          id,
          business_name,
          business_address,
          is_active,
          user_id,
          profiles (
            full_name,
            avatar_url
          ),
          retailer_products (
            id
          )
        `)
        .eq("is_active", true)
        .order("business_name");

      if (searchQuery) {
        query = query.ilike("business_name", `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as PublicRetailer[];
    },
  });
};

export const usePublicRetailerDetail = (retailerId: string) => {
  return useQuery({
    queryKey: ["public-retailer", retailerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("retailers")
        .select(`
          id,
          business_name,
          business_address,
          is_active,
          user_id,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .eq("id", retailerId)
        .single();

      if (error) throw error;
      return data as PublicRetailer;
    },
    enabled: !!retailerId,
  });
};

export const usePublicRetailerProducts = (retailerId: string, category?: string) => {
  return useQuery({
    queryKey: ["public-retailer-products", retailerId, category],
    queryFn: async () => {
      let query = supabase
        .from("retailer_products")
        .select(`
          id,
          price,
          stock_quantity,
          is_available,
          retailer_id,
          products (
            id,
            name,
            description,
            image_url,
            category,
            base_price
          )
        `)
        .eq("retailer_id", retailerId)
        .eq("is_available", true)
        .gt("stock_quantity", 0);

      const { data, error } = await query;

      if (error) throw error;

      // Filter by category if specified
      if (category && category !== "all") {
        return data.filter((item: any) => item.products?.category === category);
      }

      return data;
    },
    enabled: !!retailerId,
  });
};
