import { Badge } from "@/components/ui/badge";
import { useGetCart } from "@/hooks/store/useCart";
import { useActor } from "@/hooks/useActor";
import { useCurrentUserProfile } from "@/hooks/useCurrentUserProfile";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Package, ShoppingCart, Store } from "lucide-react";
import { useState } from "react";
import LoginButton from "../auth/LoginButton";

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

export default function HeaderNav() {
  const navigate = useNavigate();
  const { data: cart } = useGetCart();
  const { data: userProfile } = useCurrentUserProfile();
  const { data: isAdmin } = useIsAdmin();
  const cartItemCount = cart?.length || 0;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0"
          >
            <img
              src="/assets/generated/store-logo-transparent.dim_512x512.png"
              alt="A to Z Mobile Store"
              className="h-10 w-10 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg font-bold text-primary leading-tight hidden sm:block">
                A to Z Mobile
              </span>
              <span className="font-display text-lg font-bold text-primary leading-tight sm:hidden">
                GFS
              </span>
              <span className="text-xs text-muted-foreground hidden sm:block tracking-widest uppercase">
                Store
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              data-ocid="nav.shop.link"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary hover:text-primary transition-colors"
            >
              <Store className="w-4 h-4" />
              Shop
            </Link>
            <Link
              to="/about"
              data-ocid="nav.about.link"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              to="/orders"
              data-ocid="nav.orders.link"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary hover:text-primary transition-colors"
            >
              <Package className="w-4 h-4" />
              Orders
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                data-ocid="nav.admin.link"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary hover:text-primary transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin
              </Link>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {userProfile && (
              <span className="hidden sm:inline text-sm text-muted-foreground font-medium">
                {userProfile.name}
              </span>
            )}
            <button
              type="button"
              onClick={() => navigate({ to: "/cart" })}
              data-ocid="nav.cart.button"
              className="relative p-2 hover:bg-secondary rounded-full transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </button>
            <LoginButton />

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md hover:bg-secondary transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span
                  className={`block h-0.5 bg-foreground transition-transform ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`}
                />
                <span
                  className={`block h-0.5 bg-foreground transition-opacity ${menuOpen ? "opacity-0" : ""}`}
                />
                <span
                  className={`block h-0.5 bg-foreground transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden border-t border-border py-3 space-y-1 animate-fade-in-up">
            <Link
              to="/"
              data-ocid="nav.shop.link"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary transition-colors w-full"
            >
              <Store className="w-4 h-4" /> Shop
            </Link>
            <Link
              to="/about"
              data-ocid="nav.about.link"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary transition-colors w-full"
            >
              About
            </Link>
            <Link
              to="/orders"
              data-ocid="nav.orders.link"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary transition-colors w-full"
            >
              <Package className="w-4 h-4" /> Orders
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                data-ocid="nav.admin.link"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary transition-colors w-full"
              >
                <LayoutDashboard className="w-4 h-4" /> Admin
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
