import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useGuestCart } from "@/hooks/useGuestCart";
import { useOptionalAuth } from "@/hooks/useOptionalAuth";
import { toast } from "sonner";
import { useState } from "react";
import { LoginModal } from "@/components/auth/LoginModal";

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
  const { addToGuestCart } = useGuestCart();
  const { isAuthenticated } = useOptionalAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleAddToCart = () => {
    if (isAuthenticated) {
      addToCart.mutate({ productId, sellerId, quantity: 1 });
    } else {
      addToGuestCart({ productId, sellerId, quantity: 1 });
      toast.success('Added to cart! Login to checkout.', {
        action: {
          label: 'Login',
          onClick: () => setShowLoginModal(true),
        },
      });
    }
  };

  const isDisabled = !isAvailable || stockQuantity === 0 || addToCart.isPending;

  return (
    <>
      <Button
        onClick={handleAddToCart}
        disabled={isDisabled}
        className={className}
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        {addToCart.isPending ? "Adding..." : "Add to Cart"}
      </Button>
      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </>
  );
};
