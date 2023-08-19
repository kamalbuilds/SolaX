import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PublicKeyInitData } from "@solana/web3.js";
import { NetworkEnum } from "@underdog-protocol/types";

export const networkToCluster = (network?: NetworkEnum) => {
  switch (network) {
    case NetworkEnum.Mainnet:
      return WalletAdapterNetwork.Mainnet;

    case NetworkEnum.Devnet:
      return WalletAdapterNetwork.Devnet;

    case NetworkEnum.Localnet:
      return "custom";

    default:
      return WalletAdapterNetwork.Mainnet;
  }
};

export const openOnXray = (mintAddressValue: PublicKeyInitData) => {
  window.open(`https://xray.helius.xyz/token/${mintAddressValue.toString()}`);
};

export const viewAccountOnExplorer = (publicKey: PublicKeyInitData, network?: NetworkEnum) => {
  window.open(`https://explorer.solana.com/address/${publicKey}?cluster=${networkToCluster(network)}`);
};


export const shortenAddress = (address: PublicKeyInitData, chars = 4) => {
  return `${address.toString().slice(0, chars)}...${address
    .toString()
    .slice(-chars)}`;
};
