// @ts-nocheck
import WormholeBridge, { Theme, OPACITY, WormholeConnectConfig } from '@wormhole-foundation/wormhole-connect'; 

const config= {
  env: "mainnet",
  networks: ["ethereum", "polygon", "solana"],
  tokens: ["ETH", "WETH", "MATIC", "WMATIC","USDC","Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"],
  rpc: {
    ethereum: "https://rpc.ankr.com/eth",
    solana: "https://solana-mainnet.g.alchemy.com/v2/SW3uzyu7hPsAhI5878T7jffYghoOuDLk",
  },
  mode: 'dark',
}
const Bridge = () => {

  return (
    <div className="flex min-h-screen">

      <main className="flex flex-1 flex-col">
        <>
          <WormholeBridge />
        </>
      </main>
    </div>
  );
};

export default Bridge;