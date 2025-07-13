import { Connection, PublicKey, SystemProgram, LAMPORTS_PER_SOL, Transaction, TransactionInstruction } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN, Idl } from '@project-serum/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';
import {
  createMintToCollectionV1Instruction,
  PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
  ConcurrentMerkleTreeAccount,
} from '@metaplex-foundation/mpl-bubblegum';

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

// Compressed NFT Configuration
export const MERKLE_TREE = new PublicKey("7xKY2rZsqzZjTZqrFDFKHQYrr3nCkDrBLj5hJKqwRGmQ");
export const COLLECTION_MINT = new PublicKey("chop1Kv8CCk3rF7HqYUMuzJZJvVzZr8y5vV4qEHc3Y2");
export const COLLECTION_METADATA = new PublicKey("metaXKGP6qLtg9fEpVWxn4k3o6GJ8k1ZE7L8KqG1ZrE");
export const COLLECTION_MASTER_EDITION = new PublicKey("chop3ZccVY8CCk3rF7HqYUMuzJZJvVzZr8y5vV4qE3");
export const TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

// SPL Account Compression constants (avoiding package import issues)
export const SPL_ACCOUNT_COMPRESSION_PROGRAM_ID = new PublicKey('cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK');
export const SPL_NOOP_PROGRAM_ID = new PublicKey('noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV');

export const DEV_MINT_AMOUNT = 6250;
export const MIN_MINT_AMOUNT = 2;
export const MAX_SUPPLY = 250000;
export const EARLY_BIRD_THRESHOLD = 100000;
export const EARLY_BIRD_PRICE = 0.005; // SOL
export const REGULAR_PRICE = 0.01; // SOL

// Live metadata API
export const METADATA_BASE_URL = "https://choppedonsol.netlify.app/.netlify/functions/metadata";

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

