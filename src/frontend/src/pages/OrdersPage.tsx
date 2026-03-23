import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle, Package } from "lucide-react";
import { useEffect, useState } from "react";

interface GuestOrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface GuestOrder {
  orderId: string;
  fullName: string;
  mobile: string;
  address: string;
  paymentMethod: string;
  items: GuestOrderItem[];
  total: number;
  createdAt: string;
}

export default function OrdersPage() {
  const navigate = useNavigate();
  const [guestOrders, setGuestOrders] = useState<GuestOrder[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("guestOrders");
    if (stored) {
      try {
        setGuestOrders(JSON.parse(stored));
      } catch {
        setGuestOrders([]);
      }
    }
  }, []);

  if (guestOrders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div
          data-ocid="orders.empty_state"
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Koi order nahi hai</h2>
          <p className="text-muted-foreground mb-6">
            Shopping karein aur aapke orders yahan dikhenge
          </p>
          <Button
            data-ocid="orders.primary_button"
            onClick={() => navigate({ to: "/" })}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Shopping Karein
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Mere Orders</h1>
      <p className="text-muted-foreground mb-8">
        Aapke saare orders yahan hain
      </p>

      <div className="space-y-6" data-ocid="orders.list">
        {guestOrders.map((order, index) => (
          <Card
            key={order.orderId}
            data-ocid={`orders.item.${index + 1}`}
            className="border-2 border-orange-100"
          >
            <CardHeader>
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <CardTitle className="text-lg text-orange-700">
                    Order #{order.orderId}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm mt-1">
                    Naam:{" "}
                    <span className="font-semibold">
                      {order.fullName || "N/A"}
                    </span>
                  </p>
                  <p className="text-sm">
                    Payment:{" "}
                    <span className="font-semibold">{order.paymentMethod}</span>
                  </p>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Confirmed
                  </Badge>
                  <p className="text-xl font-bold mt-2 text-orange-600">
                    ₹{order.total.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              {order.address && (
                <p className="text-sm text-muted-foreground mb-4">
                  <span className="font-medium">Delivery: </span>
                  {order.address}
                </p>
              )}
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={`${item.id}-${item.name}`}
                    className="flex items-center gap-3"
                  >
                    {item.image && (
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity} × ₹
                        {item.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <span className="font-bold text-sm">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Button
          data-ocid="orders.primary_button"
          onClick={() => navigate({ to: "/" })}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          Aur Shopping Karein
        </Button>
      </div>
    </div>
  );
}
