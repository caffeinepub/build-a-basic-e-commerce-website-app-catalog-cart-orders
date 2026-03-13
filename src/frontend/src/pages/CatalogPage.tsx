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
  Smartphone,
  Star,
  Tag,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

// ─── Mobile Products ─────────────────────────────────────────────────────────
const STATIC_PRODUCTS = [
  {
    id: "m1",
    name: "Samsung Galaxy S24",
    price: 54999,
    originalPrice: 74999,
    image: "/assets/generated/mobile-samsung-s24.dim_600x800.jpg",
    badge: "SALE" as const,
    category: "Flagship",
    specs: "6.2 inch AMOLED | 50MP | 4000mAh | 8GB RAM",
    offer: "Exchange Bonus ₹5000",
  },
  {
    id: "m2",
    name: "iPhone 15 Pro",
    price: 119999,
    originalPrice: 134900,
    image: "/assets/generated/mobile-iphone15pro.dim_600x800.jpg",
    badge: "NEW" as const,
    category: "Flagship",
    specs: "6.1 inch OLED | 48MP | 3274mAh | A17 Pro",
    offer: "EMI 0% 12 months",
  },
  {
    id: "m3",
    name: "Redmi Note 13 Pro",
    price: 18999,
    originalPrice: 24999,
    image: "/assets/generated/mobile-redmi-note13.dim_600x800.jpg",
    badge: "SALE" as const,
    category: "Mid-Range",
    specs: "6.67 inch AMOLED | 200MP | 5000mAh | 12GB RAM",
    offer: "Coupon: GET500 pe ₹500 off",
  },
  {
    id: "m4",
    name: "Realme 12 Pro+",
    price: 21999,
    originalPrice: 27999,
    image: "/assets/generated/mobile-realme12pro.dim_600x800.jpg",
    badge: "BESTSELLER" as const,
    category: "Mid-Range",
    specs: "6.7 inch OLED | 50MP | 5000mAh | 8GB RAM",
    offer: "Free Earbuds worth ₹2499",
  },
  {
    id: "m5",
    name: "OnePlus 12",
    price: 64999,
    originalPrice: 79999,
    image: "/assets/generated/mobile-oneplus12.dim_600x800.jpg",
    badge: "SALE" as const,
    category: "Flagship",
    specs: "6.82 inch AMOLED | 50MP | 5400mAh | 12GB RAM",
    offer: "Exchange + ₹7000 off",
  },
  {
    id: "m6",
    name: "Vivo V30 Pro",
    price: 34999,
    originalPrice: 42999,
    image: "/assets/generated/mobile-vivo-v30pro.dim_600x800.jpg",
    badge: "NEW" as const,
    category: "Mid-Range",
    specs: "6.78 inch AMOLED | 50MP | 5000mAh | 12GB RAM",
    offer: "Bank offer: 10% cashback",
  },
  {
    id: "m7",
    name: "Oppo Reno 11 Pro",
    price: 29999,
    originalPrice: 39999,
    image: "/assets/generated/mobile-oppo-reno11.dim_600x800.jpg",
    badge: "SALE" as const,
    category: "Mid-Range",
    specs: "6.74 inch AMOLED | 50MP | 4600mAh | 12GB RAM",
    offer: "Free Back Cover + Screen Guard",
  },
  {
    id: "m8",
    name: "Poco X6 Pro",
    price: 22999,
    originalPrice: 29999,
    image: "/assets/generated/mobile-poco-x6pro.dim_600x800.jpg",
    badge: "SALE" as const,
    category: "Budget",
    specs: "6.67 inch AMOLED | 64MP | 5000mAh | 12GB RAM",
    offer: "Gaming Phone - Turbo Edition",
  },
  {
    id: "m9",
    name: "Samsung Galaxy A55",
    price: 27999,
    originalPrice: 34999,
    image: "/assets/generated/mobile-samsung-a55.dim_600x800.jpg",
    badge: null,
    category: "Mid-Range",
    specs: "6.6 inch AMOLED | 50MP | 5000mAh | 8GB RAM",
    offer: "No Cost EMI available",
  },
  {
    id: "m10",
    name: "Motorola Edge 50 Pro",
    price: 31999,
    originalPrice: 39999,
    image: "/assets/generated/mobile-moto-edge50.dim_600x800.jpg",
    badge: "NEW" as const,
    category: "Mid-Range",
    specs: "6.7 inch pOLED | 50MP | 4500mAh | 12GB RAM",
    offer: "₹3000 exchange bonus",
  },
];

// ─── Customer Reviews ─────────────────────────────────────────────────────────
const REVIEWS = [
  {
    name: "Ravi Sharma",
    rating: 5,
    review:
      "Samsung S24 bahut badhiya hai! Camera quality ekdum first class. Delivery bhi fast thi.",
    location: "Mumbai",
  },
  {
    name: "Priya Singh",
    rating: 5,
    review:
      "iPhone 15 Pro mil gaya best price mein! Packing safe thi. Bahut khush hoon!",
    location: "Delhi",
  },
  {
    name: "Suresh Patel",
    rating: 4,
    review:
      "Redmi Note 13 Pro ki battery aur camera dono amazing hain. Value for money!",
    location: "Ahmedabad",
  },
  {
    name: "Amit Verma",
    rating: 5,
    review:
      "OnePlus 12 liya, performance ekdum top hai. Discount aur offer bhi mila. 5 stars!",
    location: "Jaipur",
  },
];

