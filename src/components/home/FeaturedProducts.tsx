import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import type { PublicProduct } from "@/hooks/usePublicProducts";

interface FeaturedProductsProps {
  products: PublicProduct[] | undefined;
  isLoading: boolean;
}

export const FeaturedProducts = ({ products, isLoading }: FeaturedProductsProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-square" />
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground">Try adjusting your search or category filter</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map((product) => {
        const lowestPrice = Math.min(
          ...product.retailer_products.map((rp) => rp.price)
        );
        const retailerCount = product.retailer_products.length;

        return (
          <Card
            key={product.id}
            className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <div className="aspect-square bg-muted relative overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <Badge className="absolute top-2 left-2 capitalize">
                {product.category}
              </Badge>
            </div>
            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Store className="h-3 w-3" />
                <span>{retailerCount} retailer{retailerCount > 1 ? "s" : ""}</span>
              </div>
            </CardContent>
            <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">From</p>
                <PriceDisplay price={lowestPrice} className="font-bold text-lg" />
              </div>
              <Button size="sm" variant="secondary">
                View
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};
