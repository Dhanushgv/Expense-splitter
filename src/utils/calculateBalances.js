export function calculateBalances(participants, expenses) {
  const balances = {};
  participants.forEach(p => balances[p] = 0);

  expenses.forEach(({ payer, amount, splitBetween, splits }) => {
    let total = 0;

    if (splits) {
      total = Object.values(splits).reduce((a, b) => a + b, 0);
    }

    splitBetween.forEach(person => {
      let share = 0;
      if (splits && splits[person] != null) {
        share = (splits[person] / total) * amount;
      } else {
        share = amount / splitBetween.length;
      }

      if (person !== payer) {
        balances[person] -= share;
        balances[payer] += share;
      }
    });
  });

  return balances;
}
