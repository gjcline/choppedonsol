import { OddsCalculation } from '../types/wallet';

export const calculateOdds = (tickets: number, ticketPrice: number = 0.01): OddsCalculation => {
  const totalSupply = 250000;
  const grandPrizeWinners = 1;
  const top10Winners = 10;
  const luckyLoserWinners = 100;
  const finalRoundSurvivors = 1000;

  // Calculate individual probabilities
  const grandPrizeOdds = (tickets / totalSupply) * 100;
  const top10Odds = Math.min(100, (tickets * top10Winners) / totalSupply * 100);
  const luckyLoserOdds = Math.min(100, (tickets * luckyLoserWinners) / totalSupply * 100);
  const finalRoundOdds = Math.min(100, (tickets * finalRoundSurvivors) / totalSupply * 100);

  // Calculate expected value (simplified)
  const grandPrizeValue = 1000; // $1000 equivalent
  const top10Value = 100; // $100 equivalent
  const luckyLoserValue = 10; // $10 equivalent

  const expectedValue = (
    (grandPrizeOdds / 100) * grandPrizeValue +
    (top10Odds / 100) * top10Value +
    (luckyLoserOdds / 100) * luckyLoserValue
  );

  const totalCost = tickets * ticketPrice * 100; // Convert to USD equivalent

  let recommendation = '';
  if (tickets < 50) {
    recommendation = 'Consider more tickets for better odds';
  } else if (tickets >= 50 && tickets <= 500) {
    recommendation = 'Good balance of risk and reward';
  } else if (tickets > 500 && tickets <= 1000) {
    recommendation = 'High roller territory - great odds!';
  } else {
    recommendation = 'Maximum commitment - excellent position!';
  }

  return {
    tickets,
    grandPrize: grandPrizeOdds,
    top10Prize: top10Odds,
    luckyLoser: luckyLoserOdds,
    makesFinalRound: finalRoundOdds,
    expectedValue,
    totalCost,
    recommendation
  };
};

export const calculateCombinedOdds = (activeTickets: number): number => {
  const singleTicketOdds = 10 / 250000; // 0.004%
  const combinedOdds = 1 - Math.pow(1 - singleTicketOdds, activeTickets);
  return combinedOdds * 100; // Return as percentage
};