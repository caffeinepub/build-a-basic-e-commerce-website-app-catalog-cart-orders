import { PaymentMethod } from "@/backend";
import { EmptyState, ErrorState } from "@/components/feedback/ScreenStates";
import ProductImage from "@/components/store/ProductImage";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetOrdersByUser } from "@/hooks/store/useOrders";
import { useGetAllProducts } from "@/hooks/store/useProducts";
import { useNavigate } from "@tanstack/react-router";
import { Bitcoin, CreditCard, Package, Truck, Wallet } from "lucide-react";

const paymentMethodLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.cashOnDelivery]: "Cash on Delivery",
  [PaymentMethod.creditCard]: "Credit Card",
  [PaymentMethod.paypal]: "PayPal",
  [PaymentMethod.crypto]: "Cryptocurrency",
  [PaymentMethod.klarnaPayLater]: "Klarna Pay Later",
};

const paymentMethodIcons: Record<PaymentMethod, React.ReactNode> = {
  [PaymentMethod.cashOnDelivery]: <Truck className="w-4 h-4" />,
  [PaymentMethod.creditCard]: <CreditCard className="w-4 h-4" />,
  [PaymentMethod.paypal]: <Wallet className="w-4 h-4" />,
  [PaymentMethod.crypto]: <Bitcoin className="w-4 h-4" />,
  [PaymentMethod.klarnaPayLater]: <Wallet className="w-4 h-4" />,
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const { data: orders, isLoading, error, refetch } = useGetOrdersByUser();
  const { data: products } = useGetAllProducts();

  const getProductById = (id: bigint) => {
    return products?.find((p) => p.id === id);
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
        <ErrorState
          message="Failed to load orders. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          icon={<Package className="w-8 h-8 text-muted-foreground" />}
          title="No orders yet"
          description="Start shopping to see your orders here"
          action={{
            label: "Start Shopping",
            onClick: () => navigate({ to: "/" }),
          }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => {
          // Count occurrences
          const itemCounts = order.items.reduce(
            (acc, productId) => {
              const id = productId.toString();
              acc[id] = (acc[id] || 0) + 1;
              return acc;
            },
            {} as Record<string, number>,
          );

          const uniqueItems = Array.from(
            new Set(order.items.map((id) => id.toString())),
          );

          return (
            <Card key={order.id.toString()}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">
                      Order #{order.id.toString()}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {paymentMethodIcons[order.paymentMethod]}
                      <span className="text-sm text-muted-foreground">
                        {paymentMethodLabels[order.paymentMethod]}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">Completed</Badge>
                    <p className="text-lg font-bold mt-2">
                      ${Number(order.total)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {uniqueItems.map((productIdStr) => {
                    const productId = BigInt(productIdStr);
                    const product = getProductById(productId);
                    const quantity = itemCounts[productIdStr];

                    if (!product) return null;

                    return (
                      <div key={productIdStr} className="flex gap-4">
                        <div className="w-16 h-16 rounded-md overflow-hidden bg-muted shrink-0">
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
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
