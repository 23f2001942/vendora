import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Address {
  id: string;
  user_id: string;
  label: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude?: number;
  longitude?: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export const useAddresses = () => {
  const queryClient = useQueryClient();

  const { data: addresses, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_addresses")
        .select("*")
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Address[];
    },
  });

  const createAddress = useMutation({
    mutationFn: async (address: Omit<Address, "id" | "user_id" | "created_at" | "updated_at">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // If this is set as default, unset other defaults first
      if (address.is_default) {
        await supabase
          .from("customer_addresses")
          .update({ is_default: false })
          .eq("user_id", user.id);
      }

      const { error } = await supabase.from("customer_addresses").insert({
        ...address,
        user_id: user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add address");
      console.error(error);
    },
  });

  const updateAddress = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Address> & { id: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // If this is set as default, unset other defaults first
      if (updates.is_default) {
        await supabase
          .from("customer_addresses")
          .update({ is_default: false })
          .eq("user_id", user.id)
          .neq("id", id);
      }

      const { error } = await supabase
        .from("customer_addresses")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address updated successfully");
    },
    onError: () => {
      toast.error("Failed to update address");
    },
  });

  const deleteAddress = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("customer_addresses")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete address");
    },
  });

  return {
    addresses,
    isLoading,
    createAddress,
    updateAddress,
    deleteAddress,
    defaultAddress: addresses?.find(a => a.is_default),
  };
};
