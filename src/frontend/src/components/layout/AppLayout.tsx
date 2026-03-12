import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { type ReactNode, useState } from "react";
import {
  SiFacebook,
  SiInstagram,
  SiWhatsapp,
  SiX,
  SiYoutube,
} from "react-icons/si";
import { toast } from "sonner";
import HeaderNav from "./HeaderNav";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(
    window.location.hostname || "gautam-fashion-store",
  );
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setSubscribed(true);
    setEmail("");
    toast.success("🎉 Subscribed! You'll get exclusive offers & new arrivals.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background bg-mandala-pattern">
      <HeaderNav />
      <main className="flex-1 w-full">{children}</main>

      {/* Newsletter Banner */}
      <section className="bg-primary text-primary-foreground py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-display text-2xl font-bold mb-2">
              Exclusive Offers, Straight to You 💌
            </h3>
            <p className="text-primary-foreground/80 mb-6 text-sm">
              Subscribe karo aur pao: special discounts, new arrivals & festive
              sale alerts
            </p>
            {subscribed ? (
              <p className="text-primary-foreground font-semibold text-lg">
                ✅ Shukriya! Aapko jald hi email milega.
              </p>
            ) : (
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <Input
                  type="email"
                  placeholder="Apna email daalein..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-ocid="footer.newsletter.input"
                  className="bg-primary-foreground text-foreground placeholder:text-muted-foreground border-0 flex-1"
                  required
                />
                <Button
                  type="submit"
                  data-ocid="footer.newsletter.button"
                  variant="secondary"
                  className="shrink-0 font-semibold"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* Brand column */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/assets/generated/store-logo-transparent.dim_512x512.png"
                  alt="Gautam Fashion Store"
                  className="h-10 w-10 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <span className="font-display text-xl font-bold text-primary">
                  Gautam Fashion
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Premium Indian ethnic wear delivered to your doorstep. Saree,
                Lehenga, Sherwani — har occasion ke liye perfect look.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Facebook"
                >
                  <SiFacebook className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Instagram"
                >
                  <SiInstagram className="w-5 h-5" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="YouTube"
                >
                  <SiYoutube className="w-5 h-5" />
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="X / Twitter"
                >
                  <SiX className="w-5 h-5" />
                </a>
                <a
                  href="https://wa.me/918382027626"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="WhatsApp"
                >
                  <SiWhatsapp className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-display font-bold text-base mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/" className="hover:text-primary transition-colors">
                    Shop All
                  </Link>
                </li>
                <li>
                  <Link
                    to="/orders"
                    className="hover:text-primary transition-colors"
                  >
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cart"
                    className="hover:text-primary transition-colors"
                  >
                    Cart
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-primary transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <a
                    href="/about#privacy"
                    className="hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/about#terms"
                    className="hover:text-primary transition-colors"
                  >
                    Terms &amp; Conditions
                  </a>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-display font-bold text-base mb-4">
                Categories
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <span className="hover:text-primary transition-colors cursor-pointer">
                    Women's Ethnic
                  </span>
                </li>
                <li>
                  <span className="hover:text-primary transition-colors cursor-pointer">
                    Men's Ethnic
                  </span>
                </li>
                <li>
                  <span className="hover:text-primary transition-colors cursor-pointer">
                    Sarees
                  </span>
                </li>
                <li>
                  <span className="hover:text-primary transition-colors cursor-pointer">
                    Lehengas
                  </span>
                </li>
                <li>
                  <span className="hover:text-primary transition-colors cursor-pointer">
                    Sherwanis
                  </span>
                </li>
                <li>
                  <span className="hover:text-primary transition-colors cursor-pointer">
                    Kurta Sets
                  </span>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-display font-bold text-base mb-4">
                Contact Us
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                  <a
                    href="tel:+919876543210"
                    className="hover:text-primary transition-colors"
                  >
                    +91 98765 43210
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <SiWhatsapp className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                  <a
                    href="https://wa.me/918382027626"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    WhatsApp Support
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                  <a
                    href="mailto:gautamfashion@email.com"
                    className="hover:text-primary transition-colors"
                  >
                    gautamfashion@email.com
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                  <span>Jaipur, Rajasthan, India</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
            <p>© {currentYear} Gautam Fashion Store. All rights reserved.</p>
            <p>
              Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
