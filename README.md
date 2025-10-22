![crypto-critters](https://socialify.git.ci/Bob412/crypto-critters/image?custom_description=A+fully+on-chain+NFT+collection+where+each+NFT+is+uniquely+generated+as+an+SVG+directly+on+the+Ethereum+blockchain.+&description=1&font=Inter&forks=1&issues=1&language=1&name=1&owner=1&pattern=Signal&pulls=1&stargazers=1&theme=Auto)

# CryptoCritters 🐾

CryptoCritters is a fully on-chain NFT collection where each NFT is uniquely generated as an SVG directly on the Ethereum blockchain. No IPFS, no external servers - your NFT lives entirely on-chain!

## Features

- 🎨 **On-Chain SVG Generation**: Each CryptoCritter is algorithmically generated as SVG art and stored 100% on-chain
- 🔢 **Unique Combinations**: Various colors, shapes, patterns, and backgrounds create thousands of possible combinations
- 📜 **ERC-721 Standard**: Fully compatible with all major NFT marketplaces and wallets
- 🖼️ **NFT Gallery**: Browse all minted CryptoCritters in our dedicated gallery
- 💸 **Fixed Price Minting**: Just 0.01 ETH to mint your unique digital pet

## Quick Start

### Prerequisites

- Node.js v16+
- Yarn
- MetaMask or another Ethereum wallet

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/bob412/crypto-critters.git
cd crypto-critters
```

2. Install dependencies:

```bash
yarn install
```

3. Start a local Ethereum node:

```bash
yarn hardhat:node
```

4. In a new terminal, deploy the contract to the local node:

```bash
yarn hardhat:deploy
```

5. Start the Next.js development server:

```bash
yarn nextjs:dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Project Structure

```
/crypto-critters
├── packages/
│   ├── hardhat/            # Smart contract development
│   │   ├── contracts/      # Solidity smart contracts
│   │   ├── scripts/        # Deployment scripts
│   │   └── test/           # Contract tests
│   └── nextjs/             # Frontend application
│       ├── components/     # React components
│       ├── lib/            # Utility functions
│       ├── pages/          # Next.js pages
│       └── styles/         # CSS styles
```

## Smart Contract

The CryptoCritters smart contract is built on the ERC-721 standard with the following key features:

- **On-chain Metadata**: Both the image and metadata are generated and stored on-chain
- **Randomized Attributes**: Each NFT has random color, shape, pattern, and size attributes
- **Mint Functionality**: Users can mint new NFTs for a fixed price (0.01 ETH)
- **Owner Withdrawal**: Contract owner can withdraw accumulated ETH from minting fees

## Testing

Run the test suite with:

```bash
yarn hardhat:test
```

## Deployment to Testnet

1. Create a `.env` file in the `packages/hardhat` directory based on `.env.example`.
2. Add your private key and RPC URL.
3. Deploy to Sepolia testnet:

```bash
yarn hardhat:deploy:sepolia
```

## Frontend

The frontend is built with Next.js and includes:

- **Mint Page**: Connect wallet and mint new CryptoCritters
- **Gallery Page**: View all minted CryptoCritters
- **RainbowKit**: Easy wallet connection support
- **Responsive Design**: Works on mobile and desktop

## License

MIT

## Contributors

- bob412

## Acknowledgments

- OpenZeppelin for secure contract libraries
- RainbowKit for wallet connection
- SVG graphics inspired by various digital pets

---

_Note: This is a demo project for educational purposes. Always do your own research before investing in NFTs._
