import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface RichProduct {
    id: bigint;
    name: string;
    description: string;
    imageURL: string;
    price: bigint;
}
export interface Order {
    id: bigint;
    total: bigint;
    paymentMethod: PaymentMethod;
    customer: Principal;
    items: Array<bigint>;
}
export interface UserProfile {
    name: string;
}
export enum PaymentMethod {
    creditCard = "creditCard",
    cashOnDelivery = "cashOnDelivery",
    crypto = "crypto",
    klarnaPayLater = "klarnaPayLater",
    paypal = "paypal"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addToCart(productId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    calculateCartTotal(): Promise<bigint>;
    calculateCartTotals(): Promise<{
        tax: bigint;
        total: bigint;
        subtotal: bigint;
    }>;
    clearCart(): Promise<void>;
    filterProductsByPriceCategory(category: string): Promise<Array<RichProduct>>;
    filterProductsByPriceRange(minPrice: bigint, maxPrice: bigint): Promise<Array<RichProduct>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<RichProduct>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<bigint>>;
    getOrder(orderId: bigint): Promise<Order | null>;
    getOrderHistory(): Promise<Array<Order>>;
    getOrdersByUser(user: Principal): Promise<Array<Order>>;
    getProduct(productId: bigint): Promise<RichProduct | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeStore(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isProductInCatalog(productId: bigint): Promise<boolean>;
    isStoreInitialized(): Promise<boolean>;
    placeOrderWithPaymentMethod(payment: PaymentMethod): Promise<bigint>;
    removeFromCart(productId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchProducts(keyword: string): Promise<Array<RichProduct>>;
}
