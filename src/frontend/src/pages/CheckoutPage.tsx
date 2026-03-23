import { PaymentMethod } from "@/backend";
import { EmptyState, ErrorState } from "@/components/feedback/ScreenStates";
import ProductImage from "@/components/store/ProductImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useGetCartWithProducts } from "@/hooks/store/useCart";
import { usePlaceOrder } from "@/hooks/store/useOrders";
import { useNavigate } from "@tanstack/react-router";
import {
  Bitcoin,
  CheckCircle,
  CreditCard,
  MapPin,
  RefreshCw,
  ShoppingBag,
  Smartphone,
  Truck,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Step = 1 | 2 | 3 | 4;

const STEPS = [
  { id: 1, label: "Address" },
  { id: 2, label: "OTP" },
  { id: 3, label: "Captcha" },
  { id: 4, label: "Payment" },
];

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
];

function StepProgress({ currentStep }: { currentStep: Step }) {
  return (
    <div className="flex items-center justify-between mb-8 px-2">
      {STEPS.map((step, index) => (
        <div key={step.id} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step.id < currentStep
                  ? "bg-green-500 text-white"
                  : step.id === currentStep
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {step.id < currentStep ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                step.id
              )}
            </div>
            <span
              className={`text-xs mt-1 font-medium ${
                step.id === currentStep
                  ? "text-orange-600"
                  : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < STEPS.length - 1 && (
            <div
              className={`flex-1 h-1 mx-2 rounded transition-all ${
                step.id < currentStep ? "bg-green-400" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cartWithProducts, isLoading, error } = useGetCartWithProducts();
  const placeOrder = usePlaceOrder();

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId] = useState(() =>
    Math.floor(10000000 + Math.random() * 90000000).toString(),
  );

  const [directBuyProduct] = useState<{
    id: string;
    name: string;
    price: number;
    image: string;
    specs?: string;
  } | null>(() => {
    try {
      const stored = sessionStorage.getItem("directBuyProduct");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Step 1 - Address
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [villageName, setVillageName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>(
    {},
  );

  // Step 2 - OTP
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  // Step 3 - Captcha
  const [captchaA, setCaptchaA] = useState(() =>
    Math.floor(1 + Math.random() * 9),
  );
  const [captchaB, setCaptchaB] = useState(() =>
    Math.floor(1 + Math.random() * 9),
  );
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  // Step 4 - Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.cashOnDelivery,
  );

  const generateCaptcha = () => {
    setCaptchaA(Math.floor(1 + Math.random() * 9));
    setCaptchaB(Math.floor(1 + Math.random() * 9));
    setCaptchaAnswer("");
    setCaptchaError("");
  };

  useEffect(() => {
    if (!otpSent) return;
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [otpSent, resendTimer]);

  const maskMobile = (m: string) =>
    m.length >= 4 ? `${m.slice(0, 2)}XXXXXX${m.slice(-2)}` : m;

  // --- Validation (only required fields: name, mobile, address1, village) ---
  const validateAddress = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = "Naam likhna zaroori hai";
    if (!/^[6-9]\d{9}$/.test(mobile))
      errs.mobile = "Sahi 10-digit mobile number likhein";
    if (!address1.trim()) errs.address1 = "Address likhna zaroori hai";
    if (!villageName.trim())
      errs.villageName = "Gaon/Sheher ka naam likhna zaroori hai";
    // Pincode optional but if filled must be valid
    if (pincode && !/^\d{6}$/.test(pincode))
      errs.pincode = "6-digit pincode likhein";
    setAddressErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddressContinue = () => {
    if (validateAddress()) {
      setOtpSent(true);
      setResendTimer(30);
      setCurrentStep(2);
      toast.success(`OTP bheja gaya ${maskMobile(mobile)} par`);
    }
  };

  const handleOtpContinue = () => {
    if (otp === "123456") {
      setOtpError("");
      setCurrentStep(3);
    } else {
      setOtpError("Galat OTP hai. Dobara try karein. (Demo OTP: 123456)");
    }
  };

  const handleCaptchaContinue = () => {
    if (Number.parseInt(captchaAnswer, 10) === captchaA + captchaB) {
      setCaptchaError("");
      setCurrentStep(4);
    } else {
      setCaptchaError("Galat jawab. Dobara try karein.");
      generateCaptcha();
    }
  };

  const handlePlaceOrder = async () => {
    try {
      await placeOrder.mutateAsync(paymentMethod);
    } catch (err: unknown) {
      const e = err as { message?: string };
      if (e.message?.includes("empty")) {
        toast.error("Cart khaali hai");
        navigate({ to: "/cart" });
        return;
      }
      // Guest checkout - save order to localStorage then show confirmation
      const label =
        {
          [PaymentMethod.cashOnDelivery]: "Cash on Delivery",
          [PaymentMethod.creditCard]: "Credit Card",
          [PaymentMethod.paypal]: "PayPal",
          [PaymentMethod.crypto]: "Cryptocurrency",
        }[paymentMethod] ?? "Cash on Delivery";

      const guestOrder = {
        orderId,
        fullName,
        mobile,
        address: [address1, address2, villageName, city, state, pincode]
          .filter(Boolean)
          .join(", "),
        paymentMethod: label,
        items:
          isDirectBuy && directBuyProduct
            ? [
                {
                  id: directBuyProduct.id,
                  name: directBuyProduct.name,
                  price: directBuyProduct.price,
                  image: directBuyProduct.image,
                  quantity: 1,
                },
              ]
            : uniqueProducts.map((p) => ({
                id: p.id.toString(),
                name: p.name,
                price: Number(p.price),
                image: p.imageURL || "",
                quantity: productCounts[p.id.toString()] || 1,
              })),
        total,
        createdAt: new Date().toISOString(),
      };

      const existingOrders = JSON.parse(
        localStorage.getItem("guestOrders") || "[]",
      );
      existingOrders.unshift(guestOrder);
      localStorage.setItem("guestOrders", JSON.stringify(existingOrders));
      localStorage.removeItem("cart");

      setOrderPlaced(true);
      sessionStorage.removeItem("directBuyProduct");
      toast.success("Booking confirm ho gayi! 🎉");
      return;
    }
    setOrderPlaced(true);
    sessionStorage.removeItem("directBuyProduct");
    toast.success("Booking confirm ho gayi! 🎉");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState message="Checkout load nahi hua. Dobara try karein." />
      </div>
    );
  }

  const isDirectBuy = !!directBuyProduct;

  if (!isDirectBuy && (!cartWithProducts || cartWithProducts.length === 0)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          icon={<ShoppingBag className="w-8 h-8 text-muted-foreground" />}
          title="Cart khaali hai"
          description="Pehle koi product add karein"
          action={{
            label: "Shopping Karein",
            onClick: () => navigate({ to: "/" }),
          }}
        />
      </div>
    );
  }

  const productCounts = (cartWithProducts || []).reduce(
    (acc, product) => {
      const id = product.id.toString();
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const uniqueProducts = (cartWithProducts || []).filter(
    (product, index, self) =>
      self.findIndex((p) => p.id === product.id) === index,
  );

  const total =
    isDirectBuy && directBuyProduct
      ? directBuyProduct.price
      : (cartWithProducts || []).reduce(
          (sum, product) => sum + Number(product.price),
          0,
        );

  const paymentLabel =
    {
      [PaymentMethod.cashOnDelivery]: "Cash on Delivery",
      [PaymentMethod.creditCard]: "Credit Card",
      [PaymentMethod.paypal]: "PayPal",
      [PaymentMethod.crypto]: "Cryptocurrency",
    }[paymentMethod] ?? "Cash on Delivery";

  // --- Order Confirmation Screen ---
  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-green-300 shadow-xl">
            <CardContent className="pt-10 pb-10">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-700 mb-1">
                  🎉 Aapki Booking Confirm Ho Gayi!
                </h2>
                <p className="text-muted-foreground">
                  A to Z Mobile Store par shopping karne ke liye shukriya
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">
                    Order ID
                  </span>
                  <span className="font-bold text-orange-700">#{orderId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">
                    Naam
                  </span>
                  <span className="font-semibold">{fullName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">
                    Mobile
                  </span>
                  <span className="font-semibold">{maskMobile(mobile)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">
                    Payment
                  </span>
                  <span className="font-semibold">{paymentLabel}</span>
                </div>
                <Separator />
                <div className="text-sm">
                  <span className="text-muted-foreground font-medium">
                    Delivery Address
                  </span>
                  <p className="font-semibold mt-1">
                    {address1}
                    {address2 ? `, ${address2}` : ""}
                    {villageName ? `, ${villageName}` : ""}
                    {city ? `, ${city}` : ""}
                    {state ? `, ${state}` : ""}
                    {pincode ? ` – ${pincode}` : ""}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">
                  Order Kiye Gaye Items
                </h3>
                <div className="space-y-3">
                  {isDirectBuy && directBuyProduct ? (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                        <img
                          src={directBuyProduct.image}
                          alt={directBuyProduct.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {directBuyProduct.name}
                        </p>
                        {directBuyProduct.specs && (
                          <p className="text-xs text-muted-foreground">
                            {directBuyProduct.specs}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">Qty: 1</p>
                      </div>
                      <span className="font-semibold text-sm">
                        ₹{directBuyProduct.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ) : (
                    uniqueProducts.map((product) => {
                      const qty = productCounts[product.id.toString()];
                      return (
                        <div
                          key={product.id.toString()}
                          className="flex items-center gap-3"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                            <ProductImage
                              productId={product.id}
                              imageURL={product.imageURL}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Qty: {qty}
                            </p>
                          </div>
                          <span className="font-semibold text-sm">
                            ₹{Number(product.price) * qty}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-orange-600">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <Button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => navigate({ to: "/orders" })}
              >
                Mere Orders Dekho
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Aasaan steps mein apna order complete karein
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Steps */}
        <div className="lg:col-span-2">
          <StepProgress currentStep={currentStep} />

          {/* STEP 1: Address */}
          {currentStep === 1 && (
            <Card className="border-2 border-orange-100">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  Delivery Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-500">*</span> wale fields zaroori
                  hain, baaki optional hain
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="fullName">
                      Poora Naam <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Apna poora naam likhein"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                    {addressErrors.fullName && (
                      <p className="text-xs text-red-500">
                        {addressErrors.fullName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="mobile">
                      Mobile Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="mobile"
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      value={mobile}
                      onChange={(e) =>
                        setMobile(e.target.value.replace(/\D/g, ""))
                      }
                    />
                    {addressErrors.mobile && (
                      <p className="text-xs text-red-500">
                        {addressErrors.mobile}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="address1">
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address1"
                    placeholder="Ghar/flat no., building ka naam"
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                  />
                  {addressErrors.address1 && (
                    <p className="text-xs text-red-500">
                      {addressErrors.address1}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                  <Input
                    id="address2"
                    placeholder="Colony, area, street (optional)"
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="villageName">
                    Gaon / Sheher ka Naam{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="villageName"
                    placeholder="Apne gaon ya sheher ka naam likhein"
                    value={villageName}
                    onChange={(e) => setVillageName(e.target.value)}
                  />
                  {addressErrors.villageName && (
                    <p className="text-xs text-red-500">
                      {addressErrors.villageName}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="city">City (Optional)</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="state">State (Optional)</Label>
                    <select
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="pincode">Pincode (Optional)</Label>
                    <Input
                      id="pincode"
                      placeholder="6-digit pincode"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) =>
                        setPincode(e.target.value.replace(/\D/g, ""))
                      }
                    />
                    {addressErrors.pincode && (
                      <p className="text-xs text-red-500">
                        {addressErrors.pincode}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8"
                    onClick={handleAddressContinue}
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 2: OTP */}
          {currentStep === 2 && (
            <Card className="border-2 border-orange-100">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Smartphone className="w-5 h-5 text-orange-500" />
                  OTP Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 text-sm text-orange-800">
                  OTP bheja gaya <strong>{maskMobile(mobile)}</strong> par.
                  Neeche 6-digit OTP likhein.
                  <span className="block text-xs mt-1 text-orange-600 font-semibold">
                    Demo OTP: 123456
                  </span>
                </div>

                <div className="space-y-1 max-w-xs">
                  <Label htmlFor="otp">OTP Likhein</Label>
                  <Input
                    id="otp"
                    placeholder="6-digit OTP"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="text-lg tracking-widest font-mono"
                    autoFocus
                  />
                  {otpError && (
                    <p className="text-xs text-red-500">{otpError}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm">
                  {resendTimer > 0 ? (
                    <span className="text-muted-foreground">
                      Resend OTP <strong>{resendTimer}s</strong> mein
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="flex items-center gap-1 text-orange-600 hover:underline font-medium"
                      onClick={() => {
                        setResendTimer(30);
                        toast.success(
                          `OTP wapas bheja gaya ${maskMobile(mobile)} par`,
                        );
                      }}
                    >
                      <RefreshCw className="w-3 h-3" /> OTP Dubara Bhejein
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    Wapas
                  </Button>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8"
                    onClick={handleOtpContinue}
                  >
                    Verify & Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 3: Captcha */}
          {currentStep === 3 && (
            <Card className="border-2 border-orange-100">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle className="w-5 h-5 text-orange-500" />
                  Security Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <p className="text-sm text-muted-foreground">
                  Neeche ka math problem solve karein.
                </p>

                <div className="flex items-center gap-4">
                  <div className="bg-muted rounded-xl px-6 py-4 text-2xl font-bold font-mono tracking-wider select-none">
                    {captchaA} + {captchaB} = ?
                  </div>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-orange-500 transition-colors"
                    onClick={generateCaptcha}
                    title="New captcha"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1 max-w-xs">
                  <Label htmlFor="captcha">Jawab Likhein</Label>
                  <Input
                    id="captcha"
                    placeholder="Jawab"
                    value={captchaAnswer}
                    onChange={(e) =>
                      setCaptchaAnswer(e.target.value.replace(/\D/g, ""))
                    }
                    autoFocus
                  />
                  {captchaError && (
                    <p className="text-xs text-red-500">{captchaError}</p>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    Wapas
                  </Button>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8"
                    onClick={handleCaptchaContinue}
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 4: Payment */}
          {currentStep === 4 && (
            <Card className="border-2 border-orange-100">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="w-5 h-5 text-orange-500" />
                  Payment Method Chunein
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) =>
                    setPaymentMethod(value as PaymentMethod)
                  }
                >
                  <div className="space-y-3">
                    {[
                      {
                        value: PaymentMethod.cashOnDelivery,
                        label: "Cash on Delivery",
                        sub: "Delivery par cash dein",
                        icon: <Truck className="w-5 h-5 text-orange-500" />,
                      },
                      {
                        value: PaymentMethod.creditCard,
                        label: "Credit / Debit Card",
                        sub: "Card se secure payment",
                        icon: (
                          <CreditCard className="w-5 h-5 text-orange-500" />
                        ),
                      },
                      {
                        value: PaymentMethod.paypal,
                        label: "PayPal / UPI",
                        sub: "Fast aur secure payment",
                        icon: <Wallet className="w-5 h-5 text-orange-500" />,
                      },
                      {
                        value: PaymentMethod.crypto,
                        label: "Cryptocurrency",
                        sub: "Bitcoin ya doosri crypto se pay karein",
                        icon: <Bitcoin className="w-5 h-5 text-orange-500" />,
                      },
                    ].map((opt) => (
                      <div
                        key={opt.value}
                        className={`flex items-center space-x-3 border-2 rounded-xl p-4 cursor-pointer transition-all ${
                          paymentMethod === opt.value
                            ? "border-orange-400 bg-orange-50"
                            : "border-border hover:border-orange-200"
                        }`}
                        onClick={() => setPaymentMethod(opt.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ")
                            setPaymentMethod(opt.value);
                        }}
                      >
                        <RadioGroupItem value={opt.value} id={opt.value} />
                        <Label
                          htmlFor={opt.value}
                          className="flex items-center gap-3 cursor-pointer flex-1"
                        >
                          {opt.icon}
                          <div>
                            <div className="font-semibold">{opt.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {opt.sub}
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                <div className="flex items-center gap-3 pt-2">
                  <Button variant="outline" onClick={() => setCurrentStep(3)}>
                    Wapas
                  </Button>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 flex-1"
                    onClick={handlePlaceOrder}
                    disabled={placeOrder.isPending}
                  >
                    {placeOrder.isPending
                      ? "Order Place Ho Raha Hai..."
                      : "Order Confirm Karein"}
                  </Button>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Order place karke aap hamare Terms & Conditions se agree karte
                  hain.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-1">
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Order Items ({isDirectBuy ? 1 : (cartWithProducts?.length ?? 0)}
                )
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isDirectBuy && directBuyProduct ? (
                <div className="flex gap-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
                    <img
                      src={directBuyProduct.image}
                      alt={directBuyProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {directBuyProduct.name}
                    </p>
                    {directBuyProduct.specs && (
                      <p className="text-xs text-muted-foreground truncate">
                        {directBuyProduct.specs}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">Qty: 1</p>
                  </div>
                  <div className="text-right font-semibold text-sm shrink-0">
                    ₹{directBuyProduct.price.toLocaleString("en-IN")}
                  </div>
                </div>
              ) : (
                uniqueProducts.map((product) => {
                  const quantity = productCounts[product.id.toString()];
                  return (
                    <div key={product.id.toString()} className="flex gap-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
                        <ProductImage
                          productId={product.id}
                          imageURL={product.imageURL}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {quantity}
                        </p>
                      </div>
                      <div className="text-right font-semibold text-sm shrink-0">
                        ₹{Number(product.price) * quantity}
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          <Card className="sticky top-20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">₹{total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">₹0</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-orange-600">₹{total}</span>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-700">
                ✅ Is order par free delivery milegi
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
