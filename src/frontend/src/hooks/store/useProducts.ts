import type { RichProduct } from "@/backend";
import { useQuery } from "@tanstack/react-query";
import { useActor } from "../useActor";

export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<RichProduct[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
