import { Badge } from "@/components/ui/badge";

interface StockBadgeProps {
  stockQuantity: number;
  isAvailable?: boolean;
}

export const StockBadge = ({ stockQuantity, isAvailable = true }: StockBadgeProps) => {
  if (!isAvailable) {
    return <Badge variant="destructive">Out of Stock</Badge>;
  }

  if (stockQuantity === 0) {
    return <Badge variant="destructive">Out of Stock</Badge>;
  }

  if (stockQuantity < 10) {
    return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Low Stock ({stockQuantity})</Badge>;
  }

  return <Badge variant="outline" className="border-green-500 text-green-500">In Stock ({stockQuantity})</Badge>;
};
