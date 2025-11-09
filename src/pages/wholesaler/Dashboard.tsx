import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Package, Truck, TrendingUp, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";

const WholesalerDashboard = () => {
  const { user, loading } = useRequireAuth('wholesaler');
  const navigate = useNavigate();

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

  const { data: productsCount } = useQuery({
    queryKey: ["wholesaler-products-count", wholesaler?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("wholesaler_products")
        .select("*", { count: "exact", head: true })
        .eq("wholesaler_id", wholesaler?.id);
      if (error) throw error;
      return count || 0;
    },
    enabled: !!wholesaler,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Wholesaler Dashboard</h2>
          <p className="text-muted-foreground">Manage your wholesale distribution and retail partners.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{productsCount || 0}</div>
              <p className="text-xs text-muted-foreground">
                {productsCount ? `${productsCount} products listed` : "No products listed"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bulk Orders</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Pending fulfillment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Retail Partners</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Active retailers</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your wholesale operations</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <Button className="h-20" variant="outline" onClick={() => navigate('/wholesaler/products')}>
              Manage Products
            </Button>
            <Button className="h-20" variant="outline" onClick={() => console.log('View Orders')}>
              View Orders
            </Button>
            <Button className="h-20" variant="outline" onClick={() => navigate('/wholesaler/profile')}>
              Business Profile
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default WholesalerDashboard;
