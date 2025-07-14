import { OddsCalculation } from '../types/wallet';

export const calculateOdds = (tickets: number, ticketPrice: number = 0.01): OddsCalculation => {
  // CHOP Raffle Constants
  const totalSupply = 250000;
  const devReserved = 6250;
  const publicTickets = totalSupply - devReserved; // 243,750
  const totalRounds = 15;
  const eliminationRate = 0.5; // 50% eliminated each round
  const finalSurvivors = 10;
  
  // Prize Structure
  const grandPrizeValue = 75000; // $75,000 Rolex
  const top10PrizeValue = 500; // $500 each for 10 winners
  const luckyLoserPrizes = {
    cartier: { value: 1500, count: 1 },
    thousand: { value: 1000, count: 5 },
    hundred: { value: 100, count: 5 }
  };
  
  // Calculate survival probability after 15 rounds of 50% elimination
  const survivalRate = Math.pow(eliminationRate, totalRounds); // 0.5^15 = 0.00003051758
  const survivalRatio = 1 / survivalRate; // 1 in 32,768
  
  // Probability calculations for X tickets
  const clampedTickets = Math.min(tickets, publicTickets);
  
  // 1. Survival Odds - probability at least one ticket survives all 15 rounds
  const survivalProbability = 1 - Math.pow(1 - survivalRate, clampedTickets);
  const survivalOdds = survivalProbability * 100;
  
  // 2. Grand Prize Odds - need to survive AND be selected from final 10
  const grandPrizePerTicket = survivalRate / finalSurvivors;
  const grandPrizeOdds = (1 - Math.pow(1 - grandPrizePerTicket, clampedTickets)) * 100;
  
  // 3. Top 10 Prize Odds (simplified - assumes from general pool)
  const top10Odds = Math.min(100, (clampedTickets * 10) / publicTickets * 100);
  
  // 4. Lucky Loser Odds (simplified - for eliminated tickets only)
  const totalLuckyLoserPrizes = luckyLoserPrizes.cartier.count + 
                                luckyLoserPrizes.thousand.count + 
                                luckyLoserPrizes.hundred.count;
  const eliminationProbability = 1 - survivalProbability;
  const luckyLoserOdds = eliminationProbability * (totalLuckyLoserPrizes / publicTickets) * 100;
  
  // Expected Value Calculation
  const expectedGrandPrize = (grandPrizeOdds / 100) * grandPrizeValue;
  const expectedTop10 = (top10Odds / 100) * top10PrizeValue;
  const expectedLuckyLoser = (luckyLoserOdds / 100) * (
    (luckyLoserPrizes.cartier.value * luckyLoserPrizes.cartier.count +
     luckyLoserPrizes.thousand.value * luckyLoserPrizes.thousand.count +
     luckyLoserPrizes.hundred.value * luckyLoserPrizes.hundred.count) / totalLuckyLoserPrizes
  );
  
  const expectedValue = expectedGrandPrize + expectedTop10 + expectedLuckyLoser;
  const totalCost = clampedTickets * ticketPrice * 100; // Convert SOL to USD equivalent
  
  // Recommendation logic
  let recommendation = '';
  if (clampedTickets < 100) {
    recommendation = 'Low survival odds - consider more tickets for better chances';
  } else if (clampedTickets >= 100 && clampedTickets <= 1000) {
    recommendation = 'Decent position - good balance of risk and reward';
  } else if (clampedTickets > 1000 && clampedTickets <= 5000) {
    recommendation = 'Strong position - excellent survival chances!';
  } else {
    recommendation = 'Whale territory - maximum survival probability!';
  }

  return {
    tickets: clampedTickets,
    grandPrize: grandPrizeOdds,
    top10Prize: top10Odds,
    luckyLoser: luckyLoserOdds,
    makesFinalRound: survivalOdds,
    expectedValue,
    totalCost,
    recommendation
  };
};

export const calculateCombinedOdds = (activeTickets: number): number => {
  const survivalRate = Math.pow(0.5, 15); // 0.5^15
  const combinedSurvivalOdds = 1 - Math.pow(1 - survivalRate, activeTickets);
  return combinedSurvivalOdds * 100;
};

// Additional utility functions for CHOP mechanics
export const calculateRoundSurvival = (tickets: number, round: number): number => {
  const survivalRateThisRound = Math.pow(0.5, round);
  return tickets * survivalRateThisRound;
};

export const getExpectedSurvivors = (totalTickets: number = 243750): number => {
  return totalTickets * Math.pow(0.5, 15); // Should be ~7.44, but they say 10 make it
};