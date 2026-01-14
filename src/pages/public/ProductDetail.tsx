import { useParams, useNavigate } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Package, Store, MapPin, ShoppingCart } from "lucide-react";
import { usePublicProductDetail } from "@/hooks/usePublicProducts";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { StockBadge } from "@/components/shared/StockBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const { data: product, isLoading } = usePublicProductDetail(productId || "");

  const handleAddToCart = (retailerProduct: any) => {
    if (!user) {
      toast.info("Please login to add items to cart");
      navigate(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    addToCart.mutate({
      productId: product!.id,
      sellerId: retailerProduct.retailers.user_id,
      quantity: 1,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-4 py-8 text-center">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-4">This product doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/products")}>Browse Products</Button>
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

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-3 capitalize">{product.category}</Badge>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              {product.description && (
                <p className="text-muted-foreground">{product.description}</p>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Available from {product.retailer_products.length} retailer{product.retailer_products.length > 1 ? "s" : ""}</p>
            </div>
          </div>
        </div>

        {/* Retailer Options */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Buy from</h2>
          <div className="grid gap-4">
            {product.retailer_products
              .sort((a, b) => a.price - b.price)
              .map((rp) => (
                <Card key={rp.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Store className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{rp.retailers.business_name}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            <span>{rp.retailers.business_address}</span>
                          </div>
                          <div className="mt-2">
                            <StockBadge
                              stockQuantity={rp.stock_quantity}
                              isAvailable={rp.is_available}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <PriceDisplay price={rp.price} className="text-2xl font-bold" />
                        <Button
                          onClick={() => handleAddToCart(rp)}
                          disabled={!rp.is_available || rp.stock_quantity === 0 || addToCart.isPending}
                          className="gap-2"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          {addToCart.isPending ? "Adding..." : "Add to Cart"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
