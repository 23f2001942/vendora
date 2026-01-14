import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Store, ArrowRight } from "lucide-react";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Shop Local.
              <span className="text-primary block">Delivered Fast.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              Discover products from trusted local retailers. Browse, compare prices, 
              and get everything delivered to your doorstep.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => navigate("/products")} className="gap-2">
                <ShoppingBag className="h-5 w-5" />
                Start Shopping
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/retailers")} className="gap-2">
                <Store className="h-5 w-5" />
                Browse Retailers
              </Button>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl rounded-full" />
              <div className="relative grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-card p-6 rounded-2xl border shadow-lg">
                    <ShoppingBag className="h-10 w-10 text-primary mb-3" />
                    <p className="font-semibold">1000+ Products</p>
                    <p className="text-sm text-muted-foreground">From local retailers</p>
                  </div>
                  <div className="bg-card p-6 rounded-2xl border shadow-lg">
                    <Store className="h-10 w-10 text-primary mb-3" />
                    <p className="font-semibold">50+ Retailers</p>
                    <p className="text-sm text-muted-foreground">Trusted sellers</p>
                  </div>
                </div>
                <div className="pt-8">
                  <div className="bg-card p-6 rounded-2xl border shadow-lg">
                    <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                    <p className="font-semibold">Always Open</p>
                    <p className="text-sm text-muted-foreground">Shop anytime</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
