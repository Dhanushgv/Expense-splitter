import React, { useState } from "react";

function ExpenseForm({ participants, onAddExpense }) {
  const [payer, setPayer] = useState("");
  const [amount, setAmount] = useState("");
  const [splitBetween, setSplitBetween] = useState([]);
  const [customSplits, setCustomSplits] = useState({});

  const toggleSplit = (person) => {
    const newSplit = splitBetween.includes(person)
      ? splitBetween.filter((p) => p !== person)
      : [...splitBetween, person];
    setSplitBetween(newSplit);
  };

  const handleCustomSplitChange = (person, value) => {
    setCustomSplits({ ...customSplits, [person]: Number(value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!payer || !amount || splitBetween.length === 0) return;

    const total = Object.values(customSplits).reduce((a, b) => a + b, 0);
    const splits = total > 0 ? customSplits : null;

    onAddExpense({ payer, amount: parseFloat(amount), splitBetween, splits });
    setPayer("");
    setAmount("");
    setSplitBetween([]);
    setCustomSplits({});
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Expense</h3>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <select value={payer} onChange={(e) => setPayer(e.target.value)} required>
        <option value="">Who paid?</option>
        {participants.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      <div>
        {participants.map((p) => (
          <div key={p}>
            <label>
              <input
                type="checkbox"
                checked={splitBetween.includes(p)}
                onChange={() => toggleSplit(p)}
              />
              {p}
            </label>
            {splitBetween.includes(p) && (
              <input
                type="number"
                placeholder="%"
                onChange={(e) => handleCustomSplitChange(p, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
      <button type="submit">Add Expense</button>
    </form>
  );
}

export default ExpenseForm;
