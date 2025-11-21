import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { CategoryTabs } from "@/components/shared/CategoryTabs";
import { PublicProductCard } from "@/components/customer/PublicProductCard";
import { ProductSearchBar } from "@/components/customer/ProductSearchBar";
import { usePublicProducts } from "@/hooks/usePublicProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { Package } from "lucide-react";

const Index = () => {
  const { user, roles, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: products, isLoading } = usePublicProducts(selectedCategory, searchTerm);

  // Only redirect retailers and wholesalers to their dashboards
  useEffect(() => {
    if (!loading && user && roles.length > 0) {
      if (roles.includes('retailer')) {
        navigate('/retailer/dashboard');
      } else if (roles.includes('wholesaler')) {
        navigate('/wholesaler/dashboard');
      }
      // Customers stay on this page
    }
  }, [user, roles, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Shop Local. Support Small Business.
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
          Browse thousands of products from trusted local retailers
        </p>
        
        {/* Business Users Message */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
          <p className="text-sm font-medium">
            📦 <strong>Retailers & Wholesalers:</strong> Please{' '}
            <Button 
              variant="link" 
              className="p-0 h-auto font-semibold text-primary" 
              onClick={() => navigate('/auth/login')}
            >
              login
            </Button>{' '}
            to manage your inventory and business operations.
          </p>
        </div>

        {/* Search Bar */}
        <ProductSearchBar onSearch={setSearchTerm} />
      </section>

      {/* Product Discovery Section */}
      <section className="container mx-auto px-4 pb-16">
        {/* Category Filter */}
        <div className="mb-8">
          <CategoryTabs 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <PublicProductCard 
                key={`${product.product_id}-${product.retailer_id}`}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              We couldn't find any products matching your search.
            </p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
            >
              Browse All Products
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
