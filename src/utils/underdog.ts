// Underdog Protocol Configuration
const UNDERDOG_CONFIG = {
  apiKey: '1a5c61008e8bde.9fd31cee84114c9e8c8957930160acb2',
  projectId: '3Jsk5s',
  apiUrl: 'https://api.underdogprotocol.com/v2'
};

// Function to mint NFT via Underdog
export async function mintTicketNFT(walletAddress: string, ticketNumber: number) {
  try {
    const response = await fetch(`${UNDERDOG_CONFIG.apiUrl}/projects/${UNDERDOG_CONFIG.projectId}/nfts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${UNDERDOG_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: `CHOP #${ticketNumber}`,
        symbol: 'CHOP',
        description: 'CHOPPED raffle ticket',
        image: `https://choppedonsol.netlify.app/.netlify/functions/metadata?id=${ticketNumber}`,
        externalUrl: 'https://chopped.live',
        receiver: walletAddress,
        attributes: [
          { trait_type: 'Number', value: ticketNumber },
          { trait_type: 'Edition', value: 'Standard' } // We'll check if special later
        ]
      })
    });
    
    if (!response.ok) {
      throw new Error(`Underdog API error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log(`Successfully minted CHOP #${ticketNumber}:`, result);
    return result;
  } catch (error) {
    console.error(`Failed to mint CHOP #${ticketNumber}:`, error);
    throw error;
  }
}

// Function to check mint status
export async function checkMintStatus(nftId: string) {
  try {
    const response = await fetch(`${UNDERDOG_CONFIG.apiUrl}/projects/${UNDERDOG_CONFIG.projectId}/nfts/${nftId}`, {
      headers: {
        'Authorization': `Bearer ${UNDERDOG_CONFIG.apiKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to check mint status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error checking mint status:', error);
    throw error;
  }
}