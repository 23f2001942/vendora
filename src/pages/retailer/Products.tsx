import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAuth } from "@/contexts/AuthContext";
import { CategoryTabs } from "@/components/shared/CategoryTabs";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockBadge } from "@/components/shared/StockBadge";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const Products = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useRequireAuth("retailer");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const queryClient = useQueryClient();

  const { data: retailer } = useQuery({
    queryKey: ["retailer-profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("retailers")
        .select("*")
        .eq("user_id", user?.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["my-retailer-products", retailer?.id, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("retailer_products")
        .select("*, products(*)")
        .eq("retailer_id", retailer?.id);

      if (selectedCategory !== "all") {
        query = query.eq("products.category", selectedCategory as any);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!retailer,
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from("retailer_products")
        .delete()
        .eq("id", productId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-retailer-products"] });
      toast.success("Product removed from your store");
    },
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/retailer/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold text-foreground">My Products</h1>
          </div>
          <Button onClick={() => navigate("/retailer/wholesalers")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Products
          </Button>
        </div>

        <div className="mb-6">
          <CategoryTabs selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{product.products.name}</CardTitle>
                  <Badge className="w-fit">{product.products.category}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <PriceDisplay price={product.price} className="text-xl text-primary" />
                  </div>
                  <StockBadge stockQuantity={product.stock_quantity} isAvailable={product.is_available} />
                  <div className="mt-4 space-y-2">
                    <Button variant="outline" className="w-full">Edit</Button>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => deleteMutation.mutate(product.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Products Yet"
            description="Browse wholesalers to add products to your store."
            actionLabel="Browse Wholesalers"
            onAction={() => navigate("/retailer/wholesalers")}
          />
        )}
      </div>
    </div>
  );
};

export default Products;
