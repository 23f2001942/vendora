import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAuth } from "@/contexts/AuthContext";
import { CategoryTabs } from "@/components/shared/CategoryTabs";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StockBadge } from "@/components/shared/StockBadge";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";

const WholesalerProducts = () => {
  const { wholesalerId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useRequireAuth("retailer");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [retailPrice, setRetailPrice] = useState("");
  const [stockQty, setStockQty] = useState("");
  const queryClient = useQueryClient();

  const { data: wholesaler } = useQuery({
    queryKey: ["wholesaler", wholesalerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wholesalers")
        .select("*")
        .eq("id", wholesalerId)
        .single();
      if (error) throw error;
      return data;
    },
  });

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
    queryKey: ["wholesaler-products", wholesalerId, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("wholesaler_products")
        .select("*, products(*)")
        .eq("wholesaler_id", wholesalerId)
        .eq("is_available", true);

      if (selectedCategory !== "all") {
        query = query.eq("products.category", selectedCategory as any);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data?.filter((item) => item.products !== null) || [];
    },
  });

  const addToStoreMutation = useMutation({
    mutationFn: async (data: { productId: string; price: number; stockQty: number }) => {
      const { error } = await supabase.from("retailer_products").insert({
        retailer_id: retailer?.id,
        product_id: data.productId,
        price: data.price,
        stock_quantity: data.stockQty,
        is_available: true,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-retailer-products"] });
      toast.success("Product added to your store");
      setSelectedProduct(null);
      setRetailPrice("");
      setStockQty("");
    },
  });

  const handleAddToStore = () => {
    if (!retailPrice || !stockQty) {
      toast.error("Please fill all fields");
      return;
    }
    addToStoreMutation.mutate({
      productId: selectedProduct.product_id,
      price: parseFloat(retailPrice),
      stockQty: parseInt(stockQty),
    });
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/retailer/wholesalers")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{wholesaler?.business_name}</h1>
            <p className="text-muted-foreground">Browse and add products to your store</p>
          </div>
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
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {product.products.description || "No description"}
                  </p>
                  <div className="mb-3">
                    <PriceDisplay price={product.price} className="text-xl text-primary" />
                    <p className="text-sm text-muted-foreground">Min Order: {product.minimum_order_quantity} units</p>
                  </div>
                  <StockBadge stockQuantity={product.stock_quantity} isAvailable={product.is_available} />
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full mt-4"
                        onClick={() => setSelectedProduct(product)}
                        disabled={!product.is_available || product.stock_quantity === 0}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add to My Store
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add to Your Store</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Product</Label>
                          <p className="font-medium">{selectedProduct?.products.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Wholesale Price: ${selectedProduct?.price}
                          </p>
                        </div>
                        <div>
                          <Label htmlFor="retail-price">Your Retail Price ($)</Label>
                          <Input
                            id="retail-price"
                            type="number"
                            step="0.01"
                            value={retailPrice}
                            onChange={(e) => setRetailPrice(e.target.value)}
                            placeholder={`Min: ${selectedProduct?.price}`}
                          />
                        </div>
                        <div>
                          <Label htmlFor="stock-qty">Initial Stock Quantity</Label>
                          <Input
                            id="stock-qty"
                            type="number"
                            value={stockQty}
                            onChange={(e) => setStockQty(e.target.value)}
                          />
                        </div>
                        <Button onClick={handleAddToStore} className="w-full">
                          Add Product
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Products Available"
            description="This wholesaler doesn't have any products in this category."
          />
        )}
      </div>
    </div>
  );
};

export default WholesalerProducts;
