import { useState } from "react";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import DataTagger from "@/components/DataTagger";
import { QueryClient, QueryClientProvider } from "react-query";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300 mx-2">
      <header className="p-4 w-full bg-primary-light dark:bg-primary-dark text-white flex flex-row">
        <div className="w-full flex justify-end">
          <ConnectButton />
        </div>
      </header>
      <main className="w-full mx-2">
        <DataTagger />
      </main>
    </div>
  );
};

export default function Page(props: any) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  );
}
