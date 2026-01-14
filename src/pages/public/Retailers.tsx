import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { SearchBar } from "@/components/home/SearchBar";
import { PopularRetailers } from "@/components/home/PopularRetailers";
import { usePublicRetailers } from "@/hooks/usePublicRetailers";

const Retailers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: retailers, isLoading } = usePublicRetailers(searchQuery);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">All Retailers</h1>
          <SearchBar onSearch={setSearchQuery} placeholder="Search retailers..." />
        </div>

        <PopularRetailers retailers={retailers} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Retailers;
