import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PriceDisplay } from '@/components/shared/PriceDisplay';
import { StockBadge } from '@/components/shared/StockBadge';
import { ShoppingCart, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOptionalAuth } from '@/hooks/useOptionalAuth';
import { useGuestCart } from '@/hooks/useGuestCart';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';
import { useState } from 'react';
import { LoginModal } from '@/components/auth/LoginModal';

interface PublicProductCardProps {
  product: any;
}

export const PublicProductCard = ({ product }: PublicProductCardProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useOptionalAuth();
  const { addToGuestCart } = useGuestCart();
  const { addToCart } = useCart();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isAuthenticated) {
      addToCart.mutate({
        productId: product.product_id,
        sellerId: product.retailer_id,
        quantity: 1,
      });
    } else {
      addToGuestCart({
        productId: product.product_id,
        sellerId: product.retailer_id,
        quantity: 1,
      });
      toast.success('Added to cart! Login to checkout.', {
        action: {
          label: 'Login',
          onClick: () => setShowLoginModal(true),
        },
      });
    }
  };

  const handleViewDetails = () => {
    navigate(`/customer/products/${product.product_id}`);
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleViewDetails}>
        <CardContent className="p-4">
          <div className="aspect-square bg-muted rounded-md mb-3 flex items-center justify-center overflow-hidden">
            <img 
              src="/placeholder.svg" 
              alt={product.product?.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <Badge variant="secondary" className="mb-2">
            {product.product?.category || 'Other'}
          </Badge>
          
          <h3 className="font-semibold line-clamp-2 mb-1">
            {product.product?.name}
          </h3>
          
          <p className="text-xs text-muted-foreground mb-2">
            by {product.retailer?.business_name}
          </p>
          
          <div className="flex items-center justify-between mb-2">
            <PriceDisplay price={product.price} className="text-lg font-bold" />
            <StockBadge 
              stockQuantity={product.stock_quantity} 
              isAvailable={product.is_available}
            />
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button 
            className="flex-1"
            onClick={handleAddToCart}
            disabled={!product.is_available || product.stock_quantity === 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add
          </Button>
        </CardFooter>
      </Card>

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </>
  );
};
