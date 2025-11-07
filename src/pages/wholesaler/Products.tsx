import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { CategoryTabs } from "@/components/shared/CategoryTabs";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StockBadge } from "@/components/shared/StockBadge";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = ["electronics", "clothing", "food", "home", "beauty", "sports", "books", "toys", "other"];

const Products = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useRequireAuth("wholesaler");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: wholesaler } = useQuery({
    queryKey: ["wholesaler-profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wholesalers")
        .select("*")
        .eq("user_id", user?.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: allProducts } = useQuery({
    queryKey: ["all-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["my-wholesaler-products", wholesaler?.id, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("wholesaler_products")
        .select("*, products(*)")
        .eq("wholesaler_id", wholesaler?.id);

      if (selectedCategory !== "all") {
        query = query.eq("products.category", selectedCategory as any);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!wholesaler,
  });

  const [formData, setFormData] = useState({
    product_id: "",
    price: "",
    stock_quantity: "",
    minimum_order_quantity: "",
  });

  const addProductMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from("wholesaler_products").insert({
        wholesaler_id: wholesaler?.id,
        product_id: data.product_id,
        price: parseFloat(data.price),
        stock_quantity: parseInt(data.stock_quantity),
        minimum_order_quantity: parseInt(data.minimum_order_quantity),
        is_available: true,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-wholesaler-products"] });
      toast.success("Product added successfully");
      setIsAddDialogOpen(false);
      setFormData({ product_id: "", price: "", stock_quantity: "", minimum_order_quantity: "" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from("wholesaler_products")
        .delete()
        .eq("id", productId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-wholesaler-products"] });
      toast.success("Product removed");
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
            <Button variant="ghost" size="icon" onClick={() => navigate("/wholesaler/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold text-foreground">My Products</h1>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Select Product</Label>
                  <Select value={formData.product_id} onValueChange={(val) => setFormData({ ...formData, product_id: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {allProducts?.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} ({product.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Wholesale Price ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Stock Quantity</Label>
                  <Input
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Minimum Order Quantity</Label>
                  <Input
                    type="number"
                    value={formData.minimum_order_quantity}
                    onChange={(e) => setFormData({ ...formData, minimum_order_quantity: e.target.value })}
                  />
                </div>
                <Button onClick={() => addProductMutation.mutate(formData)} className="w-full">
                  Add Product
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
                    <p className="text-sm text-muted-foreground">Min Order: {product.minimum_order_quantity} units</p>
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
            description="Start adding products to your catalog."
            actionLabel="Add Product"
            onAction={() => setIsAddDialogOpen(true)}
          />
        )}
      </div>
    </div>
  );
};

export default Products;
