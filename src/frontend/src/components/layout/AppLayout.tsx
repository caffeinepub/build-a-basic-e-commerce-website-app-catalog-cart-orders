import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, X } from "lucide-react";
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
    window.location.hostname || "a-to-z-mobile-store",
  );
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [showWhatsAppTooltip, setShowWhatsAppTooltip] = useState(true);

  const whatsappNumber = "918382027626";
  const whatsappMessage = encodeURIComponent(
    "Hello! A to Z Mobile Store se ek query hai.",
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

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
                  alt="A to Z Mobile Store"
                  className="h-10 w-10 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <span className="font-display text-xl font-bold text-primary">
                  A to Z Mobile
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Premium mobile phones delivered to your doorstep. Samsung,
                iPhone, OnePlus — har budget ke liye best smartphone.
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
                  href="https://instagram.com/gautamrajbhar41357"
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
                  href={whatsappUrl}
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
                    Samsung
                  </span>
                </li>
                <li>
                  <span className="hover:text-primary transition-colors cursor-pointer">
                    iPhone
                  </span>
                </li>
                <li>
                  <span className="hover:text-primary transition-colors cursor-pointer">
                    OnePlus
                  </span>
                </li>
                <li>
                  <span className="hover:text-primary transition-colors cursor-pointer">
                    Redmi
                  </span>
                </li>
                <li>
                  <span className="hover:text-primary transition-colors cursor-pointer">
                    Realme
                  </span>
                </li>
                <li>
                  <span className="hover:text-primary transition-colors cursor-pointer">
                    All Brands
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
                    href="tel:+919415290758"
                    className="hover:text-primary transition-colors"
                  >
                    +91 94152 90758
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <SiWhatsapp className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    +91 83820 27626
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <SiInstagram className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                  <a
                    href="https://instagram.com/gautamrajbhar41357"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    @gautamrajbhar41357
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                  <a
                    href="mailto:singhnitish8625@gmail.com"
                    className="hover:text-primary transition-colors"
                  >
                    singhnitish8625@gmail.com
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                  <span>Ckt (Chiraiyakot), Mau, India</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
            <p>© {currentYear} A to Z Mobile Store. All rights reserved.</p>
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

      {/* Floating WhatsApp Chat Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {showWhatsAppTooltip && (
          <div className="relative bg-white text-gray-800 text-sm font-medium px-4 py-2 rounded-2xl shadow-lg border border-gray-100 max-w-[200px] text-center animate-fade-in">
            <button
              type="button"
              onClick={() => setShowWhatsAppTooltip(false)}
              className="absolute -top-2 -right-2 bg-gray-200 hover:bg-gray-300 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
              aria-label="Close"
              data-ocid="whatsapp.tooltip.close_button"
            >
              <X className="w-3 h-3" />
            </button>
            Humse WhatsApp par baat karein! 💬
            <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45" />
          </div>
        )}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-ocid="whatsapp.chat.button"
          className="flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20b858] text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Chat on WhatsApp"
        >
          <SiWhatsapp className="w-7 h-7" />
        </a>
      </div>
    </div>
  );
}
