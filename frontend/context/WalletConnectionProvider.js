import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { BackpackWalletAdapter, GlowWalletAdapter, PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { useMemo } from 'react'

const WalletConnectionProvider = ({ children }) => {
    const endpoint = useMemo(() => 'https://api.devnet.solana.com', [])

    const wallets = useMemo(() => [new PhantomWalletAdapter(), new GlowWalletAdapter(), new BackpackWalletAdapter()], [])

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}

export default WalletConnectionProvider
