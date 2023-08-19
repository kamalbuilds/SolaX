import { NetworkEnum } from "@underdog-protocol/js";

import clsx from "clsx";
import { sizeToDimensionsClassName } from "@/lib/tailwind";
import { PublicKeyInitData } from "@solana/web3.js";
import { openOnXray, shortenAddress, viewAccountOnExplorer } from "@/lib";

type PublicKeyLinkProps = {
  publicKey: PublicKeyInitData;
  className?: string;
  showExplorer?: boolean;
  showXray?: boolean;
  network?: NetworkEnum;
};

export function PublicKeyLink({
  className,
  publicKey,
  showExplorer = false,
  showXray = false,
  network,
}: PublicKeyLinkProps) {
  const publicKeyLinkClassName = clsx("flex space-x-2 items-center", className);

  if (!publicKey) return null;

  return (
    <div className={publicKeyLinkClassName}>
      {showExplorer && (
        <button
          onClick={() => viewAccountOnExplorer(publicKey.toString(), network)}
          className="flex-shrink-0"
        >
          <img
            src="/solana.png"
            className="h-5 w-5"
            alt="solana"
          />
        </button>
      )}
      {showXray && (
        <button onClick={() => openOnXray(publicKey)} className="flex-shrink-0">
          <img
            src="/xray.jpeg"
            className={sizeToDimensionsClassName["xs"]}
            alt="solana"
          />
        </button>
      )}

      <p className="text-light">{shortenAddress(publicKey.toString())}</p>
    </div>
  );
}
