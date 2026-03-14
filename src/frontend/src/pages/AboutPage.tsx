import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, Mail, MapPin, Package, Phone, Star, Truck } from "lucide-react";
import { SiFacebook, SiInstagram, SiWhatsapp } from "react-icons/si";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-20 bg-primary/5 border-b border-border overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, oklch(0.42 0.18 20 / 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, oklch(0.70 0.14 85 / 0.12) 0%, transparent 40%)",
          }}
        />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            <Heart className="w-4 h-4 fill-primary" /> Made with Love in India
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            A to Z Mobile Store
          </h1>
          <p className="text-xl text-muted-foreground font-display italic mb-2">
            "Aapki Apni Mobile Duniya"
          </p>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Premium mobile phones — delivered with care, chosen for you.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-10 max-w-4xl">
        {/* Our Story */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="font-display text-2xl flex items-center gap-2">
              <span className="text-2xl">📱</span> Hamari Kahani (Our Story)
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none text-muted-foreground space-y-3">
            <p>
              A to Z Mobile Store ki shuruaat ek sapne se hui — ek aisa store
              banana jo premium smartphones ko har ghar tak pahuncha sake.
              Hamare founder ne Chiraiyakot, Mau se is safar ki shuruaat ki.
            </p>
            <p>
              Aaj hum 10,000+ khush grahak ke saath India ke sabse trusted
              mobile phone stores mein se ek hain. Hamare paas Samsung, iPhone,
              OnePlus, Redmi, Realme aur aur brands ke best models hain.
            </p>
            <p>
              Chahe pehla smartphone ho ya upgrade — A to Z Mobile Store mein
              aapke liye perfect phone hai.
            </p>
          </CardContent>
        </Card>

        {/* Mission */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="font-display text-2xl flex items-center gap-2">
              <span className="text-2xl">🎯</span> Hamaara Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="mb-4">
              Hamara mission hai ki har Indian ko high-quality, affordable aur
              authentic smartphone milna chahiye. Hum ensure karte hain:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  icon: <Star className="w-5 h-5" />,
                  title: "Premium Quality",
                  desc: "Genuine phones aur best warranty",
                },
                {
                  icon: <Truck className="w-5 h-5" />,
                  title: "Fast Delivery",
                  desc: "Pan-India 3-5 din mein delivery",
                },
                {
                  icon: <Package className="w-5 h-5" />,
                  title: "Safe Packaging",
                  desc: "Phone bilkul safe pahunche",
                },
                {
                  icon: <Heart className="w-5 h-5" />,
                  title: "Customer First",
                  desc: "100% satisfaction guarantee",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 p-3 rounded-lg bg-secondary/40"
                >
                  <span className="text-primary mt-0.5">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {item.title}
                    </p>
                    <p className="text-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="border-border shadow-sm" id="contact">
          <CardHeader>
            <CardTitle className="font-display text-2xl flex items-center gap-2">
              <span className="text-2xl">📞</span> Humse Sampark Karein
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <a
                href="tel:+919415290758"
                className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-secondary/40 transition-colors"
              >
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Phone / Call</p>
                  <p className="text-muted-foreground text-sm">
                    +91 94152 90758
                  </p>
                </div>
              </a>
              <a
                href="https://wa.me/919415290758"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-secondary/40 transition-colors"
              >
                <SiWhatsapp className="w-5 h-5 text-[#25D366] shrink-0" />
                <div>
                  <p className="font-semibold text-sm">WhatsApp</p>
                  <p className="text-muted-foreground text-sm">
                    +91 94152 90758
                  </p>
                </div>
              </a>
              <a
                href="mailto:singhnitish8625@gmail.com"
                className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-secondary/40 transition-colors"
              >
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Email</p>
                  <p className="text-muted-foreground text-sm">
                    singhnitish8625@gmail.com
                  </p>
                </div>
              </a>
              <div className="flex items-center gap-3 p-4 rounded-xl border border-border">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Address</p>
                  <p className="text-muted-foreground text-sm">
                    Ckt (Chiraiyakot), Mau, UP, India
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <span className="text-sm text-muted-foreground">
                Social Media:
              </span>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="gap-1.5 text-[#E4405F] border-[#E4405F]/30 hover:bg-[#E4405F]/10"
              >
                <a
                  href="https://instagram.com/gautamrajbhar41357"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SiInstagram className="w-4 h-4" /> @gautamrajbhar41357
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="gap-1.5 text-[#1877F2] border-[#1877F2]/30 hover:bg-[#1877F2]/10"
              >
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SiFacebook className="w-4 h-4" /> Facebook
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Policy */}
        <Card className="border-border shadow-sm" id="privacy">
          <CardHeader>
            <CardTitle className="font-display text-2xl flex items-center gap-2">
              <span className="text-2xl">🔒</span> Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none text-muted-foreground space-y-3">
            <p>
              <strong className="text-foreground">Data Collection:</strong> Hum
              aapka naam, email, aur shipping address collect karte hain — sirf
              order process karne ke liye.
            </p>
            <p>
              <strong className="text-foreground">Data Usage:</strong> Aapka
              data kisi third party ko nahi becha jaata. Sirf delivery aur
              customer support ke liye use hota hai.
            </p>
            <p>
              <strong className="text-foreground">Cookies:</strong> Hum basic
              analytics cookies use karte hain jisse aapka shopping experience
              behtar bane.
            </p>
            <p>
              <strong className="text-foreground">Security:</strong> Aapka data
              SSL encryption se protect hai. Payment details directly payment
              gateway par process hoti hain.
            </p>
            <p>
              <strong className="text-foreground">Contact:</strong> Privacy
              concerns ke liye email karein:{" "}
              <a
                href="mailto:singhnitish8625@gmail.com"
                className="text-primary"
              >
                singhnitish8625@gmail.com
              </a>
            </p>
          </CardContent>
        </Card>

        <Separator />

        {/* Terms & Conditions */}
        <Card className="border-border shadow-sm" id="terms">
          <CardHeader>
            <CardTitle className="font-display text-2xl flex items-center gap-2">
              <span className="text-2xl">📋</span> Terms &amp; Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none text-muted-foreground space-y-3">
            <p>
              <strong className="text-foreground">Orders:</strong> Order place
              karne ke baad 24 ghante mein cancel kar sakte hain. Baad mein
              cancellation possible nahi.
            </p>
            <p>
              <strong className="text-foreground">Returns:</strong> Product
              receive karne ke 7 din mein return request karein. Product unused
              aur original packaging mein hona chahiye.
            </p>
            <p>
              <strong className="text-foreground">Delivery:</strong> Standard
              delivery 3-5 business days. Delivery timeline location ke hisaab
              se vary kar sakta hai.
            </p>
            <p>
              <strong className="text-foreground">Pricing:</strong> Sab prices
              inclusive of taxes hain. Delivery charges ₹999 se upar ke orders
              par free hain.
            </p>
            <p>
              <strong className="text-foreground">Dispute Resolution:</strong>{" "}
              Kisi bhi vivad mein Chiraiyakot, Mau ki courts jurisdiction
              rahegi.
            </p>
            <p>
              <strong className="text-foreground">Amendments:</strong> Hum in
              terms ko kabhi bhi update kar sakte hain. Latest version website
              par hi hoga.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
