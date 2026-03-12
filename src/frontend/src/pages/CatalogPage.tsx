import { ProductGridSkeleton } from "@/components/feedback/ScreenStates";
import ProductCard from "@/components/store/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAddToCart } from "@/hooks/store/useCart";
import { useGetAllProducts } from "@/hooks/store/useProducts";
import { useNavigate } from "@tanstack/react-router";
import {
  ChevronRight,
  Play,
  ShoppingCart,
  Star,
  Tag,
  TrendingUp,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

// ─── Static Products ─────────────────────────────────────────────────────────
const STATIC_PRODUCTS = [
  {
    id: "s1",
    name: "Blue Embroidered Kurta Set",
    price: 1299,
    originalPrice: 1899,
    image: "/assets/generated/product-kurta-blue.dim_600x800.jpg",
    badge: "SALE" as const,
    category: "Women",
  },
  {
    id: "s2",
    name: "Cream Sherwani",
    price: 3499,
    originalPrice: 4999,
    image: "/assets/generated/product-sherwani.dim_600x800.jpg",
    badge: "NEW" as const,
    category: "Men",
  },
  {
    id: "s3",
    name: "Red Silk Saree",
    price: 2199,
    originalPrice: 3200,
    image: "/assets/generated/product-saree-red.dim_600x800.jpg",
    badge: "SALE" as const,
    category: "Women",
  },
  {
    id: "s4",
    name: "White Casual Kurta",
    price: 899,
    originalPrice: 1299,
    image: "/assets/generated/product-kurta-white.dim_600x800.jpg",
    badge: null,
    category: "Men",
  },
  {
    id: "s5",
    name: "Pink Lehenga Choli",
    price: 4999,
    originalPrice: 7999,
    image: "/assets/generated/product-lehenga-pink.dim_600x800.jpg",
    badge: "BESTSELLER" as const,
    category: "Women",
  },
  {
    id: "s6",
    name: "Green Pathani Suit",
    price: 1599,
    originalPrice: 2100,
    image: "/assets/generated/product-pathani-green.dim_600x800.jpg",
    badge: "NEW" as const,
    category: "Men",
  },
  {
    id: "s7",
    name: "Purple Anarkali Suit",
    price: 2799,
    originalPrice: 3999,
    image: "/assets/generated/product-anarkali-purple.dim_600x800.jpg",
    badge: "SALE" as const,
    category: "Women",
  },
  {
    id: "s8",
    name: "Yellow Silk Kurta",
    price: 1899,
    originalPrice: 2599,
    image: "/assets/generated/product-kurta-yellow.dim_600x800.jpg",
    badge: null,
    category: "Men",
  },
  {
    id: "s9",
    name: "Turquoise Palazzo Set",
    price: 1099,
    originalPrice: 1599,
    image: "/assets/generated/product-palazzo-turquoise.dim_600x800.jpg",
    badge: "SALE" as const,
    category: "Women",
  },
  {
    id: "s10",
    name: "White Dhoti Kurta Set",
    price: 2299,
    originalPrice: 3100,
    image: "/assets/generated/product-dhoti-white.dim_600x800.jpg",
    badge: "NEW" as const,
    category: "Men",
  },
];

// ─── Customer Reviews ─────────────────────────────────────────────────────────
const REVIEWS = [
  {
    name: "Priya Sharma",
    rating: 5,
    review:
      "Bahut sundar kapde mile! Quality ekdum first class hai. Main dobaara order karungi.",
    location: "Mumbai",
  },
  {
    name: "Rahul Verma",
    rating: 5,
    review:
      "Sherwani ka quality amazing hai. Shaadi mein bahut tarif hui. Highly recommended!",
    location: "Delhi",
  },
  {
    name: "Sunita Patel",
    rating: 4,
    review:
      "Lehenga bilkul picture jaisa aaya. Stitching tight hai. Happy customer!",
    location: "Ahmedabad",
  },
  {
    name: "Amit Kumar",
    rating: 5,
    review:
      "Fast delivery, packaging ekdum safe. Kurta ka colour exact same as shown. 5 stars!",
    location: "Jaipur",
  },
];

// ─── Badge styles ─────────────────────────────────────────────────────────────
function ProductBadge({ badge }: { badge: string | null }) {
  if (!badge) return null;
  const styles = {
    SALE: "bg-destructive text-destructive-foreground",
    NEW: "bg-[oklch(0.45_0.15_160)] text-white",
    BESTSELLER: "bg-[oklch(0.70_0.14_85)] text-[oklch(0.18_0.02_30)]",
  } as const;
  return (
    <span
      className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full z-10 ${styles[badge as keyof typeof styles] || "bg-muted text-foreground"}`}
    >
      {badge}
    </span>
  );
}

// ─── Static Product Card ──────────────────────────────────────────────────────
function StaticProductCard({
  product,
  index,
}: { product: (typeof STATIC_PRODUCTS)[0]; index: number }) {
  const discountPct = Math.round(
    (1 - product.price / product.originalPrice) * 100,
  );
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    setAdding(true);
    await new Promise((r) => setTimeout(r, 500));
    setAdding(false);
    toast.success(`${product.name} added to cart! 🛍️`);
  };

  return (
    <div
      data-ocid={`catalog.product.card.${index}`}
      className="group bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="relative overflow-hidden aspect-[3/4] bg-muted">
        <ProductBadge badge={product.badge} />
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {discountPct > 0 && (
          <span className="absolute top-2 right-2 bg-black/70 text-white text-xs font-bold px-1.5 py-0.5 rounded">
            -{discountPct}%
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
        <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-bold text-primary text-base">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          <span className="text-xs text-muted-foreground line-through">
            ₹{product.originalPrice.toLocaleString("en-IN")}
          </span>
        </div>
        <Button
          size="sm"
          className="w-full gap-1.5 text-xs"
          onClick={handleAddToCart}
          disabled={adding}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {adding ? "Adding..." : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`w-4 h-4 ${n <= rating ? "fill-[oklch(0.70_0.14_85)] text-[oklch(0.70_0.14_85)]" : "text-muted-foreground"}`}
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CatalogPage() {
  const navigate = useNavigate();
  const { data: products, isLoading } = useGetAllProducts();
  const addToCart = useAddToCart();
  const [categoryFilter, setCategoryFilter] = useState<"all" | "Men" | "Women">(
    "all",
  );
  const [videoPlaying, setVideoPlaying] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);

  const handleAddToCart = async (productId: bigint) => {
    try {
      await addToCart.mutateAsync(productId);
      toast.success("Added to cart! 🛍️");
    } catch (error: unknown) {
      const err = error as { message?: string };
      if (err.message?.includes("Unauthorized")) {
        toast.error("Please sign in to add items to cart");
      } else {
        toast.error("Failed to add to cart");
      }
    }
  };

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filteredProducts = STATIC_PRODUCTS.filter((p) =>
    categoryFilter === "all" ? true : p.category === categoryFilter,
  );

  const trendingProducts = STATIC_PRODUCTS.slice(0, 4);

  return (
    <div className="w-full">
      {/* ── A. Hero Section ──────────────────────────────────────────────── */}
      <section className="relative w-full h-[420px] md:h-[520px] lg:h-[600px] overflow-hidden">
        <img
          src="/assets/generated/hero-banner.dim_1600x600.png"
          alt="Gautam Fashion Store - Premium Indian Fashion"
          className="absolute inset-0 w-full h-full object-cover"
          priority-fetch="high"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />

        <div className="relative z-10 flex flex-col justify-center h-full container mx-auto px-4">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-[oklch(0.70_0.14_85)] text-[oklch(0.18_0.02_30)] font-semibold text-xs uppercase tracking-wider">
              New Collection 2026
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Gautam
              <br />
              <span className="text-[oklch(0.82_0.14_85)]">Fashion Store</span>
            </h1>
            <p className="text-white/85 text-base md:text-lg mb-8 max-w-lg">
              Premium Indian Fashion — Delivered to Your Door
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={scrollToProducts}
                data-ocid="catalog.hero.button"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2"
              >
                Shop Now <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate({ to: "/about" })}
                className="border-white/50 text-white hover:bg-white/10 hover:text-white bg-transparent backdrop-blur-sm"
              >
                About Us
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative diagonal stripe */}
        <div
          className="absolute bottom-0 left-0 right-0 h-12 bg-background"
          style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
        />
      </section>

      {/* ── B. Promo Banner Strip ─────────────────────────────────────────── */}
      <section className="py-6 bg-background">
        <div className="container mx-auto px-4">
          <button
            type="button"
            className="relative w-full rounded-2xl overflow-hidden cursor-pointer group text-left"
            onClick={scrollToProducts}
          >
            <img
              src="/assets/generated/promo-banner-sale.dim_1200x400.jpg"
              alt="Sale Up to 50% Off"
              className="w-full object-cover h-36 md:h-52 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent flex items-center">
              <div className="px-6 md:px-10">
                <div className="flex items-center gap-2 mb-1">
                  <Tag className="w-5 h-5 text-[oklch(0.82_0.14_85)]" />
                  <span className="text-[oklch(0.82_0.14_85)] text-sm font-bold uppercase tracking-widest">
                    Limited Time
                  </span>
                </div>
                <h2 className="font-display text-2xl md:text-4xl font-bold text-white leading-tight">
                  SALE UP TO 50% OFF
                </h2>
                <p className="text-white/80 mt-1 text-sm md:text-base">
                  On selected ethnic wear — Shop before it's gone!
                </p>
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* ── C. Trending Products ─────────────────────────────────────────── */}
      <section className="py-10 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="font-display text-2xl md:text-3xl font-bold">
              Trending This Week
            </h2>
          </div>

          {/* Backend products if loaded */}
          {isLoading ? (
            <ProductGridSkeleton count={4} />
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.slice(0, 4).map((product) => (
                <div key={product.id.toString()} className="relative">
                  <span className="absolute -top-2 -left-2 z-10 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full shadow">
                    TRENDING
                  </span>
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    isAddingToCart={addToCart.isPending}
                  />
                </div>
              ))}
            </div>
          ) : (
            // Show static trending if backend empty
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trendingProducts.map((product, i) => (
                <div key={product.id} className="relative">
                  <span className="absolute -top-2 -left-2 z-10 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full shadow">
                    TRENDING
                  </span>
                  <StaticProductCard product={product} index={i + 1} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── D. Full Product Catalog ───────────────────────────────────────── */}
      <section className="py-10 bg-background" ref={productsRef}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="font-display text-2xl md:text-3xl font-bold">
              Our Collection
            </h2>
            <Tabs
              value={categoryFilter}
              onValueChange={(v) =>
                setCategoryFilter(v as "all" | "Men" | "Women")
              }
            >
              <TabsList className="bg-secondary">
                <TabsTrigger
                  value="all"
                  data-ocid="catalog.filter.tab"
                  className="text-sm"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="Men"
                  data-ocid="catalog.filter.tab"
                  className="text-sm"
                >
                  Men
                </TabsTrigger>
                <TabsTrigger
                  value="Women"
                  data-ocid="catalog.filter.tab"
                  className="text-sm"
                >
                  Women
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
            {filteredProducts.map((product, i) => (
              <StaticProductCard
                key={product.id}
                product={product}
                index={i + 1}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div
              data-ocid="catalog.product.empty_state"
              className="text-center py-16"
            >
              <p className="text-muted-foreground">
                Koi product nahi mila is category mein.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setCategoryFilter("all")}
              >
                Sab Dekho
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ── E. Video Section ─────────────────────────────────────────────── */}
      <section className="py-12 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
              See Our Latest Collection
            </h2>
            <p className="text-muted-foreground">
              Hamare exclusive collection ka experience karo
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-border bg-card">
              {videoPlaying ? (
                <div className="aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                    title="Gautam Fashion Store Collection Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  className="relative w-full aspect-video bg-gradient-to-br from-primary/20 via-accent/10 to-teal/10 flex items-center justify-center cursor-pointer group"
                  onClick={() => setVideoPlaying(true)}
                >
                  <img
                    src="/assets/generated/hero-banner.dim_1600x600.png"
                    alt="Video thumbnail"
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-8 h-8 text-primary-foreground fill-primary-foreground ml-1" />
                    </div>
                    <p className="text-white font-display text-xl font-semibold drop-shadow">
                      Watch Our Collection
                    </p>
                    <p className="text-white/70 text-sm">
                      Hamare latest designs aur collection dekhein
                    </p>
                  </div>
                </button>
              )}
              <div className="p-4 bg-card">
                <p className="text-sm text-muted-foreground text-center">
                  🎬 Gautam Fashion Store — Exclusive 2026 Ethnic Wear
                  Collection
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── F. Customer Reviews ───────────────────────────────────────────── */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
              Happy Customers 💬
            </h2>
            <p className="text-muted-foreground">
              Hamare customers ki experience jaanein
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {REVIEWS.map((review, i) => (
              <Card
                key={review.name}
                data-ocid={`catalog.product.card.${i + 1}`}
                className="hover:shadow-md transition-shadow duration-300 border-border"
              >
                <CardContent className="p-5">
                  <StarRating rating={review.rating} />
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed italic">
                    "{review.review}"
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary">
                        {review.name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold leading-none">
                        {review.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {review.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Strip ──────────────────────────────────────────────────── */}
      <section className="py-8 bg-primary/5 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: "🚚", label: "Free Delivery", sub: "Orders above ₹999" },
              { icon: "↩️", label: "Easy Returns", sub: "7-day return policy" },
              {
                icon: "🔒",
                label: "Secure Payment",
                sub: "SSL encrypted checkout",
              },
              { icon: "⭐", label: "1000+ Reviews", sub: "Verified customers" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-1"
              >
                <span className="text-2xl">{item.icon}</span>
                <p className="font-semibold text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
