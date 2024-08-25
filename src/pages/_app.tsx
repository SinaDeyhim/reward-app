"use client";
import "../globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import "react-toastify/dist/ReactToastify.css";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { sepolia, baseSepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import React from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Web3Provider } from "@/providers/Web3Provider";
import { ToastContainer } from "react-toastify";

const config = getDefaultConfig({
  appName: "sepian-test",
  projectId: "b26700d46e5114f9cc79a5c3ba745a3a",
  chains: [sepolia, baseSepolia],
});

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Web3Provider>
            <ErrorBoundary>
              <>
                <Component {...pageProps} />
                <ToastContainer />
              </>
            </ErrorBoundary>
          </Web3Provider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
