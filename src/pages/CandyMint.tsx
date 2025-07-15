import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';

const CANDY_MACHINE_ID = new PublicKey("3shPjsUctq2NmwLoswMidg46XX2SMFcaearGshYLtKYw");

export const CandyMint: React.FC = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [mintedNfts, setMintedNfts] = useState<any[]>([]);

  const handleMint = async () => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      setStatus('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    setStatus('Preparing to mint...');
    setMintedNfts([]);

    try {
      const metaplex = Metaplex.make(connection)
        .use(walletAdapterIdentity(wallet));

      setStatus('Loading Candy Machine...');
      const candyMachine = await metaplex
        .candyMachines()
        .findByAddress({ address: CANDY_MACHINE_ID });

      console.log('Candy Machine loaded:', candyMachine.address.toString());
      console.log('Items available:', candyMachine.itemsAvailable.toString());
      console.log('Items minted:', candyMachine.itemsMinted.toString());

      const minted = [];
      for (let i = 0; i < quantity; i++) {
        setStatus(`Minting ${i + 1} of ${quantity}...`);
        
        try {
          const mintResult = await metaplex.candyMachines().mint(
            {
              candyMachine,
              collectionUpdateAuthority: candyMachine.authorityAddress,
            },
            { commitment: 'confirmed' }
          );

          console.log('Minted:', mintResult.nft);
          minted.push(mintResult.nft);
          
          // Small delay between mints to avoid rate limiting
          if (i < quantity - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (mintError) {
          console.error(`Failed to mint ${i + 1}:`, mintError);
          setStatus(`Failed to mint ticket ${i + 1}. Please try again.`);
        }
      }

      if (minted.length > 0) {
        setMintedNfts(minted);
        setStatus(`Successfully minted ${minted.length} CHOP tickets!`);
      }

    } catch (error) {
      console.error('Mint error:', error);
      setStatus('Minting failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">MINT CHOP TICKETS</h1>
          <p className="text-xl text-gray-300">Direct minting from Candy Machine</p>
        </div>

        <div className="bg-gray-900 rounded-lg p-8 max-w-md mx-auto">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <input
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
              className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-700 focus:border-purple-500"
            />
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-400">
              Price: {quantity * 0.01} SOL ({quantity} × 0.01 SOL)
            </p>
          </div>

          <button
            onClick={handleMint}
            disabled={!wallet.connected || isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                {status}
              </>
            ) : (
              `Mint ${quantity} Ticket${quantity > 1 ? 's' : ''}`
            )}
          </button>

          {!wallet.connected && (
            <p className="text-center text-yellow-500 mt-4">
              Please connect your wallet to mint
            </p>
          )}

          {status && !isLoading && (
            <div className={`mt-4 p-3 rounded ${mintedNfts.length > 0 ? 'bg-green-900' : 'bg-red-900'}`}>
              <p className="text-sm">{status}</p>
            </div>
          )}

          {mintedNfts.length > 0 && (
            <div className="mt-4 p-3 bg-gray-800 rounded">
              <p className="text-sm font-medium mb-2">Minted NFTs:</p>
              {mintedNfts.map((nft, i) => (
                <div key={i} className="text-xs text-gray-400">
                  {nft.name} - {nft.address.toString().slice(0, 8)}...
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};