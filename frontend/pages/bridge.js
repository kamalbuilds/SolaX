// @ts-nocheck
import WormholeBridge, { Theme, OPACITY, WormholeConnectConfig } from '@wormhole-foundation/wormhole-connect';
import Sidebar from "../components/sidebar"; 

// const customized: Theme = {
//   primary: grey,
//   secondary: grey,
//   divider: '#ffffff' + OPACITY[20],
//   background: {
//     default: '#232323',
//   },
//   text: {
//     primary: '#ffffff',
//     secondary: grey[500],
//   },
//   error: red,
//   info: lightblue,
//   success: green,
//   warning: orange,
//   button: {
//     primary: '#ffffff' + OPACITY[20],
//     primaryText: '#ffffff',
//     disabled: '#ffffff' + OPACITY[10],
//     disabledText: '#ffffff' + OPACITY[40],
//     action: orange[300],
//     actionText: '#000000',
//     hover: '#ffffff' + OPACITY[7],
//   },
//   options: {
//     hover: '#474747',
//     select: '#5b5b5b',
//   },
//   card: {
//     background: '#333333',
//     secondary: '#474747',
//     elevation: 'none',
//   },
//   popover: {
//     background: '#1b2033',
//     secondary: '#ffffff' + OPACITY[5],
//     elevation: 'none',
//   },
//   modal: {
//     background: '#474747',
//   },
// };
// const config: WormholeConnectConfig = {
//   mode: 'dark',
//   customTheme: customized,
// }

const config= {
  env: "mainnet",
  networks: ["ethereum", "polygon", "solana"],
  tokens: ["ETH", "WETH", "MATIC", "WMATIC"],
  rpc: {
    ethereum: "https://rpc.ankr.com/eth",
    solana: "https://solana-mainnet.g.alchemy.com/v2/SW3uzyu7hPsAhI5878T7jffYghoOuDLk",
  },
  mode: 'dark',
}
const Bridge = () => {

  return (
    <div className="flex min-h-screen">

      <Sidebar />

      <main className="flex flex-1 flex-col">
        <>
          <WormholeBridge config={config} />
        </>
      </main>
    </div>
  );
};

export default Bridge;