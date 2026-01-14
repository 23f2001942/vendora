import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Store, MapPin, Package, ShoppingCart } from "lucide-react";
import { usePublicRetailerDetail, usePublicRetailerProducts } from "@/hooks/usePublicRetailers";
import { CategoryFilter } from "@/components/home/CategoryFilter";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { StockBadge } from "@/components/shared/StockBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

const RetailerStorefront = () => {
  const { retailerId } = useParams<{ retailerId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const { data: retailer, isLoading: loadingRetailer } = usePublicRetailerDetail(retailerId || "");
  const { data: products, isLoading: loadingProducts } = usePublicRetailerProducts(retailerId || "", selectedCategory);

  const handleAddToCart = (productId: string) => {
    if (!user) {
      toast.info("Please login to add items to cart");
      navigate(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    addToCart.mutate({
      productId,
      sellerId: retailer!.user_id,
      quantity: 1,
    });
  };

  if (loadingRetailer) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-32 w-full rounded-lg mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!retailer) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-4 py-8 text-center">
          <Store className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Retailer Not Found</h2>
          <p className="text-muted-foreground mb-4">This retailer doesn't exist or is no longer active.</p>
          <Button onClick={() => navigate("/retailers")}>Browse Retailers</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Retailer Header */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-background flex items-center justify-center shadow-lg">
              {retailer.profiles?.avatar_url ? (
                <img
                  src={retailer.profiles.avatar_url}
                  alt={retailer.business_name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <Store className="h-10 w-10 text-primary" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{retailer.business_name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mt-2">
                <MapPin className="h-4 w-4" />
                <span>{retailer.business_address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Products Grid */}
        {loadingProducts ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="aspect-square" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !products || products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products available</h3>
            <p className="text-muted-foreground">This retailer hasn't listed any products yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((item: any) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all group">
                <div 
                  className="aspect-square bg-muted relative overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/product/${item.products.id}`)}
                >
                  {item.products.image_url ? (
                    <img
                      src={item.products.image_url}
                      alt={item.products.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <Badge className="absolute top-2 left-2 capitalize">
                    {item.products.category}
                  </Badge>
                </div>
                <CardContent className="p-4 space-y-2">
                  <h3 
                    className="font-semibold line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => navigate(`/product/${item.products.id}`)}
                  >
                    {item.products.name}
                  </h3>
                  <StockBadge stockQuantity={item.stock_quantity} isAvailable={item.is_available} />
                </CardContent>
                <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between">
                  <PriceDisplay price={item.price} className="font-bold text-lg" />
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(item.products.id)}
                    disabled={!item.is_available || item.stock_quantity === 0 || addToCart.isPending}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RetailerStorefront;
