import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Moon, Sun, User, LogOut, LayoutDashboard, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CartIcon } from "@/components/customer/CartIcon";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { LoginModal } from "@/components/auth/LoginModal";

export const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, roles, signOut } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      // Default to dark mode
      setTheme("dark");
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleNavigateToDashboard = () => {
    if (roles.includes('customer')) {
      navigate('/customer/dashboard');
    } else if (roles.includes('retailer')) {
      navigate('/retailer/dashboard');
    } else if (roles.includes('wholesaler')) {
      navigate('/wholesaler/dashboard');
    }
  };

  const handleNavigateToProfile = () => {
    if (roles.includes('customer')) {
      navigate('/customer/profile');
    } else if (roles.includes('retailer')) {
      navigate('/retailer/profile');
    } else if (roles.includes('wholesaler')) {
      navigate('/wholesaler/profile');
    }
  };

  const isAuthPage = location.pathname.startsWith("/auth");

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 
          className="text-2xl font-bold text-primary cursor-pointer" 
          onClick={() => navigate('/')}
        >
          SmartMartX
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
          {user ? (
            <div className="flex items-center gap-2">
              {/* Dashboard Button */}
              <Button variant="outline" onClick={handleNavigateToDashboard}>
                <LayoutDashboard className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>

              {/* Cart Icon - Only for customers */}
              {roles.includes('customer') && <CartIcon />}

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleNavigateToProfile}>
                    <User className="h-4 w-4 mr-2" />
                    View Profile
                  </DropdownMenuItem>
                  {roles.includes('customer') && (
                    <DropdownMenuItem onClick={() => navigate('/customer/dashboard')}>
                      <Package className="h-4 w-4 mr-2" />
                      My Orders
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              {/* Guest Cart Icon */}
              <CartIcon />
              
              {isAuthPage ? (
                <>
                  {location.pathname === "/auth/login" ? (
                    <Button onClick={() => navigate('/auth/register')}>
                      Sign Up
                    </Button>
                  ) : (
                    <Button variant="ghost" onClick={() => navigate('/auth/login')}>
                      Login
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate('/auth/login')}>
                    Login
                  </Button>
                  <Button onClick={() => navigate('/auth/register')}>
                    Sign Up
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};
