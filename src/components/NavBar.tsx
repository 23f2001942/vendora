import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Moon, Sun, User, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CartIcon } from "@/components/customer/CartIcon";
import { useProfile } from "@/hooks/useProfile";

export const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const [theme, setTheme] = useState<"light" | "dark">("dark");

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
    navigate("/auth/login");
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
              {profile?.role === "customer" && <CartIcon />}
              <Button variant="ghost" size="icon" onClick={() => {
                if (profile?.role === "customer") navigate("/customer/profile");
                else if (profile?.role === "retailer") navigate("/retailer/profile");
                else if (profile?.role === "wholesaler") navigate("/wholesaler/profile");
              }}>
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" onClick={handleSignOut}>
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <>
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
