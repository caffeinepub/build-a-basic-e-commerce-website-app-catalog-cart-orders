import { EmptyState, ErrorState } from "@/components/feedback/ScreenStates";
import ProductImage from "@/components/store/ProductImage";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  useClearCart,
  useGetCart,
  useGetCartWithProducts,
} from "@/hooks/store/useCart";
import { useNavigate } from "@tanstack/react-router";
import { ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function CartPage() {
  const navigate = useNavigate();
  const { data: cart, isLoading, error } = useGetCart();
  const { data: cartWithProducts } = useGetCartWithProducts();
  const clearCart = useClearCart();

  const handleClearCart = async () => {
    try {
      await clearCart.mutateAsync();
      toast.success("Cart cleared");
    } catch (_err) {
      toast.error("Failed to clear cart");
    }
  };

  const handleCheckout = () => {
    navigate({ to: "/checkout" });
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
        <ErrorState message="Failed to load cart. Please try again." />
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          icon={<ShoppingBag className="w-8 h-8 text-muted-foreground" />}
          title="Your cart is empty"
          description="Add some products to get started"
          action={{
            label: "Continue Shopping",
            onClick: () => navigate({ to: "/" }),
          }}
        />
      </div>
    );
  }

  // Count occurrences of each product
  const productCounts = cart.reduce(
    (acc, productId) => {
      const id = productId.toString();
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const uniqueProducts =
    cartWithProducts?.filter(
      (product, index, self) =>
        self.findIndex((p) => p.id === product.id) === index,
    ) || [];

  const total =
    cartWithProducts?.reduce(
      (sum, product) => sum + Number(product.price),
      0,
    ) || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        {cart.length > 0 && (
          <Button
            variant="outline"
            onClick={handleClearCart}
            disabled={clearCart.isPending}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cart
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items ({cart.length})</CardTitle>
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
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
