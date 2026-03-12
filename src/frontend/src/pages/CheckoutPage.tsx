import { PaymentMethod } from "@/backend";
import { EmptyState, ErrorState } from "@/components/feedback/ScreenStates";
import ProductImage from "@/components/store/ProductImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useGetCartWithProducts } from "@/hooks/store/useCart";
import { usePlaceOrder } from "@/hooks/store/useOrders";
import { useNavigate } from "@tanstack/react-router";
import {
  Bitcoin,
  CheckCircle,
  CreditCard,
  ShoppingBag,
  Truck,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cartWithProducts, isLoading, error } = useGetCartWithProducts();
  const placeOrder = usePlaceOrder();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.cashOnDelivery,
  );

  const handlePlaceOrder = async () => {
    try {
      await placeOrder.mutateAsync(paymentMethod);
      setOrderPlaced(true);
      toast.success("Order placed successfully!");
      setTimeout(() => {
        navigate({ to: "/orders" });
      }, 2000);
    } catch (error: any) {
      if (error.message?.includes("Unauthorized")) {
        toast.error("Please sign in to place an order");
      } else if (error.message?.includes("empty")) {
        toast.error("Your cart is empty");
        navigate({ to: "/cart" });
      } else {
        toast.error("Failed to place order. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState message="Failed to load checkout. Please try again." />
      </div>
    );
  }

  if (!cartWithProducts || cartWithProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          icon={<ShoppingBag className="w-8 h-8 text-muted-foreground" />}
          title="Your cart is empty"
          description="Add some products before checking out"
          action={{
            label: "Continue Shopping",
            onClick: () => navigate({ to: "/" }),
          }}
        />
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardContent className="pt-12 pb-12">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Order Placed Successfully!
              </h2>
              <p className="text-muted-foreground mb-6">
                Thank you for your purchase. Redirecting to your orders...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Count occurrences
  const productCounts = cartWithProducts.reduce(
    (acc, product) => {
      const id = product.id.toString();
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const uniqueProducts = cartWithProducts.filter(
    (product, index, self) =>
      self.findIndex((p) => p.id === product.id) === index,
  );

  const total = cartWithProducts.reduce(
    (sum, product) => sum + Number(product.price),
    0,
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {uniqueProducts.map((product) => {
                const quantity = productCounts[product.id.toString()];
                return (
                  <div key={product.id.toString()} className="flex gap-4">
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-muted shrink-0">
                      <ProductImage
                        productId={product.id}
                        imageURL={product.imageURL}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ${Number(product.price)} × {quantity}
                      </p>
                    </div>
                    <div className="text-right font-semibold">
                      ${Number(product.price) * quantity}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) =>
                  setPaymentMethod(value as PaymentMethod)
                }
                data-ocid="checkout.payment.radio"
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <RadioGroupItem
                      value={PaymentMethod.cashOnDelivery}
                      id="cod"
                    />
                    <Label
                      htmlFor="cod"
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      <Truck className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-semibold">Cash on Delivery</div>
                        <div className="text-sm text-muted-foreground">
                          Pay when you receive your order
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <RadioGroupItem
                      value={PaymentMethod.creditCard}
                      id="card"
                    />
                    <Label
                      htmlFor="card"
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      <CreditCard className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-semibold">Credit Card</div>
                        <div className="text-sm text-muted-foreground">
                          Pay securely with your card
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <RadioGroupItem value={PaymentMethod.paypal} id="paypal" />
                    <Label
                      htmlFor="paypal"
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      <Wallet className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-semibold">PayPal</div>
                        <div className="text-sm text-muted-foreground">
                          Fast and secure payment
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <RadioGroupItem value={PaymentMethod.crypto} id="crypto" />
                    <Label
                      htmlFor="crypto"
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      <Bitcoin className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-semibold">Cryptocurrency</div>
                        <div className="text-sm text-muted-foreground">
                          Pay with Bitcoin or other crypto
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">$0</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total}</span>
              </div>
              <Button
                size="lg"
                className="w-full mt-4"
                onClick={handlePlaceOrder}
                disabled={placeOrder.isPending}
                data-ocid="checkout.placeorder.button"
              >
                {placeOrder.isPending ? "Placing Order..." : "Place Order"}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-4">
                By placing your order, you agree to our terms and conditions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
