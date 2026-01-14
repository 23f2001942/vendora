import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Store, MapPin, Package, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { PublicRetailer } from "@/hooks/usePublicRetailers";

interface PopularRetailersProps {
  retailers: PublicRetailer[] | undefined;
  isLoading: boolean;
}

export const PopularRetailers = ({ retailers, isLoading }: PopularRetailersProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-start gap-4">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!retailers || retailers.length === 0) {
    return (
      <div className="text-center py-8">
        <Store className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">No retailers available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {retailers.slice(0, 6).map((retailer) => (
          <Card
            key={retailer.id}
            className="hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => navigate(`/retailer/${retailer.id}`)}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {retailer.profiles?.avatar_url ? (
                    <img
                      src={retailer.profiles.avatar_url}
                      alt={retailer.business_name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <Store className="h-7 w-7 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                    {retailer.business_name}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{retailer.business_address}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <Package className="h-3 w-3" />
                    <span>{retailer.retailer_products?.length || 0} products</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {retailers.length > 6 && (
        <div className="text-center">
          <Button variant="outline" onClick={() => navigate("/retailers")} className="gap-2">
            View All Retailers
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