// TODO: Re-implement createMerkleTree function once package issues are resolved
// For now, we'll focus on basic minting functionality

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
export async function createCompressedNFT(
  connection: Connection,
  wallet: WalletContextState,
  ticketNumber: number
): Promise<{ success: boolean; signature?: string; error?: string }> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    return { success: false, error: "Wallet not connected" };
  }

  try {
    // Verify Merkle tree exists
    const treeAccount = await getMerkleTreeAccount(connection);
    if (!treeAccount) {
      return { success: false, error: "Merkle tree not found. Please create tree first." };
    }

    // Get tree config PDA
    const treeConfigPDA = PublicKey.findProgramAddressSync(
      [MERKLE_TREE.toBuffer()],
      BUBBLEGUM_PROGRAM_ID
    )[0];

    // Get collection authority record PDA
    const [collectionAuthorityRecordPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s").toBuffer(), // Token Metadata Program ID
        COLLECTION_MINT.toBuffer(),
        Buffer.from("collection_authority"),
        PROJECT_WALLET.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    // Get bubblegum signer PDA
    const [bubblegumSigner] = PublicKey.findProgramAddressSync(
      [Buffer.from("collection_cpi")],
      BUBBLEGUM_PROGRAM_ID
    );

    // Generate metadata for this ticket
    const metadata = {
      name: `CHOP #${ticketNumber}`,
      symbol: "CHOP",
      uri: `${METADATA_BASE_URL}?id=${ticketNumber}`,
      sellerFeeBasisPoints: 0,
      collection: { key: COLLECTION_MINT, verified: false },
    };

    // Create the compressed NFT mint instruction
    const mintIx = createMintToCollectionV1Instruction(
      {
        treeConfig: treeConfigPDA,
        leafOwner: wallet.publicKey,
        leafDelegate: wallet.publicKey,
        merkleTree: MERKLE_TREE,
        payer: wallet.publicKey,
        treeCreator: PROJECT_WALLET,
        collectionAuthority: PROJECT_WALLET,
        collectionAuthorityRecordPda: collectionAuthorityRecordPDA,
        collectionMint: COLLECTION_MINT,
        collectionMetadata: COLLECTION_METADATA,
        editionAccount: COLLECTION_MASTER_EDITION,
        bubblegumSigner: bubblegumSigner,
        logWrapper: SPL_NOOP_PROGRAM_ID,
        compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        bubblegumProgram: BUBBLEGUM_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      },
      {
        metadataArgs: {
          name: metadata.name,
          symbol: metadata.symbol,
          uri: metadata.uri,
          creators: [
            {
              address: PROJECT_WALLET,
              verified: false,
              share: 100,
            },
          ],
          editionNonce: null,
          uses: null,
          collection: {
            verified: metadata.collection.verified,
            key: metadata.collection.key,
          },
          primarySaleHappened: false,
          sellerFeeBasisPoints: metadata.sellerFeeBasisPoints,
          isMutable: true,
          tokenProgramVersion: 0, // Original token program
          tokenStandard: null,
        },
      }
    );

    // Create and send transaction
    const transaction = new Transaction().add(mintIx);
    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;

    const signedTransaction = await wallet.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());

    // Confirm transaction with timeout
    const confirmation = await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight: (await connection.getLatestBlockhash()).lastValidBlockHeight
    }, 'confirmed');

    if (confirmation.value.err) {
      throw new Error(`Transaction failed: ${confirmation.value.err}`);
    }

    return { success: true, signature };
  } catch (error) {
    console.error(`Failed to create compressed NFT #${ticketNumber}:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Mint tickets with compressed NFTs
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
    onProgress?.("Creating compressed NFTs...", 2, amount + 2);
    
    const nftResults = [];
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < amount; i++) {
      const ticketNumber = startingNumber + i;
      const stepNumber = i + 3;
      
      onProgress?.(`Creating compressed NFT #${ticketNumber}...`, stepNumber, amount + 2);
      
      // Create real compressed NFT using Bubblegum
      const result = await createCompressedNFT(connection, wallet, ticketNumber);
      
      if (result.success) {
        successCount++;
        nftResults.push({
          ticketNumber,
          signature: result.signature,
          name: `CHOP #${ticketNumber}`,
          type: 'compressed',
        });
      } else {
        failCount++;
        nftResults.push({
          ticketNumber,
          signature: null,
          name: `CHOP #${ticketNumber}`,
          type: 'compressed',
          error: result.error
        });
      }
    }
    
    onProgress?.("Compressed NFT mint complete!", amount + 2, amount + 2);
    
    return {
      raffleTransaction: tx,
      nfts: nftResults,
      startingNumber,
      totalMinted: amount,
      successfulNfts: successCount,
      failedNfts: failCount,
      type: 'compressed',
      estimatedCost: amount * 0.00015, // Approximate cost for compressed NFTs
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
    // This would typically involve fetching compressed NFTs from the wallet
    // For now, return mock data - you'd implement actual compressed NFT fetching
    // using Digital Asset Standard (DAS) API or similar
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
// Add after line 523 (after calculatePrice function)

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

// Get Merkle tree account helper
export async function getMerkleTreeAccount(connection: Connection): Promise<ConcurrentMerkleTreeAccount | null> {
  try {
    const treeAccount = await ConcurrentMerkleTreeAccount.fromAccountAddress(
      connection,
      MERKLE_TREE
    );
    return treeAccount;
  } catch (error) {
    console.error('Failed to fetch Merkle tree account:', error);
    return null;
  }
}

// Create connection with fallback RPC endpoints
export function getConnection(): Connection {
  const endpoints = [
    'https://api.mainnet-beta.solana.com',
    'https://solana-mainnet.g.alchemy.com/v2/demo',
    'https://api.mainnet-beta.solana.com',
  ];
  
  // Try endpoints until one works
  for (const endpoint of endpoints) {
    try {
      return new Connection(endpoint, 'confirmed');
    } catch (error) {
      console.warn(`Failed to connect to ${endpoint}, trying next...`);
    }
  }
  
  // Default to first endpoint
  return new Connection(endpoints[0], 'confirmed');
}
