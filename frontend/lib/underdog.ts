import { createUnderdogClient } from "@underdog-protocol/js";
import { NetworkEnum } from "@underdog-protocol/types";

export const underdogClient = createUnderdogClient({
  network: process.env.NEXT_PUBLIC_NETWORK as NetworkEnum,
  apiKey: process.env.UNDERDOG_API_KEY!,
});
