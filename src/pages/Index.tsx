import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { ShoppingCart, Store, Warehouse } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user, roles, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && roles.length > 0) {
      // Redirect authenticated users to their dashboard
      if (roles.includes('customer')) {
        navigate('/customer/dashboard');
      } else if (roles.includes('retailer')) {
        navigate('/retailer/dashboard');
      } else if (roles.includes('wholesaler')) {
        navigate('/wholesaler/dashboard');
      }
    }
  }, [user, roles, loading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">SmartMartX</h1>
          <div className="space-x-4">
            <Button variant="ghost" onClick={() => navigate('/auth/login')}>
              Login
            </Button>
            <Button onClick={() => navigate('/auth/register')}>
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6 text-foreground">
          Connect. Trade. Grow.
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Your local marketplace connecting customers, retailers, and wholesalers
          in one seamless platform.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={() => navigate('/auth/register')}>
            Get Started
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/auth/login')}>
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12 text-foreground">
          Built for Everyone
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <ShoppingCart className="w-12 h-12 mb-4 text-primary" />
            <h4 className="text-xl font-semibold mb-2">For Customers</h4>
            <p className="text-muted-foreground">
              Browse local retailers, place orders, and get products delivered
              to your doorstep with ease.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <Store className="w-12 h-12 mb-4 text-primary" />
            <h4 className="text-xl font-semibold mb-2">For Retailers</h4>
            <p className="text-muted-foreground">
              Manage your inventory, reach local customers, and source products
              from trusted wholesalers.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <Warehouse className="w-12 h-12 mb-4 text-primary" />
            <h4 className="text-xl font-semibold mb-2">For Wholesalers</h4>
            <p className="text-muted-foreground">
              Distribute your products to multiple retailers and expand your
              business reach effortlessly.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-primary text-primary-foreground rounded-lg p-12">
          <h3 className="text-3xl font-bold mb-4">Ready to Start?</h3>
          <p className="text-lg mb-6 opacity-90">
            Join thousands of users already trading on LocalMarket
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate('/auth/register')}>
            Create Your Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2025 LocalMarket. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
