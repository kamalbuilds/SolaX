# SOLAX: Relax when you have SOLAX

A Cross-Chain, Privacy-Preserving Payments Dapp Powered by Point of Sale for Merchants to Scale built on Solana.

![image](https://github.com/kamalbuilds/SolaX/assets/95926324/b0b9bea2-6089-417a-bfc5-1093e752f781)

![image](https://github.com/kamalbuilds/SolaX/assets/95926324/5176c49a-903a-44a1-88f7-cc9e8aa47fa4)

Solax is an intuitive Peer-to-Peer (P2P) marketplace that simplifies the experience of buying and selling items using different cryptocurrencies. With a focus on privacy and cross-chain compatibility, Solax is powered by the Elusiv protocol for ensuring transactional privacy and the Wormhole protocol for facilitating cross-chain transactions.


Wormhole Bridging token Proof

Bridging MATIC(Mumbai) -> WMATIC(SOLANA Devnet)

https://mumbai.polygonscan.com/tx/0xf3a4c47a7fd37d25350d9cb3e2efc5fc1a38476b2b36488ed9cbf2ff2aba63ac

## 🌟 Features

**One-Click Purchases**: Buy items with a single click, using different cryptocurrencies from different blockchains seamlessly and without the need to understand complex transaction processes.

**No-Code Storefront Setup**: As a merchant, set up your own digital storefront easily with no coding knowledge required. Get your products listed on marketplace page.

**Privacy Protection**: Make purchases with confidence knowing that your personal information and transaction details are kept private, thanks to Elusiv protocol.

**Interoperable Wallets**: No need to switch between different wallets across multiple chains to make transactions on different blockchains. Connect your existing wallets and let our platform handle cross-chain transactions via the Wormhole protocol.

**Simplified Crypto Exchange**: Swap your cryptocurrencies into SOL tokens or other preferred cryptocurrencies easily with our integrated coin-exchange system.

**Transparent Pricing**: See prices in your chosen cryptocurrency and view the value of your holdings across different blockchains all in one place. Thanks to Pyth Pricing Feeds.

**Durable Nounces**: Sign now and pay later when the product is available or Purchase on your own timings.

- Pre-Authorized Payments: Users could pre-authorize the payment for a product that isn't yet available or for a service to be rendered in the future. By using a durable nonce, the buyer can sign the transaction at the time of agreement and the seller can submit it when the product or service is ready.

- Optimized Gas Fees: In a congested network, transaction fees (gas fees) can fluctuate rapidly. Durable nonces can allow users to sign transactions during periods of high fees and then submit them when the fees decrease.

- Batched Transactions: Sometimes, it might be more efficient to batch multiple transactions and process them all at once. Durable nonces can be used to create these transactions ahead of time and then submit them together when ready.

- Time-Dependent Transactions: If you have transactions that are dependent on a specific time or condition, durable nonces can be extremely useful. Users can sign transactions in advance and then have them automatically submitted when the specified conditions are met.

** Solanapay powered QR Code Payments

The Transfer request follows  this mechanism 

![image](https://user-images.githubusercontent.com/95926324/215766384-940c1677-fcc7-4962-892e-a50e3419a86f.png)

* Customer goes to the payment page
* Merchant frontend (client) sends order information to the backend
* Merchant backend (server) generates a reference public key and stores it in a database with the expected amount for the shopping cart / pending purchase (unique to each customer's checkout session).
* Merchant backend redirects the user to the confirmation page with the generated reference public key.
* The confirmation page redirects to the merchant with the transaction signature.
* Merchant backend checks that the transaction is valid for the checkout session by validating the transaction with the reference and amount stored in step 3.
  
## 🔧 Setup

1. Install the dependencies:

```bash
npm install
```

2. Start the application:

```bash
npm start
```

This will start the application on your local machine. 

## 🤝 Connect Wallets

Solax supports multiple wallets. To connect your wallet, go to the 'Wallet' tab and follow the instructions for your preferred wallet.

## 👥 How to Trade

1. Browse the listings on the marketplace or search for a specific item.
2. Click 'Buy' to purchase an item. You can choose to pay with any supported cryptocurrency.
3. Confirm your transaction in your connected wallet.
4. Done! The item is yours.

For selling items, list your product by clicking on 'Sell', fill in the product details, set your price, and you're all set!

## 🙏 Contribute

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute.

## 📝 License

Solax is [MIT licensed](LICENSE).

---

Solax: Making the benefits of decentralized and privacy-preserving transactions accessible to everyone.
