import { NetworkEnum } from "@underdog-protocol/js";

import clsx from "clsx";
import { sizeToDimensionsClassName } from "../../lib/tailwind";
import { PublicKeyInitData } from "@solana/web3.js";
import { openOnXray, shortenAddress, viewAccountOnExplorer } from "../../lib/index";

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

  console.log(publicKey);

  if (!publicKey) return null;

  return (
    <div className={publicKeyLinkClassName}>
      {showExplorer && (
        <button
          onClick={() => viewAccountOnExplorer(publicKey.toString(), network)}
          className="flex-shrink-0"
        >
          <div className="flex gap-3 items-center">
            <img
              src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
              className="h-[25px] w-[25px] rounded-full"
              alt="solana"
            />
            <p className="text-gray-600 text-[18px]	">{shortenAddress(publicKey.toString())}</p>
          </div>
        </button>
      )}
      {showXray && (
        <button onClick={() => openOnXray(publicKey)} className="flex-shrink-0">
          <img
            src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
            className={sizeToDimensionsClassName["xs"]}
            alt="solana"
          />
          <p className="text-gray-600 ">{shortenAddress(publicKey.toString())}</p>
        </button>
      )}

      {/* <p className="text-light">{shortenAddress(publicKey.toString())}</p> */}
    </div>
  );
}
