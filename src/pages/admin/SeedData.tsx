import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function SeedData() {
  const [loading, setLoading] = useState(false);

  const handleSeedProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('seed-wholesaler-products', {
        body: { userId: 'e512e461-dc9a-44e0-af2a-ad0688894634' }
      });

      if (error) throw error;

      toast.success(`Successfully added ${data.products?.length || 0} products!`);
      console.log('Seeded products:', data);
    } catch (error) {
      console.error('Error seeding data:', error);
      toast.error('Failed to seed products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Seed Test Data</CardTitle>
          <CardDescription>
            Add test products to Pranav Traders wholesaler for testing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              This will add 24 products across all categories:
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Electronics: 3 products</li>
              <li>Clothing: 3 products</li>
              <li>Food: 1 product</li>
              <li>Home: 3 products</li>
              <li>Beauty: 3 products</li>
              <li>Sports: 3 products</li>
              <li>Books: 2 products</li>
              <li>Toys: 3 products</li>
              <li>Other: 3 products</li>
            </ul>
          </div>
          <Button 
            onClick={handleSeedProducts} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Adding Products..." : "Seed Products"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
