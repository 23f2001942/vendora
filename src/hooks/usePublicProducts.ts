import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PublicProduct {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  category: string;
  base_price: number;
  retailer_products: Array<{
    id: string;
    price: number;
    stock_quantity: number;
    is_available: boolean;
    retailer_id: string;
    retailers: {
      id: string;
      business_name: string;
      business_address: string;
    };
  }>;
}

export const usePublicProducts = (category?: string, searchQuery?: string) => {
  return useQuery({
    queryKey: ["public-products", category, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select(`
          id,
          name,
          description,
          image_url,
          category,
          base_price,
          retailer_products (
            id,
            price,
            stock_quantity,
            is_available,
            retailer_id,
            retailers (
              id,
              business_name,
              business_address
            )
          )
        `)
        .order("name");

      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Filter by category after fetching (to avoid type issues)
      let filteredData = data as PublicProduct[];
      if (category && category !== "all") {
        filteredData = filteredData.filter((product) => product.category === category);
      }

      // Filter products that have at least one available retailer
      return filteredData.filter(
        (product) => product.retailer_products && product.retailer_products.length > 0
      );
    },
  });
};

export const usePublicProductDetail = (productId: string) => {
  return useQuery({
    queryKey: ["public-product", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          description,
          image_url,
          category,
          base_price,
          retailer_products (
            id,
            price,
            stock_quantity,
            is_available,
            retailer_id,
            retailers (
              id,
              business_name,
              business_address,
              user_id
            )
          )
        `)
        .eq("id", productId)
        .single();

      if (error) throw error;
      return data as PublicProduct;
    },
    enabled: !!productId,
  });
};
