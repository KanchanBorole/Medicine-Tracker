import { useQuery } from "@tanstack/react-query";

export function useDonations() {
  return useQuery({
    queryKey: ["/api/donations"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
