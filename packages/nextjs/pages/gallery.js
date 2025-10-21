import React, { useState, useEffect } from "react";
import { useProvider, useNetwork } from "wagmi";
import { useRouter } from "next/router";
import { getTotalSupply, getTokenURI, parseTokenURI } from "../lib/contract";
import { parseSvgFromDataURI } from "../lib/svgUtils";

export default function Gallery() {
  const [nfts, setNFTs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNFTs, setTotalNFTs] = useState(0);

  const provider = useProvider();
  const { chain } = useNetwork();
  const router = useRouter();
  const { highlight } = router.query;

  const pageSize = 12; // Number of NFTs per page
  const totalPages = Math.ceil(totalNFTs / pageSize);

  useEffect(() => {
    if (!provider || !chain) return;

    const fetchTotalSupply = async () => {
      try {
        const supply = await getTotalSupply(provider, chain.id);
        setTotalNFTs(supply);
      } catch (err) {
        console.error("Error fetching total supply:", err);
        setError("Failed to fetch NFT collection size");
      }
    };

    fetchTotalSupply();
  }, [provider, chain]);

  useEffect(() => {
    if (!provider || !chain || totalNFTs === 0) return;

    const fetchNFTsForCurrentPage = async () => {
      setLoading(true);
      setError(null);

      try {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalNFTs);
        const nftPromises = [];

        for (let i = startIndex; i < endIndex; i++) {
          nftPromises.push(fetchNFTData(i));
        }

        const nftData = await Promise.all(nftPromises);
        setNFTs(nftData.filter((nft) => nft !== null));
      } catch (err) {
        console.error("Error loading NFTs:", err);
        setError("Failed to load NFTs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNFTsForCurrentPage();
  }, [provider, chain, totalNFTs, currentPage]);

  const fetchNFTData = async (tokenId) => {
    try {
      const uri = await getTokenURI(provider, chain.id, tokenId);
      const metadata = parseTokenURI(uri);
      const svgContent = parseSvgFromDataURI(metadata.image);

      return {
        id: tokenId,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
        svgContent,
        attributes: metadata.attributes,
      };
    } catch (err) {
      console.error(`Error fetching NFT ${tokenId}:`, err);
      return null;
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust startPage if endPage is maxed out
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
        >
          &lt;
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-1 bg-gray-200 rounded-md"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`px-3 py-1 rounded-md ${
              currentPage === number ? "bg-primary text-white" : "bg-gray-200"
            }`}
          >
            {number}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-1 bg-gray-200 rounded-md"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-primary">
        CryptoCritters Gallery
      </h1>

      {error && (
        <div className="w-full max-w-4xl p-4 bg-red-100 text-red-800 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading && nfts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="loading-spinner text-5xl mb-4">🐾</div>
          <p className="text-gray-600">Loading CryptoCritters...</p>
        </div>
      ) : nfts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
            {nfts.map((nft) => (
              <div
                key={nft.id}
                className={`gallery-card bg-white p-4 rounded-lg shadow-md transition-all ${
                  highlight && parseInt(highlight) === nft.id
                    ? "ring-4 ring-accent animate-bounce-slow"
                    : ""
                }`}
              >
                <div className="aspect-w-1 aspect-h-1 w-full mb-3 overflow-hidden rounded-lg">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="nft-image object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-lg font-semibold">{nft.name}</h3>

                <div className="mt-2 flex flex-wrap gap-1">
                  {nft.attributes?.map((attr, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs font-semibold text-gray-700"
                    >
                      {attr.trait_type}: {attr.value}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && renderPagination()}
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">No NFTs Found</h2>
          <p className="text-gray-600 mb-6">
            There are no CryptoCritters minted yet. Be the first to mint one!
          </p>
          <a href="/" className="btn-primary inline-block">
            Mint Your First CryptoCritter
          </a>
        </div>
      )}
    </div>
  );
}
