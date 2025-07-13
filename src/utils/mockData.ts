import { WalletHoldings, TicketStatus } from '../types/wallet';

export const generateMockTickets = (total: number): TicketStatus[] => {
  const tickets: TicketStatus[] = [];
  
  for (let i = 0; i < total; i++) {
    const id = Math.floor(Math.random() * 250000) + 1;
    const isActive = Math.random() > 0.15; // 85% survival rate
    
    const ticket: TicketStatus = {
      id,
      status: isActive ? 'active' : 'chopped',
      survivalChance: isActive ? 92.3 : 0,
      round: !isActive ? Math.floor(Math.random() * 5) + 1 : undefined
    };
    
    tickets.push(ticket);
  }
  
  return tickets.sort((a, b) => a.id - b.id);
};

export const generateMockHoldings = (walletAddress: string): WalletHoldings => {
  const total = Math.floor(Math.random() * 100) + 20; // 20-120 tickets
  const tickets = generateMockTickets(total);
  
  const active = tickets.filter(t => t.status === 'active').length;
  const chopped = tickets.filter(t => t.status === 'chopped').length;
  
  const choppedDetails: { [round: string]: number[] } = {};
  
  tickets.forEach(ticket => {
    if (ticket.status === 'chopped' && ticket.round) {
      const roundKey = `round${ticket.round}`;
      if (!choppedDetails[roundKey]) {
        choppedDetails[roundKey] = [];
      }
      choppedDetails[roundKey].push(ticket.id);
    }
  });
  
  return {
    total,
    active,
    chopped,
    choppedDetails,
    tickets
  };
};

export const mockWalletAddresses = [
  '7xKY2rZsqzZjTZqrFDFKHQYrr3nCkDrBLj5hJKqwRGmQ',
  '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
  '3J2yNtjw5LMKduNtBH4n1q8MmGhXm7Q5qTpJXTsWgCZR',
  '8NjVDmEZpczrjYKU2sxYs7nqSjAWVhH1KzMBNgVgHGt4',
  '4FzVEoQRLNYRPqW6UdJqRvVJLH8MwxZ2pQsT9NxQdL5s'
];