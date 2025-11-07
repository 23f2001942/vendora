import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useCartCount } from "@/hooks/useCartCount";
import { Badge } from "@/components/ui/badge";

export const CartIcon = () => {
  const navigate = useNavigate();
  const { data: cartCount } = useCartCount();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => navigate("/customer/cart")}
      className="relative"
    >
      <ShoppingCart className="h-5 w-5" />
      {cartCount && cartCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {cartCount > 99 ? "99+" : cartCount}
        </Badge>
      )}
    </Button>
  );
};
