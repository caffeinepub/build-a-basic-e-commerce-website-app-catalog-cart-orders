import type { RichProduct } from "@/backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "../useActor";
import { useInternetIdentity } from "../useInternetIdentity";
import { useGetAllProducts } from "./useProducts";

export function useGetCart() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<bigint[]>({
    queryKey: ["cart"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCart();
    },
    enabled: !!actor && !!identity && !isFetching,
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
    enabled: !!cart && !!products,
  });
}

export function useAddToCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addToCart(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cartWithProducts"] });
    },
  });
}

export function useClearCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.clearCart();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cartWithProducts"] });
    },
  });
}
