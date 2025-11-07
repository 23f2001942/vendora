import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
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
          {isAuthPage && (
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
          )}
          {!isAuthPage && (
            <>
              <Button variant="ghost" onClick={() => navigate('/auth/login')}>
                Login
              </Button>
              <Button onClick={() => navigate('/auth/register')}>
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
