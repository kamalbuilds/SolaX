import Head from "next/head";
import "../styles/globals.css";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { AuthProvider } from '../AuthContext';
import WalletConnectionProvider from "../context/WalletConnectionProvider";
import { useState } from "react";
import { MetaplexProvider } from "../context/Metaplex";
import { AuctionHouseProvider } from "../context/AuctionHouse";
import Sidebar from "../components/sidebar";
import { ChakraProvider } from "@chakra-ui/react";
import  SolPriceProvider  from "../context/SolPriceProvider.tsx";
import  theme from "../components/theme";
import { ColorModeScript } from "@chakra-ui/color-mode";
import ToggleColorMode from "../components/ToggleColorMode";
import { SphereProvider } from "@spherelabs/react";
import { useSphere } from "@spherelabs/react";

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <title>SOLAX</title>
      </Head>

      <AuthProvider>  
        <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <WalletConnectionProvider>
              <MetaplexProvider>
                <AuctionHouseProvider>
                  <SolPriceProvider>
                    <SphereProvider>
                    <>
                      <div className="flex min-h-screen ">
                        <Sidebar />
                        <main className="flex flex-1 flex-col">
                          <ToggleColorMode />
                          <Component {...pageProps} />
                        </main>
                      </div>
                    </>
                    </SphereProvider>
                  </SolPriceProvider>
                </AuctionHouseProvider>
              </MetaplexProvider>
            </WalletConnectionProvider>
          </Hydrate>
        </QueryClientProvider>
        </ChakraProvider>
        </AuthProvider>
    </>
  );
}

export default MyApp;
