import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useOrders } from "@/hooks/useDeliveryTracking";
import { OrderCard } from "@/components/customer/OrderCard";
import { Loader2, Package } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { NavBar } from "@/components/NavBar";

const CustomerDashboard = () => {
  useRequireAuth("customer");
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
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground mb-6">Track and manage your orders</p>

        {!orders || orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="Start shopping to see your orders here"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
