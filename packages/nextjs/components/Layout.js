import React from "react";
import Head from "next/head";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const Layout = ({ children }) => {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>CryptoCritters | NFT Collection</title>
        <meta
          name="description"
          content="Mint and collect unique CryptoCritters NFTs"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-gradient-to-r from-primary to-accent shadow-md">
        <nav className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <Link
              href="/"
              className="text-white text-2xl font-bold flex items-center"
            >
              <span className="mr-2">🐾</span> CryptoCritters
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              href="/"
              className="text-white hover:text-gray-200 font-medium"
            >
              Mint
            </Link>
            <Link
              href="/gallery"
              className="text-white hover:text-gray-200 font-medium"
            >
              Gallery
            </Link>
            <ConnectButton showBalance={false} />
          </div>
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-4xl font-bold text-gray-700 mb-4">
              👋 Welcome to CryptoCritters!
            </div>
            <div className="text-xl text-gray-600 mb-8">
              Connect your wallet to mint and view unique NFTs
            </div>
            <ConnectButton />
          </div>
        ) : (
          children
        )}
      </main>

      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link href="/" className="text-xl font-bold">
                CryptoCritters
              </Link>
              <p className="text-sm mt-1 text-gray-300">
                © 2024 CryptoCritters. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a
                href="https://github.com/yourusername/crypto-critters"
                className="text-gray-300 hover:text-white"
              >
                GitHub
              </a>
              <a
                href="https://twitter.com/cryptocritters"
                className="text-gray-300 hover:text-white"
              >
                Twitter
              </a>
              <a
                href="https://discord.gg/cryptocritters"
                className="text-gray-300 hover:text-white"
              >
                Discord
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
