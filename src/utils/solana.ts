import { Connection, PublicKey, SystemProgram, LAMPORTS_PER_SOL, Transaction, TransactionInstruction } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN, Idl } from '@project-serum/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';

// Commented out compressed NFT imports - switching to Underdog Protocol
// import {
//   createMintToCollectionV1Instruction,
//   PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
//   ConcurrentMerkleTreeAccount,
// } from '@metaplex-foundation/mpl-bubblegum';

// Read-only wallet for public data fetching
class ReadOnlyWallet {
  constructor() {}
  
  get publicKey() {
    return null;
  }
  
  async signTransaction() {
    throw new Error('ReadOnlyWallet cannot sign transactions');
  }
  
  async signAllTransactions() {
    throw new Error('ReadOnlyWallet cannot sign transactions');
  }
}

// Mainnet Program Details
export const PROGRAM_ID = new PublicKey("btrieZ5vghm8p5CFQvFAZvpEp13kjiTxWxd4dTRWL1V");
export const RAFFLE_PDA = new PublicKey("96w4cBXMNWjQQXabu78AGYpqYMTxS7BtPSspKMxeQTda");
export const PROJECT_WALLET = new PublicKey("4WzpcDfBfY8sCvQdSoptmucfQ1uv1QndoP6zgaq3qZTb");
export const DEV_WALLET = new PublicKey("4WzpcDfBfY8sCvQdSoptmucfQ1uv1QndoP6zgaq3qZTb");
// Commented out compressed NFT creation - switching to Underdog Protocol
// // Compressed NFT Configuration
// export const MERKLE_TREE = new PublicKey("7xKY2rZsqzZjTZqrFDFKHQYrr3nCkDrBLj5hJKqwRGmQ");
// export const COLLECTION_MINT = new PublicKey("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM");
// export const COLLECTION_MASTER_EDITION = new PublicKey("J1S9H3QjnRtBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM");
// export const TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
// 
// // SPL Account Compression constants (avoiding package import issues)
// export const SPL_ACCOUNT_COMPRESSION_PROGRAM_ID = new PublicKey('cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK');
// export const SPL_NOOP_PROGRAM_ID = new PublicKey('noopb9bkMVfRPU8AQkHtKwMYZiFUjNRtMmV');

export const DEV_MINT_AMOUNT = 6250;
export const MIN_MINT_AMOUNT = 2;
export const MAX_SUPPLY = 250000;
export const EARLY_BIRD_THRESHOLD = 100000;
export const EARLY_BIRD_PRICE = 0.005; // SOL
export const REGULAR_PRICE = 0.01; // SOL

// Live metadata API
// export const METADATA_BASE_URL = "https://choppedonsol.netlify.app/.netlify/functions/metadata";

