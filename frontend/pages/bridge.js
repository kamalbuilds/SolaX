// @ts-nocheck
import WormholeBridge, { Theme, OPACITY, WormholeConnectConfig } from '@wormhole-foundation/wormhole-connect';
import Sidebar from "../components/sidebar"; 

const config= {
  env: "mainnet",
  networks: ["ethereum", "polygon", "solana"],
  tokens: ["ETH", "WETH", "MATIC", "WMATIC","USDC","Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"],
  rpc: {
    ethereum: "https://rpc.ankr.com/eth",
    solana: "https://solana-devnet.g.alchemy.com/v2/7rwYXko3FDfNXH1zD-Y3o2Gd1LTlzTfU",
  },
  mode: 'dark',
}
const Bridge = () => {

  return (
    <div className="flex min-h-screen">

      <Sidebar />

      <main className="flex flex-1 flex-col">
        <>
          <WormholeBridge />
        </>
      </main>
    </div>
  );
};

export default Bridge;