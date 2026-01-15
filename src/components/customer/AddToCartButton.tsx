import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

interface AddToCartButtonProps {
  productId: string;
  sellerId: string;
  stockQuantity: number;
  isAvailable: boolean;
  className?: string;
}

export const AddToCartButton = ({
  productId,
  sellerId,
  stockQuantity,
  isAvailable,
  className = "",
}: AddToCartButtonProps) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAddToCart = () => {
    if (!user) {
      toast.info("Please login to add items to cart");
      navigate(`/auth/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }
    addToCart.mutate({ productId, sellerId, quantity: 1 });
  };

  const isDisabled = !isAvailable || stockQuantity === 0 || addToCart.isPending;

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={className}
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      {addToCart.isPending ? "Adding..." : "Add to Cart"}
    </Button>
  );
};
