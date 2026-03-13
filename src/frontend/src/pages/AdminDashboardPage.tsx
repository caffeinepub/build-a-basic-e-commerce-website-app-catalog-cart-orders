import type { Order } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllProducts } from "@/hooks/store/useProducts";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Loader2,
  Package,
  RefreshCw,
  ShieldAlert,
  ShoppingBag,
  Store,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

function useGetAllOrders() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<Order[]>({
    queryKey: ["allOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}

function useInitializeStore() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.initializeStore();
    },
  });
}

// ─── Payment method label ─────────────────────────────────────────────────────
function paymentLabel(method: Order["paymentMethod"]): string {
  const map: Record<string, string> = {
    cashOnDelivery: "Cash on Delivery",
    creditCard: "Credit Card",
    paypal: "PayPal",
    crypto: "Crypto",
    klarnaPayLater: "Klarna",
  };
  return map[method as unknown as string] ?? String(method);
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const {
    data: orders,
    isLoading: ordersLoading,
    refetch: refetchOrders,
  } = useGetAllOrders();
  const { data: products, isLoading: productsLoading } = useGetAllProducts();
  const initializeStore = useInitializeStore();

  const handleInitStore = async () => {
    try {
      await initializeStore.mutateAsync();
      toast.success("Store initialized successfully! Products loaded. 🎉");
      refetchOrders();
    } catch (err) {
      const error = err as { message?: string };
      toast.error(error.message || "Failed to initialize store");
    }
  };

  // Not logged in
  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-10 pb-10 text-center">
            <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold mb-2">
              Login Required
            </h2>
            <p className="text-muted-foreground text-sm">
              Please sign in to access the admin dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading admin check
  if (adminLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full border-destructive/30">
          <CardContent className="pt-10 pb-10 text-center">
            <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold mb-2">
              Access Denied
            </h2>
            <p className="text-muted-foreground text-sm">
              Aapko is page tak access nahi hai. Sirf admins yahan aa sakte
              hain.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Stats
  const totalOrders = orders?.length ?? 0;
  const totalRevenue =
    orders?.reduce((sum, o) => sum + Number(o.total), 0) ?? 0;
  const totalProducts = products?.length ?? 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            A to Z Mobile Store — Management Panel
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchOrders()}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={handleInitStore}
            disabled={initializeStore.isPending}
            data-ocid="admin.init_store.button"
            className="gap-2"
          >
            {initializeStore.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Store className="w-4 h-4" />
            )}
            {initializeStore.isPending ? "Initializing..." : "Initialize Store"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground font-medium">
                Total Orders
              </span>
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            {ordersLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="font-display text-3xl font-bold">{totalOrders}</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground font-medium">
                Total Revenue
              </span>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            {ordersLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="font-display text-3xl font-bold">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground font-medium">
                Total Products
              </span>
              <Package className="w-5 h-5 text-primary" />
            </div>
            {productsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="font-display text-3xl font-bold">{totalProducts}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-display text-xl">All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !orders || orders.length === 0 ? (
            <div
              data-ocid="admin.orders.empty_state"
              className="text-center py-12"
            >
              <ShoppingBag className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground font-medium">
                Koi orders nahi hain abhi.
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Store initialize karo products add karne ke liye.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table data-ocid="admin.orders.table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order, i) => (
                    <TableRow
                      key={order.id.toString()}
                      data-ocid={`admin.orders.row.${i + 1}`}
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        #{order.id.toString()}
                      </TableCell>
                      <TableCell className="max-w-[120px]">
                        <span className="truncate block text-xs font-mono text-muted-foreground">
                          {order.customer.toString().slice(0, 12)}...
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {order.items.length} items
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {paymentLabel(order.paymentMethod)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ₹{Number(order.total).toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-[oklch(0.45_0.15_160)] text-white text-xs">
                          Placed
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
