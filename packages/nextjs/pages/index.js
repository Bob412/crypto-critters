import React, { useState, useEffect } from "react";
import { useProvider, useSigner, useAccount, useNetwork } from "wagmi";
import { parseEther } from "ethers/lib/utils";
import { getMintPrice, mintNFT } from "../lib/contract";

export default function Home() {
  const [mintPrice, setMintPrice] = useState("0.01");
  const [isMinting, setIsMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState(null);
  const [mintedTokenId, setMintedTokenId] = useState(null);
  const [error, setError] = useState(null);

  const provider = useProvider();
  const { data: signer } = useSigner();
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  useEffect(() => {
    const fetchMintPrice = async () => {
      if (provider && chain) {
        try {
          const price = await getMintPrice(provider, chain.id);
          setMintPrice(price);
        } catch (err) {
          console.error("Failed to fetch mint price:", err);
        }
      }
    };

    fetchMintPrice();
  }, [provider, chain]);

  const handleMint = async () => {
    if (!signer || !isConnected || !chain) {
      setError("Please connect your wallet first");
      return;
    }

    setIsMinting(true);
    setMintStatus("Initializing mint process...");
    setError(null);

    try {
      setMintStatus("Minting your NFT...");

      const tx = await mintNFT(signer, chain.id);

      setMintStatus("Transaction confirmed! Finding your new NFT...");

      // Find the Minted event in the transaction logs
      const mintedEvent = tx.events?.find((event) => event.event === "Minted");
      const tokenId = mintedEvent?.args?.tokenId.toNumber();

      if (tokenId !== undefined) {
        setMintedTokenId(tokenId);
        setMintStatus("Success! Your CryptoCritter has been minted!");
      } else {
        setMintStatus("Minting successful, but couldn't find your token ID.");
      }
    } catch (err) {
      console.error("Mint error:", err);
      setError(err.message || "An error occurred during the minting process");
      setMintStatus(null);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-4xl font-bold mb-8 text-primary">
          Mint Your CryptoCritter
        </h1>

        <div className="bg-white p-8 rounded-xl shadow-xl mint-card">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Create a Unique Digital Pet
            </h2>
            <p className="text-gray-600">
              Each CryptoCritter is algorithmically generated on-chain with
              unique properties. No IPFS, no external servers - your NFT lives
              entirely on the blockchain!
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="w-40 h-40 bg-gray-200 rounded-lg flex items-center justify-center">
              {isMinting ? (
                <div className="loading-spinner text-5xl">🐾</div>
              ) : (
                <div className="text-5xl">🎁</div>
              )}
            </div>
          </div>

          <div className="p-4 bg-gray-100 rounded-lg mb-6">
            <div className="font-semibold text-lg mb-1">Mint Price</div>
            <div className="text-2xl font-bold text-primary">
              {mintPrice} ETH
            </div>
          </div>

          {error && (
            <div className="p-3 mb-4 bg-red-100 text-red-800 rounded-lg">
              {error}
            </div>
          )}

          {mintStatus && !error && (
            <div className="p-3 mb-4 bg-blue-100 text-blue-800 rounded-lg">
              {mintStatus}
            </div>
          )}

          {mintedTokenId !== null && (
            <div className="p-3 mb-4 bg-green-100 text-green-800 rounded-lg">
              <p className="font-bold">
                CryptoCritter #{mintedTokenId} is yours!
              </p>
              <p className="mt-2">
                <a
                  href={`/gallery?highlight=${mintedTokenId}`}
                  className="underline hover:text-green-900"
                >
                  View it in the gallery
                </a>
              </p>
            </div>
          )}

          <button
            className="btn-primary w-full text-xl py-3 flex items-center justify-center"
            onClick={handleMint}
            disabled={isMinting || !isConnected}
          >
            {isMinting ? (
              <>
                <span className="mr-2 animate-spin">⏳</span>
                Minting...
              </>
            ) : (
              "Mint Now"
            )}
          </button>
        </div>

        <div className="mt-8 text-gray-600">
          <h3 className="font-semibold text-lg mb-2">What will you get?</h3>
          <ul className="list-disc list-inside text-left space-y-2">
            <li>A unique, randomly generated digital pet</li>
            <li>Fully on-chain SVG art (no IPFS required)</li>
            <li>Various color, shape and pattern combinations</li>
            <li>Full ownership recorded on the blockchain</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
