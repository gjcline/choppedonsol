export interface WalletHoldings {
  total: number;
  active: number;
  chopped: number;
  choppedDetails: {
    [round: string]: number[];
  };
  tickets: TicketStatus[];
}

export interface TicketStatus {
  id: number;
  status: 'active' | 'chopped';
  round?: number;
  survivalChance: number;
}

export interface OddsCalculation {
  tickets: number;
  grandPrize: number;
  top10Prize: number;
  luckyLoser: number;
  makesFinalRound: number;
  expectedValue: number;
  totalCost: number;
  recommendation: string;
}

export interface WalletComparison {
  address: string;
  displayName: string;
  holdings: WalletHoldings;
  totalOdds: number;
}</parameter>