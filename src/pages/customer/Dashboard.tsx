import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useOrders } from "@/hooks/useDeliveryTracking";
import { OrderCard } from "@/components/customer/OrderCard";
import { Loader2, Package, ShoppingBag, ShoppingCart, ListOrdered } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { NavBar } from "@/components/NavBar";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  useRequireAuth("customer");
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { orders, isLoading } = useOrders();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {profile?.full_name}!</h1>
          <p className="text-muted-foreground">Here's what's happening with your orders today</p>
        </div>

        {/* Quick Actions Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2"
                onClick={() => navigate("/customer/retailers")}
              >
                <ShoppingBag className="h-6 w-6" />
                <span className="font-medium">Browse Products</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2"
                onClick={() => navigate("/customer/cart")}
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="font-medium">View Cart</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2"
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
              >
                <ListOrdered className="h-6 w-6" />
                <span className="font-medium">View All Orders</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders Section */}
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>

        {!orders || orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="Start shopping to see your orders here"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.slice(0, 6).map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