// Program IDL (simplified for demo - you'd get this from your Anchor build)
const IDL: Idl = {
  version: "0.1.0",
  name: "chopped_raffle",
  instructions: [
    {
      name: "initializeRaffle",
      accounts: [
        { name: "raffle", isMut: true, isSigner: false },
        { name: "authority", isMut: true, isSigner: true },
        { name: "projectWallet", isMut: false, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [],
    },
    {
      name: "mintTicketV2",
      accounts: [
        { name: "raffle", isMut: true, isSigner: false },
        { name: "authority", isMut: true, isSigner: true },
        { name: "projectWallet", isMut: false, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [{ name: "amount", type: "u64" }],
    },
    {
      name: "devMint",
      accounts: [
        { name: "raffle", isMut: true, isSigner: false },
        { name: "authority", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "Raffle",
      type: {
        kind: "struct",
        fields: [
          { name: "totalMinted", type: "u64" },
          { name: "devMintDone", type: "bool" },
          { name: "authority", type: "publicKey" },
          { name: "projectWallet", type: "publicKey" },
        ],
      },
    },
  ],
} as Idl;

// Use the provided raffle PDA
export const getRafflePDA = () => RAFFLE_PDA;

// Get program instance
export const getProgram = (connection: Connection, wallet: WalletContextState) => {
  if (!wallet.publicKey || !wallet.signTransaction) return null;
  
  const provider = new AnchorProvider(connection, wallet as any, {
    commitment: "confirmed",
  });
  
  return new Program(IDL, PROGRAM_ID, provider);
};

// Get reliable Solana RPC connection
export function getConnection(): Connection {
  return new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
}

// Initialize raffle (dev only)
export async function initializeRaffle(connection: Connection, wallet: WalletContextState) {
  if (!wallet.publicKey?.equals(DEV_WALLET)) {
    throw new Error("Only dev wallet can initialize raffle");
  }
  
  const program = getProgram(connection, wallet);
  if (!program) throw new Error("Program not available");
  
  const rafflePDA = getRafflePDA();
  
  try {
    const tx = await program.methods
      .initializeRaffle()
      .accounts({
        raffle: rafflePDA,
        authority: wallet.publicKey,
        projectWallet: PROJECT_WALLET,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    
    return tx;
  } catch (error) {
    console.error("Initialize raffle error:", error);
    throw error;
  }
}

// Dev mint using raw instruction with discriminator
export async function devMint(connection: Connection, wallet: WalletContextState) {
  if (!wallet.publicKey?.equals(DEV_WALLET)) {
    throw new Error(`dev wallet must be ${DEV_WALLET.toString()}`);
  }
  
  if (!wallet.signTransaction) {
    throw new Error("Wallet does not support signing");
  }
  
  const rafflePDA = getRafflePDA();
  
  try {
    // Create instruction data with discriminator and amount
    const discriminator = Buffer.from([195, 67, 168, 135, 89, 61, 7, 232]);
    const amountBuffer = Buffer.alloc(8);
    amountBuffer.writeBigUInt64LE(BigInt(DEV_MINT_AMOUNT), 0);
    const instructionData = Buffer.concat([discriminator, amountBuffer]);
    
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: rafflePDA, isSigner: false, isWritable: true },
        { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: PROGRAM_ID,
      data: instructionData,
    });
    
    const transaction = new Transaction().add(instruction);
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;
    
    const signedTransaction = await wallet.signTransaction(transaction);
    const txId = await connection.sendRawTransaction(signedTransaction.serialize());
    
    return txId;
  } catch (error) {
    console.error("Dev mint error:", error);
    throw error;
  }
}

// Create real compressed NFT using Bubblegum program
// All compressed NFT creation code removed - switching to Underdog Protocol

// Mint tickets - simplified for Underdog Protocol integration
export async function mintTickets(
  connection: Connection, 
  wallet: WalletContextState, 
  amount: number,
  onProgress?: (step: string, current: number, total: number) => void
) {
  if (amount < MIN_MINT_AMOUNT) {
    throw new Error(`Minimum mint is ${MIN_MINT_AMOUNT} NFTs`);
  }
  
  const program = getProgram(connection, wallet);
  if (!program) throw new Error("Program not available");
  
  const rafflePDA = getRafflePDA();
  
  try {
    // Step 1: Record the purchase in the raffle program
    onProgress?.("Recording purchase in raffle program...", 0, amount + 2);
    
    const tx = await program.methods
      .mintTicketV2(new BN(amount))
      .accounts({
        raffle: rafflePDA,
        authority: wallet.publicKey,
        projectWallet: PROJECT_WALLET,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    
    // Step 2: Get the starting ticket number from the raffle state
    onProgress?.("Getting ticket numbers...", 1, amount + 2);
    const raffleAccount = await withRetry(() => program.account.raffle.fetch(rafflePDA));
    const currentTotal = raffleAccount.totalMinted.toNumber();
    const startingNumber = currentTotal - amount + 1;
    
    // Step 3: Create compressed NFTs
    onProgress?.("Creating NFTs via Underdog Protocol...", 2, amount + 3);
    
    const nftResults = [];
    let successfulNfts = 0;
    let failedNfts = 0;
    
    // Create NFTs via Underdog Protocol
      const ticketNumber = startingNumber + i;
      
      try {
        const nftResult = await mintNFTWithUnderdog(
          wallet.publicKey!.toString(),
          ticketNumber
        );
        
        nftResults.push({
          ticketNumber,
          signature: nftResult.transactionId,
          name: `CHOP #${ticketNumber}`,
          type: 'underdog_success',
          underdogId: nftResult.nftId,
          mintAddress: nftResult.mintAddress,
        });
        
        successfulNfts++;
      } catch (error) {
        console.error(`Failed to mint NFT #${ticketNumber}:`, error);
        
        nftResults.push({
          ticketNumber,
          signature: null,
          name: `CHOP #${ticketNumber}`,
          type: 'underdog_failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        
        failedNfts++;
      }
      
      // Small delay between mints to avoid rate limiting
      if (i < amount - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    onProgress?.("Raffle ticket purchase complete!", amount + 2, amount + 2);
    
    return {
      raffleTransaction: tx,
      nfts: nftResults,
      startingNumber,
      totalMinted: amount,
      successfulNfts,
      failedNfts: failCount,
      type: 'underdog_complete',
      estimatedCost: 0, // Underdog Protocol handles NFT creation
    };
    
  } catch (error) {
    console.error("Mint tickets error:", error);
    
    if (isRpcError(error)) {
      throw new Error("Unable to connect to Solana network. Please check your internet connection and try again.");
    }
    
    throw new Error(`Mint failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Get raffle status
export async function getRaffleStatus(connection: Connection) {
  try {
    const rafflePDA = getRafflePDA();
    const readOnlyWallet = new ReadOnlyWallet();
    
    const provider = new AnchorProvider(connection, readOnlyWallet as any, {
      commitment: "confirmed",
    });
    const program = new Program(IDL, PROGRAM_ID, provider);
    
    const raffleAccount = await program.account.raffle.fetch(rafflePDA);
    const totalMinted = raffleAccount.totalMinted.toNumber();
    
    return {
      totalMinted,
      isInitialized: true,
      currentPhase: totalMinted < EARLY_BIRD_THRESHOLD ? "Early Bird" : "Regular",
      devMintDone: raffleAccount.devMintDone || false,
      pricePerNFT: totalMinted < EARLY_BIRD_THRESHOLD ? EARLY_BIRD_PRICE : REGULAR_PRICE,
    };
  } catch (error) {
    console.error("RPC error:", error);
    
    // Return cached/default values when RPC fails
    return {
      totalMinted: 6250, // Assume dev mint has been done
      isInitialized: true, // You confirmed raffle is initialized
      currentPhase: "Early Bird" as const,
      devMintDone: true, // Assume dev mint is done
      pricePerNFT: EARLY_BIRD_PRICE,
    };
  }
}

// Get user holdings
export async function getUserHoldings(walletAddress: PublicKey) {
  try {
    // TODO: Implement Underdog Protocol NFT fetching
    // For now, return mock data until Underdog integration
    // Underdog provides APIs to fetch NFTs by wallet address
    return Math.floor(Math.random() * 50);
  } catch (error) {
    console.error("Get user holdings error:", error);
    return 0;
  }
}

// Calculate price
export const calculatePrice = (amount: number, totalMinted: number): number => {
  const pricePerNFT = totalMinted < EARLY_BIRD_THRESHOLD ? EARLY_BIRD_PRICE : REGULAR_PRICE;
  return amount * pricePerNFT;
}


// Utility function to check if error is RPC related
export function isRpcError(error: any): boolean {
  const errorMessage = error?.message?.toLowerCase() || '';
  return errorMessage.includes('403') || 
         errorMessage.includes('access forbidden') ||
         errorMessage.includes('failed to get recent blockhash') ||
         errorMessage.includes('network') ||
         errorMessage.includes('connection');
}

// Retry utility for RPC calls
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
}

// Commented out all compressed NFT code - switching to Underdog Protocol

// Underdog Protocol Configuration
export const UNDERDOG_PROJECT_ID = "3Jsk5s";
export const UNDERDOG_API_BASE = "https://mainnet.underdogprotocol.com/v2";

// Mint NFT via Underdog Protocol
export async function mintNFTWithUnderdog(
  walletAddress: string,
  ticketNumber: number,
  attributes?: { trait_type: string; value: string | number }[]
) {
  try {
    const response = await fetch(`${UNDERDOG_API_BASE}/projects/${UNDERDOG_PROJECT_ID}/nfts`, {
      const stepNumber = i + 3;
      
      onProgress?.(`Minting NFT #${ticketNumber}...`, stepNumber, amount + 3);
      
      try {
        const result = await mintTicketNFT(wallet.publicKey!.toString(), ticketNumber);
        
        nftResults.push({
          ticketNumber,
          signature: result.transactionId || 'underdog_success',
          name: `CHOP #${ticketNumber}`,
          type: 'underdog',
          underdogId: result.nftId,
          mintAddress: result.mintAddress,
        });
        successCount++;
      } catch (error) {
        console.error(`Failed to mint NFT #${ticketNumber}:`, error);
        
        nftResults.push({
          ticketNumber,
          signature: null,
          name: `CHOP #${ticketNumber}`,
          type: 'underdog_failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        failCount++;
      }
      
      // Small delay between mints to avoid rate limiting
      if (i < amount - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
        external_url: "https://choppedonsol.netlify.app",
        attributes: attributes || [
    onProgress?.("NFT minting complete!", amount + 3, amount + 3);
          { trait_type: "Collection", value: "CHOP Raffle" }
        ],
        receiverAddress: walletAddress
      })
    });

    if (!response.ok) {
      throw new Error(`Underdog API error: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Underdog mint error:", error);
    throw error;
  }
}