// ─── Special Offers ───────────────────────────────────────────────────────────
const OFFERS = [
  { icon: "💳", title: "Bank Cashback", desc: "10% off on SBI/HDFC cards" },
  {
    icon: "📦",
    title: "Exchange Offer",
    desc: "Old phone pe extra ₹3000-7000",
  },
  { icon: "📆", title: "No Cost EMI", desc: "0% interest upto 12 months" },
  {
    icon: "🎁",
    title: "Free Accessories",
    desc: "Earbuds/Cover with select phones",
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
  const navigate = useNavigate();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setAdding(true);
    await new Promise((r) => setTimeout(r, 500));
    setAdding(false);
    toast.success(`${product.name} cart mein add ho gaya! 🛍️`);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success(`${product.name} -- Checkout pe ja rahe hain!`);
    navigate({ to: "/checkout" });
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
        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
          <Smartphone className="w-3 h-3" />
          {product.category}
        </p>
        <h3 className="font-semibold text-sm leading-snug mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
          {product.specs}
        </p>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-bold text-primary text-base">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          <span className="text-xs text-muted-foreground line-through">
            ₹{product.originalPrice.toLocaleString("en-IN")}
          </span>
        </div>
        {product.offer && (
          <p className="text-xs text-green-600 font-medium mb-2 bg-green-50 rounded px-1.5 py-0.5 truncate">
            🎁 {product.offer}
          </p>
        )}
        <div className="flex flex-col gap-1.5">
          <Button
            size="sm"
            className="w-full gap-1.5 text-xs bg-orange-500 hover:bg-orange-600 text-white font-bold"
            onClick={handleBuyNow}
          >
            <Zap className="w-3.5 h-3.5" />
            Buy Now
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-full gap-1.5 text-xs"
            onClick={handleAddToCart}
            disabled={adding}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {adding ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
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
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | "Budget" | "Mid-Range" | "Flagship"
  >("all");
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
          alt="A to Z Mobile Store - Best Smartphones"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />

        <div className="relative z-10 flex flex-col justify-center h-full container mx-auto px-4">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-[oklch(0.70_0.14_85)] text-[oklch(0.18_0.02_30)] font-semibold text-xs uppercase tracking-wider">
              Best Mobile Deals 2026
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              A to Z
              <br />
              <span className="text-[oklch(0.82_0.14_85)]">Mobile Store</span>
            </h1>
            <p className="text-white/85 text-base md:text-lg mb-8 max-w-lg">
              Top Brands, Best Prices — iPhone, Samsung, OnePlus & More!
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

        <div
          className="absolute bottom-0 left-0 right-0 h-12 bg-background"
          style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
        />
      </section>

      {/* ── B. Special Offers Strip ───────────────────────────────────────── */}
      <section className="py-6 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {OFFERS.map((offer) => (
              <div
                key={offer.title}
                className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4 text-center"
              >
                <span className="text-2xl block mb-1">{offer.icon}</span>
                <p className="font-bold text-sm">{offer.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {offer.desc}
                </p>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="relative w-full rounded-2xl overflow-hidden cursor-pointer group text-left"
            onClick={scrollToProducts}
          >
            <img
              src="/assets/generated/promo-mobile-sale.dim_1200x400.jpg"
              alt="Mobile Sale Up to 40% Off"
              className="w-full object-cover h-36 md:h-52 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent flex items-center">
              <div className="px-6 md:px-10">
                <div className="flex items-center gap-2 mb-1">
                  <Tag className="w-5 h-5 text-[oklch(0.82_0.14_85)]" />
                  <span className="text-[oklch(0.82_0.14_85)] text-sm font-bold uppercase tracking-widest">
                    Sasta Mobile Mahotsav
                  </span>
                </div>
                <h2 className="font-display text-2xl md:text-4xl font-bold text-white leading-tight">
                  SALE UP TO 40% OFF
                </h2>
                <p className="text-white/80 mt-1 text-sm md:text-base">
                  Top smartphones pe bade offers — Jaldi shop karo!
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
              Trending Mobiles
            </h2>
          </div>

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
              Sabhi Mobiles
            </h2>
            <Tabs
              value={categoryFilter}
              onValueChange={(v) =>
                setCategoryFilter(
                  v as "all" | "Budget" | "Mid-Range" | "Flagship",
                )
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
                  value="Budget"
                  data-ocid="catalog.filter.tab"
                  className="text-sm"
                >
                  Budget
                </TabsTrigger>
                <TabsTrigger
                  value="Mid-Range"
                  data-ocid="catalog.filter.tab"
                  className="text-sm"
                >
                  Mid-Range
                </TabsTrigger>
                <TabsTrigger
                  value="Flagship"
                  data-ocid="catalog.filter.tab"
                  className="text-sm"
                >
                  Flagship
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
                Koi mobile nahi mila is category mein.
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
              Dekhiye Latest Mobile Reviews
            </h2>
            <p className="text-muted-foreground">
              Best mobiles ka unboxing aur review dekhein
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-border bg-card">
              {videoPlaying ? (
                <div className="aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                    title="Mobile Review Video"
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
                      Watch Mobile Review
                    </p>
                    <p className="text-white/70 text-sm">
                      Top mobile ka honest review aur comparison
                    </p>
                  </div>
                </button>
              )}
              <div className="p-4 bg-card">
                <p className="text-sm text-muted-foreground text-center">
                  📱 A to Z Mobile Store — Best Smartphone Deals 2026
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
                data-ocid={`catalog.review.card.${i + 1}`}
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
