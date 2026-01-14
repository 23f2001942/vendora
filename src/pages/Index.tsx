import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { NavBar } from "@/components/NavBar";
import { HeroSection } from "@/components/home/HeroSection";
import { SearchBar } from "@/components/home/SearchBar";
import { CategoryFilter } from "@/components/home/CategoryFilter";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PopularRetailers } from "@/components/home/PopularRetailers";
import { usePublicProducts } from "@/hooks/usePublicProducts";
import { usePublicRetailers } from "@/hooks/usePublicRetailers";

const Index = () => {
  const navigate = useNavigate();
  const { user, roles, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: products, isLoading: productsLoading } = usePublicProducts(selectedCategory, searchQuery);
  const { data: retailers, isLoading: retailersLoading } = usePublicRetailers();

  useEffect(() => {
    if (!loading && user && roles.length > 0) {
      // Redirect authenticated users to their dashboard
      if (roles.includes('retailer')) {
        navigate('/retailer/dashboard');
      } else if (roles.includes('wholesaler')) {
        navigate('/wholesaler/dashboard');
      }
      // Customers stay on homepage to shop
    }
  }, [user, roles, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <HeroSection />

      {/* Search & Products Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <SearchBar onSearch={setSearchQuery} />
        </div>

        <div className="mb-6">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        <FeaturedProducts products={products} isLoading={productsLoading} />
      </section>

      {/* Popular Retailers */}
      <section className="container mx-auto px-4 py-12 border-t">
        <h2 className="text-2xl font-bold mb-6">Popular Retailers</h2>
        <PopularRetailers retailers={retailers} isLoading={retailersLoading} />
      </section>

      {/* Footer */}
      <footer className="border-t mt-8">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2025 Vendora. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
