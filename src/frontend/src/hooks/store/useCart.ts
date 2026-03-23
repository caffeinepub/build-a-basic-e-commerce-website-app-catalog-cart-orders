import type { RichProduct } from "@/backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "../useActor";
import { useInternetIdentity } from "../useInternetIdentity";
import { useGetAllProducts } from "./useProducts";

const LOCAL_CART_KEY = "local_cart_items";

function getLocalCart(): bigint[] {
  try {
    const raw = localStorage.getItem(LOCAL_CART_KEY);
    if (!raw) return [];
    const arr: string[] = JSON.parse(raw);
    return arr.map((s) => BigInt(s));
  } catch {
    return [];
  }
}

function setLocalCart(items: bigint[]) {
  localStorage.setItem(
    LOCAL_CART_KEY,
    JSON.stringify(items.map((b) => b.toString())),
  );
}

export function useGetCart() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isLoggedIn = !!identity;

  return useQuery<bigint[]>({
    queryKey: ["cart"],
    queryFn: async () => {
      if (isLoggedIn && actor) {
        return actor.getCart();
      }
      // Guest: use localStorage
      return getLocalCart();
    },
    enabled: !isFetching,
    refetchOnWindowFocus: true,
  });
}

export function useGetCartWithProducts() {
  const { data: cart } = useGetCart();
  const { data: products } = useGetAllProducts();

  return useQuery<RichProduct[]>({
    queryKey: ["cartWithProducts", cart?.map((id) => id.toString())],
    queryFn: async () => {
      if (!cart || !products) return [];
      return cart
        .map((productId) => products.find((p) => p.id === productId))
        .filter((p): p is RichProduct => p !== undefined);
    },
    enabled: !!products,
  });
}

export function useAddToCart() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: bigint) => {
      if (identity && actor) {
        return actor.addToCart(productId);
      }
      // Guest: save to localStorage
      const current = getLocalCart();
      current.push(productId);
      setLocalCart(current);
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cartWithProducts"] });
    },
  });
}

export function useClearCart() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (identity && actor) {
        return actor.clearCart();
      }
      // Guest: clear localStorage
      localStorage.removeItem(LOCAL_CART_KEY);
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cartWithProducts"] });
    },
  });
}
