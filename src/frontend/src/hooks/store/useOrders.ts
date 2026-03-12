import type { Order, PaymentMethod } from "@/backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "../useActor";
import { useInternetIdentity } from "../useInternetIdentity";

export function useGetOrdersByUser() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Order[]>({
    queryKey: ["orders", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getOrdersByUser(identity.getPrincipal());
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentMethod: PaymentMethod) => {
      if (!actor) throw new Error("Actor not available");
      return actor.placeOrderWithPaymentMethod(paymentMethod);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cartWithProducts"] });
    },
  });
}
