import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { SearchBar } from "@/components/home/SearchBar";
import { CategoryFilter } from "@/components/home/CategoryFilter";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { usePublicProducts } from "@/hooks/usePublicProducts";

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const { data: products, isLoading } = usePublicProducts(selectedCategory, searchQuery);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">All Products</h1>
          <SearchBar onSearch={setSearchQuery} placeholder="Search products..." />
        </div>

        <div className="mb-6">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        <FeaturedProducts products={products} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Products;
