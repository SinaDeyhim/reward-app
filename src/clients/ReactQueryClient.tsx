import { QueryClient, QueryClientProvider, Hydrate } from "react-query";
import { ReactNode, useState } from "react";

export function useQueryClient() {
  const [queryClient] = useState(() => new QueryClient());
  return queryClient;
}

interface HydrateWrapperProps {
  children: ReactNode;
  dehydratedState: unknown;
}

export function HydrateWrapper({
  children,
  dehydratedState,
}: HydrateWrapperProps) {
  const queryClient = useQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>{children}</Hydrate>
    </QueryClientProvider>
  );
}
