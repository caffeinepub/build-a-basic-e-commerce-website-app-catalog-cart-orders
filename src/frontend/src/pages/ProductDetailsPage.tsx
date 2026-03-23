import { ErrorState } from "@/components/feedback/ScreenStates";
import ProductImage from "@/components/store/ProductImage";
import QuantitySelector from "@/components/store/QuantitySelector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddToCart } from "@/hooks/store/useCart";
import { useGetAllProducts } from "@/hooks/store/useProducts";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Copy,
  Package,
  Share2,
  Shield,
  ShoppingCart,
  Truck,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { SiFacebook, SiWhatsapp } from "react-icons/si";
import { toast } from "sonner";

export default function ProductDetailsPage() {
  const { productId } = useParams({ from: "/product/$productId" });
  const navigate = useNavigate();
  const { data: products, isLoading, error } = useGetAllProducts();
  const addToCart = useAddToCart();
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  const product = products?.find((p) => p.id.toString() === productId);

  const currentURL = typeof window !== "undefined" ? window.location.href : "";

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      for (let i = 0; i < quantity; i++) {
        await addToCart.mutateAsync(product.id);
      }
      toast.success(`${quantity}x ${product.name} cart mein add ho gaya! 🛍️`);
      setQuantity(1);
    } catch {
      toast.error("Cart mein add nahi ho saka, dobara try karein");
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    // Store product in sessionStorage for direct buy (no auth required)
    try {
      sessionStorage.setItem(
        "directBuyProduct",
        JSON.stringify({
          id: product.id.toString(),
          name: product.name,
          price: Number(product.price) * quantity,
          image: product.imageURL || "",
          specs: product.description || "",
        }),
      );
    } catch {
      // ignore
    }
    navigate({ to: "/checkout" });
  };

  const handleWhatsAppShare = () => {
    if (!product) return;
    const text = encodeURIComponent(
      `Check out ${product.name} at A to Z Mobile Store! 📱\n₹${Number(product.price)}\n${currentURL}`,
    );
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
    toast.success("Opening WhatsApp...");
  };

  const handleFacebookShare = () => {
    const fbShareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentURL)}`;
    window.open(
      fbShareURL,
      "_blank",
      "noopener,noreferrer,width=600,height=400",
    );
    toast.success("Opening Facebook share...");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentURL);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-32 mb-8" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          message="Product not found or failed to load."
          onRetry={() => navigate({ to: "/" })}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: "/" })}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Shop
      </Button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-muted shadow-md">
          <ProductImage
            productId={product.id}
            imageURL={product.imageURL}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <Badge
            variant="outline"
            className="w-fit mb-3 text-xs text-muted-foreground"
          >
            A to Z Mobile Store
          </Badge>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-primary">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>
          </div>

          {/* Offer badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
              🎁 Exchange Offer Available
            </span>
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
              📆 No Cost EMI
            </span>
            <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-1 rounded-full">
              💳 Bank Cashback
            </span>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-6">
            {product.description ||
              `${product.name} — ek behtareen smartphone jo aapko best camera, battery aur performance deta hai. Top brand quality ke saath aata hai guarantee aur warranty ke saath.`}
          </p>

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-sm font-semibold mb-2">Quantity</p>
            <QuantitySelector
              value={quantity}
              onChange={setQuantity}
              disabled={addToCart.isPending}
            />
          </div>

          {/* Buy Now + Add to Cart */}
          <div className="flex flex-col gap-3 mb-6">
            <Button
              size="lg"
              className="w-full gap-2 font-bold text-base bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleBuyNow}
              data-ocid="product.buynow.button"
            >
              <Zap className="w-5 h-5" />
              Buy Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full gap-2 font-semibold"
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
              data-ocid="product.addtocart.button"
            >
              <ShoppingCart className="w-5 h-5" />
              {addToCart.isPending ? "Adding to Cart..." : "Add to Cart"}
            </Button>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Share2 className="w-4 h-4" /> Share:
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleWhatsAppShare}
              data-ocid="product.whatsapp.button"
              className="gap-1.5 text-[#25D366] border-[#25D366]/30 hover:bg-[#25D366]/10"
            >
              <SiWhatsapp className="w-4 h-4" />
              WhatsApp
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleFacebookShare}
              data-ocid="product.share.button"
              className="gap-1.5 text-[#1877F2] border-[#1877F2]/30 hover:bg-[#1877F2]/10"
            >
              <SiFacebook className="w-4 h-4" />
              Facebook
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="gap-1.5"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "Copied!" : "Link"}
            </Button>
          </div>

          {/* Features */}
          <Card className="border-border">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold mb-0.5">Free Delivery</h3>
                  <p className="text-sm text-muted-foreground">
                    Orders above ₹999 — All India delivery
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold mb-0.5">Easy Returns</h3>
                  <p className="text-sm text-muted-foreground">
                    7-day hassle-free return policy
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold mb-0.5">Secure Checkout</h3>
                  <p className="text-sm text-muted-foreground">
                    SSL encrypted, 100% safe payments
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
