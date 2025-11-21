import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useOrders } from "@/hooks/useDeliveryTracking";
import { OrderCard } from "@/components/customer/OrderCard";
import { Loader2, Package } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { NavBar } from "@/components/NavBar";
import { useAuth } from "@/contexts/AuthContext";
import { useOrderAnalytics } from "@/hooks/useOrderAnalytics";
import { useDeliveryAnalytics } from "@/hooks/useDeliveryAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatsChart } from "@/components/analytics/OrderStatsChart";
import { RevenueChart } from "@/components/analytics/RevenueChart";
import { DeliveryPerformanceChart } from "@/components/analytics/DeliveryPerformanceChart";

const CustomerDashboard = () => {
  useRequireAuth("customer");
  const { user } = useAuth();
  const { orders, isLoading } = useOrders();
  
  const { stats, monthlyData, isLoading: analyticsLoading } = useOrderAnalytics(
    user?.id || "",
    "customer"
  );

  const { data: deliveryStats, isLoading: deliveryLoading } = useDeliveryAnalytics(
    user?.id || "",
    "customer"
  );

  if (isLoading || analyticsLoading || deliveryLoading) {
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

        {/* Summary Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.delivered}</div>
                <p className="text-xs text-muted-foreground">Successfully delivered</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.pending + stats.confirmed + stats.processing + stats.shipped}
                </div>
                <p className="text-xs text-muted-foreground">Active orders</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analytics Charts */}
        {stats && monthlyData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <OrderStatsChart stats={stats} />
            <RevenueChart data={monthlyData} />
          </div>
        )}

        {deliveryStats && (
          <div className="mb-6">
            <DeliveryPerformanceChart stats={deliveryStats} />
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>

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
