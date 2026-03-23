import type { RichProduct } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingCart, Zap } from "lucide-react";
import { toast } from "sonner";
import ProductImage from "./ProductImage";

interface ProductCardProps {
  product: RichProduct;
  onAddToCart?: (productId: bigint) => void;
  isAddingToCart?: boolean;
}

export default function ProductCard({
  product,
  onAddToCart,
  isAddingToCart,
}: ProductCardProps) {
  const navigate = useNavigate();

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    // Store product in sessionStorage for direct buy (no auth required)
    try {
      sessionStorage.setItem(
        "directBuyProduct",
        JSON.stringify({
          id: product.id.toString(),
          name: product.name,
          price: Number(product.price),
          image: product.imageURL || "",
          specs: product.description || "",
        }),
      );
    } catch {
      // ignore
    }
    navigate({ to: "/checkout" });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToCart) {
      onAddToCart(product.id);
    } else {
      toast.info("Cart mein add ho raha hai...");
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      <Link
        to="/product/$productId"
        params={{ productId: product.id.toString() }}
        className="block"
      >
        <div className="aspect-square overflow-hidden bg-muted">
          <ProductImage
            productId={product.id}
            imageURL={product.imageURL}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <CardContent className="p-4 flex-1">
        <Link
          to="/product/$productId"
          params={{ productId: product.id.toString() }}
        >
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <Badge variant="secondary" className="text-lg font-bold">
          ₹{Number(product.price).toLocaleString("en-IN")}
        </Badge>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <Button
          onClick={handleBuyNow}
          className="w-full gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold"
          size="sm"
          data-ocid="product.buynow.button"
        >
          <Zap className="w-4 h-4" />
          Buy Now
        </Button>
        <Button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          variant="outline"
          className="w-full gap-2"
          size="sm"
          data-ocid="product.addtocart.button"
        >
          <ShoppingCart className="w-4 h-4" />
          {isAddingToCart ? "Adding..." : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
