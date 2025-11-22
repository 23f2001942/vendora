import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useRecentPurchasedProducts = () => {
  return useQuery({
    queryKey: ["recent-purchased-products"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("order_items")
        .select(`
          id,
          quantity,
          unit_price,
          order_id,
          orders!inner(
            id,
            order_number,
            created_at,
            status,
            seller_id
          ),
          products(
            id,
            name,
            description,
            image_url,
            category
          ),
          feedback:feedback(
            id,
            rating,
            comment
          )
        `)
        .eq("orders.buyer_id", user.id)
        .eq("orders.status", "delivered")
        .order("orders(created_at)", { ascending: false })
        .limit(6);

      if (error) throw error;
      return data;
    },
  });
};
