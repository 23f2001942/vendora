import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { ShoppingBag, Clock } from "lucide-react";

interface CartSummaryProps {
  items: any[];
  onCheckout: () => void;
}

export const CartSummary = ({ items, onCheckout }: CartSummaryProps) => {
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <PriceDisplay price={subtotal} />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (10%)</span>
            <PriceDisplay price={tax} />
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total</span>
            <PriceDisplay price={total} className="text-lg" />
          </div>
        </div>

        <Button
          className="w-full"
          size="lg"
          disabled
          variant="secondary"
        >
          <Clock className="h-4 w-4 mr-2" />
          Checkout Coming Soon
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Payment integration will be added soon
        </p>
      </CardContent>
    </Card>
  );
};
