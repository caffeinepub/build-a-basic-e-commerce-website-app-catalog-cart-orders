import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Set "mo:core/Set";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

import Text "mo:core/Text";
import MixinStorage "blob-storage/Mixin";


actor {
  include MixinStorage();

  // Stable state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var nextProductId = 1;
  var nextOrderId = 1;

  type PaymentMethod = {
    #creditCard;
    #paypal;
    #crypto;
    #cashOnDelivery;
    #klarnaPayLater;
  };

  type RichProduct = {
    id : Nat;
    name : Text;
    price : Nat;
    description : Text;
    imageURL : Text;
  };

  let products = Map.empty<Nat, RichProduct>();

  let carts = Map.empty<Principal, Set.Set<Nat>>();

  type Order = {
    id : Nat;
    customer : Principal;
    items : [Nat];
    total : Nat;
    paymentMethod : PaymentMethod;
  };

  let orders = Map.empty<Nat, Order>();

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func searchProducts(keyword : Text) : async [RichProduct] {
    if (products.isEmpty()) {
      Runtime.trap("Shop has not been initialized.");
    };
    let filtered = products.values().toArray().filter(
      func(product) {
        let nameContains = product.name.toLower().contains(#text(keyword.toLower()));
        let descContains = product.description.toLower().contains(#text(keyword.toLower()));
        nameContains or descContains;
      }
    );
    filtered;
  };

  public query ({ caller }) func filterProductsByPriceRange(minPrice : Nat, maxPrice : Nat) : async [RichProduct] {
    if (products.isEmpty()) {
      Runtime.trap("Shop has not been initialized.");
    };
    let filtered = products.values().toArray().filter(
      func(product) {
        product.price >= minPrice and product.price <= maxPrice;
      }
    );
    filtered;
  };

  public query ({ caller }) func filterProductsByPriceCategory(category : Text) : async [RichProduct] {
    if (products.isEmpty()) {
      Runtime.trap("Shop has not been initialized.");
    };

    let priceFiltered = switch (category) {
      case ("low") {
        products.values().toArray().filter(
          func(product) {
            product.price <= 100;
          }
        );
      };
      case ("medium") {
        products.values().toArray().filter(
          func(product) {
            product.price > 100 and product.price <= 1200;
          }
        );
      };
      case ("high") {
        products.values().toArray().filter(
          func(product) {
            product.price > 1200 and product.price <= 6850;
          }
        );
      };
      case ("luxury") {
        products.values().toArray().filter(
          func(product) {
            product.price > 6850 and product.price <= 6900;
          }
        );
      };
      case ("superluxury") {
        products.values().toArray().filter(
          func(product) {
            product.price >= 10000 and product.price <= 10900;
          }
        );
      };
      case ("exclusive") {
        products.values().toArray().filter(
          func(product) {
            product.price >= 10999;
          }
        );
      };
      case (_) {
        products.values().toArray();
      };
    };

    priceFiltered;
  };

  public query ({ caller }) func getProduct(productId : Nat) : async ?RichProduct {
    if (products.isEmpty()) {
      Runtime.trap("Shop has not been initialized.");
    };
    products.get(productId);
  };

  // Store Initialization (Admin only)
  public query ({ caller }) func isStoreInitialized() : async Bool {
    products.size() > 0;
  };

  public shared ({ caller }) func initializeStore() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can initialize store.");
    };
    if (products.size() > 0) {
      Runtime.trap("Store already initialized.");
    };

    let productList : [(Nat, Text, Nat, Text, Text)] = [
      (1, "Super Expensive T-Shirt", 10900, "The most expensive t-shirt you'll ever see.", "/10900-tshirt.jpg"),
      (2, "Regular T-Shirt", 25, "Great value everyday t-shirt.", "/tshirt.jpg"),
      (3, "Designer Hoodie", 150, "Designer hoodie with unique style.", "/hoodie.jpg"),
      (4, "Vintage Hat", 5000, "Rare vintage hat for collectors.", "/hat.jpg"),
      (5, "Classic Socks", 10, "Classic and comfortable socks.", "/socks.jpg"),
      (6, "Luxury Dress", 10999, "High-end dress for special occasions.", "/luxury-dress.jpg"),
      (7, "Regular Jeans", 60, "Durable and comfortable jeans.", "/jeans.jpg"),
      (8, "Evening Shoes", 6850, "Elegant shoes for formal occasions.", "/evening-shoes.jpg"),
      (9, "Casual Sneakers", 75, "Casual sneakers for everyday use.", "/sneakers.jpg"),
      (10, "Designer Backpack", 150, "Stylish and practical backpack.", "/backpack.jpg"),
      (11, "Handcrafted Jewelry", 10999, "Exquisite, handcrafted jewelry pieces.", "/handcrafted-jewelry.jpg"),
      (12, "Sustainable Sneakers", 160, "Eco-friendly sneakers made from sustainable materials.", "/sustainable-sneakers.jpg"),
      (13, "Casual Denim Jacket", 140, "Classic denim jacket for a casual look.", "/casual-denim-jacket.jpg"),
      (14, "Performance Sportswear Set", 130, "High-performance sportswear for active lifestyles.", "/performance-sportswear.jpg"),
      (15, "Elegant Dress Watch", 159, "Sophisticated dress watch for formal occasions.", "/elegant-dress-watch.jpg"),
      (16, "Outdoor Hiking Gear", 250, "Durable and functional gear for outdoor enthusiasts.", "/outdoor-hiking-gear.jpg"),
      (17, "Tech-Savvy Backpack", 180, "Innovative backpack features for tech-savvy individuals.", "/tech-savvy-backpack.jpg"),
      (18, "Artisanal Handbags", 300, "Exquisite, handcrafted handbags by skilled artisans.", "/artisanal-handbags.jpg"),
      (19, "Smart Wearable Accessories", 110, "Innovative accessories with integrated smart technology.", "/smart-wearable-accessories.jpg"),
      (20, "Customizable Home Decor", 200, "Personalized and customizable decor to enrich your living spaces.", "/customizable-home-decor.jpg")
    ];

    for ((id, name, price, description, imageURL) in productList.values()) {
      let product : RichProduct = {
        id;
        name;
        price;
        description;
        imageURL;
      };
      products.add(id, product);
    };

    nextProductId := productList.size() + 1;
  };

  // Product Catalog (Public read-only)
  public query ({ caller }) func getAllProducts() : async [RichProduct] {
    if (products.isEmpty()) {
      Runtime.trap("Shop has not been initialized.");
    };
    products.values().toArray();
  };

  public query ({ caller }) func isProductInCatalog(productId : Nat) : async Bool {
    products.containsKey(productId);
  };

  // Cart Management (User only)
  public shared ({ caller }) func addToCart(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add items to cart");
    };
    if (not products.containsKey(productId)) {
      Runtime.trap("Product does not exist.");
    };

    let cart = switch (carts.get(caller)) {
      case (null) { Set.singleton<Nat>(productId) };
      case (?existingCart) { existingCart.clone().add(productId); existingCart };
    };

    carts.add(caller, cart);
  };

  public query ({ caller }) func getCart() : async [Nat] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cart");
    };
    switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart.values().toArray() };
    };
  };

  public query ({ caller }) func calculateCartTotal() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can calculate cart total");
    };
    var total = 0;
    switch (carts.get(caller)) {
      case (null) {};
      case (?cart) {
        for (productId in cart.values()) {
          switch (products.get(productId)) {
            case (null) {};
            case (?product) { total += product.price };
          };
        };
      };
    };
    total;
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear cart");
    };
    carts.remove(caller);
  };

  public shared ({ caller }) func removeFromCart(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove items from cart");
    };
    switch (carts.get(caller)) {
      case (null) {
        Runtime.trap("Cart is empty, cannot remove item.");
      };
      case (?cart) {
        cart.remove(productId);
        if (cart.isEmpty()) {
          carts.remove(caller);
        } else {
          carts.add(caller, cart);
        };
      };
    };
  };

  public query ({ caller }) func calculateCartTotals() : async { subtotal : Nat; tax : Nat; total : Nat } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can calculate cart totals");
    };
    var subtotal = 0;
    switch (carts.get(caller)) {
      case (null) {};
      case (?cart) {
        for (productId in cart.values()) {
          switch (products.get(productId)) {
            case (null) {};
            case (?product) { subtotal += product.price };
          };
        };
      };
    };
    let tax = subtotal / 10;
    let total = subtotal + tax;
    {
      subtotal;
      tax = tax : Nat;
      total;
    };
  };

  // Order Management
  public shared ({ caller }) func placeOrderWithPaymentMethod(payment : PaymentMethod) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty.") };
      case (?cart) { cart };
    };

    if (cart.isEmpty()) {
      Runtime.trap("Cart is empty.");
    };

    var total = 0;
    let items = cart.toArray();

    for (productId in items.values()) {
      switch (products.get(productId)) {
        case (null) { Runtime.trap("Product not found in cart.") };
        case (?product) { total += product.price };
      };
    };

    let order : Order = {
      id = nextOrderId;
      customer = caller;
      items;
      total;
      paymentMethod = payment;
    };

    orders.add(nextOrderId, order);
    carts.remove(caller);
    nextOrderId += 1;
    order.id;
  };

  public query ({ caller }) func getOrder(orderId : Nat) : async ?Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    switch (orders.get(orderId)) {
      case (null) { null };
      case (?order) {
        // Users can only view their own orders, admins can view all
        if (order.customer == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?order;
        } else {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
      };
    };
  };

  public query ({ caller }) func getOrdersByUser(user : Principal) : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };
    let userOrders = orders.values().toArray().filter(
      func(order) {
        order.customer == user;
      }
    );
    userOrders;
  };

  public query ({ caller }) func getOrderHistory() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view order history");
    };
    let callerOrders = orders.values().toArray().filter(
      func(order) {
        order.customer == caller;
      }
    );
    callerOrders;
  };

  // Admin views for all orders
  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can view all orders.");
    };
    orders.values().toArray();
  };
};
