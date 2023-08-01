import React, { useEffect, useRef } from "react";
import { Box, useMediaQuery } from "@chakra-ui/react";

let tvScriptLoadingPromise;

export default function TradingViewWidget() {
  const [isLargerThan1280] = useMediaQuery("(min-width: 1280px)");
  const onLoadScriptRef = useRef();

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.id = "tradingview-widget-loading-script";
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.onload = resolve;

        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(
      () => onLoadScriptRef.current && onLoadScriptRef.current()
    );

    return () => (onLoadScriptRef.current = null);

    function createWidget() {
      if (document.getElementById("tradingview") && "TradingView" in window) {
        new window.TradingView.widget({
          autosize: true,
          symbol: "PYTH:SOLUSD",
          interval: "D",
          timezone: "Etc/UTC",
          theme: "light",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: "tradingview",
        });
      }
    }

  }, []);

  return (
    <Box 
      id="tradingview" 
      position="fixed" 
      w={isLargerThan1280 ? "full" : "100%"} 
      h={isLargerThan1280 ? "full" : "100%"} 
      top="0"
      zIndex="9999"
    />
  );
}
