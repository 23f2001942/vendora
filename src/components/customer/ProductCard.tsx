import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StockBadge } from "@/components/shared/StockBadge";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: {
    id: string;
    product_id: string;
    products: {
      name: string;
      description: string | null;
      category: string;
    };
    price: number;
    stock_quantity: number;
    is_available: boolean;
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{product.products.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {product.products.description || "No description available"}
        </p>
        <div className="flex items-center justify-between mb-2">
          <PriceDisplay price={product.price} className="text-xl text-primary" />
          <StockBadge stockQuantity={product.stock_quantity} isAvailable={product.is_available} />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => navigate(`/customer/product/${product.id}`)}
          className="w-full"
          disabled={!product.is_available || product.stock_quantity === 0}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
