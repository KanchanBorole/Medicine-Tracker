import { useQuery } from "@tanstack/react-query";

export function useMedicines() {
  return useQuery({
    queryKey: ["/api/medicines"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
