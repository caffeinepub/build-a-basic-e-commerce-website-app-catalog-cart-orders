import type { RichProduct } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
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
          ${Number(product.price)}
        </Badge>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onAddToCart?.(product.id)}
          disabled={isAddingToCart}
          className="w-full gap-2"
          size="sm"
        >
          <ShoppingCart className="w-4 h-4" />
          {isAddingToCart ? "Adding..." : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
