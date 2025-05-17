import React, { useState } from "react";
import ExpenseChart from "./components/ExpenseChart";



function App() {
  const [people, setPeople] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [payer, setPayer] = useState("");
  const [amount, setAmount] = useState("");
  const [place, setPlace] = useState("");
  const [newPerson, setNewPerson] = useState("");

  const addPerson = () => {
    const name = newPerson.trim();
    if (name && !people.includes(name)) {
      setPeople([...people, name]);
      setNewPerson("");
      setPayer(name); // default payer
    }
  };

  const addExpense = () => {
    const amt = parseFloat(amount);
    if (!payer || isNaN(amt) || amt <= 0 || !place.trim()) return;
    setExpenses([...expenses, { payer, amount: amt, place: place.trim() }]);
    setAmount("");
    setPlace("");
  };

  const calculateSplit = () => {
    if (people.length === 0) return [];
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const share = total / people.length;

    const paidMap = {};
    people.forEach((p) => (paidMap[p] = 0));
    expenses.forEach((e) => {
      paidMap[e.payer] += e.amount;
    });

    return people.map((p) => ({
      name: p,
      paid: paidMap[p],
      owes: share,
    }));
  };

  const calculateSettlements = () => {
    const split = calculateSplit();
    const creditors = [];
    const debtors = [];

    split.forEach(({ name, paid, owes }) => {
      const balance = +(paid - owes).toFixed(2);
      if (balance > 0) creditors.push({ name, amount: balance });
      else if (balance < 0) debtors.push({ name, amount: -balance });
    });

    const settlements = [];
    let i = 0,
      j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amount = Math.min(debtor.amount, creditor.amount);

      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: amount.toFixed(2),
      });

      debtor.amount -= amount;
      creditor.amount -= amount;

      if (debtor.amount < 0.01) i++;
      if (creditor.amount < 0.01) j++;
    }

    return settlements;
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    const split = calculateSplit();
    const settlements = calculateSettlements();

    doc.text("Expense Splitter Summary", 14, 16);

    doc.autoTable({
      startY: 20,
      head: [["Payer", "Amount (₹)", "Place"]],
      body: expenses.map((e) => [e.payer, e.amount.toFixed(2), e.place]),
    });

    const splitStartY = doc.lastAutoTable.finalY + 10;
    doc.text("Split Summary", 14, splitStartY);
    doc.autoTable({
      startY: splitStartY + 5,
      head: [["Name", "Paid (₹)", "Owes (₹)", "Balance (₹)"]],
      body: split.map(({ name, paid, owes }) => [
        name,
        paid.toFixed(2),
        owes.toFixed(2),
        (paid - owes).toFixed(2),
      ]),
    });

    const settlementStartY = doc.lastAutoTable.finalY + 10;
    doc.text("Settlement Instructions", 14, settlementStartY);
    if (settlements.length === 0) {
      doc.text("All expenses are already settled.", 14, settlementStartY + 10);
    } else {
      doc.autoTable({
        startY: settlementStartY + 5,
        head: [["From", "To", "Amount (₹)"]],
        body: settlements.map((s) => [s.from, s.to, s.amount]),
      });
    }

    doc.save("expense_summary.pdf");
  };

  const splitData = calculateSplit();
  const settlements = calculateSettlements();

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "auto",
        padding: 20,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Expense Splitter</h1>

      {/* Add Person */}
      <section style={{ marginBottom: 20 }}>
        <h2>Add Person</h2>
        <input
          type="text"
          value={newPerson}
          onChange={(e) => setNewPerson(e.target.value)}
          placeholder="Enter name"
          style={{ padding: 8, marginRight: 8 }}
        />
        <button onClick={addPerson} style={{ padding: "8px 16px" }}>
          Add
        </button>
      </section>

      {/* Add Expense */}
      <section style={{ marginBottom: 20 }}>
        <h2>Add Expense</h2>
        <select
          value={payer}
          onChange={(e) => setPayer(e.target.value)}
          style={{ padding: 8, marginRight: 8 }}
        >
          <option value="" disabled>
            Select payer
          </option>
          {people.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          style={{ padding: 8, marginRight: 8 }}
        />
        <input
          type="text"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          placeholder="Place"
          style={{ padding: 8, marginRight: 8 }}
        />
        <button
          onClick={addExpense}
          style={{ padding: "8px 16px" }}
          disabled={people.length === 0}
        >
          Add Expense
        </button>
      </section>

      {/* Transaction History */}
      <section style={{ marginBottom: 20 }}>
        <h2>Transaction History</h2>
        {expenses.length === 0 ? (
          <p>No expenses yet.</p>
        ) : (
          <ul>
            {expenses.map((e, i) => (
              <li key={i}>
                <strong>{e.payer}</strong> paid ₹{e.amount.toFixed(2)} at{" "}
                <em>{e.place}</em>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Summary */}
      <section style={{ marginBottom: 20 }}>
        <h2>Summary</h2>
        <ul>
          {splitData.map((p) => (
            <li key={p.name}>
              <strong>{p.name}</strong>: Paid ₹{p.paid.toFixed(2)} | Owes ₹
              {p.owes.toFixed(2)} | Balance ₹
              {(p.paid - p.owes).toFixed(2)}
            </li>
          ))}
        </ul>
      </section>

      {/* Settlements */}
      <section style={{ marginBottom: 20 }}>
        <h2>Settlement Instructions</h2>
        {settlements.length === 0 ? (
          <p>All expenses are already settled.</p>
        ) : (
          <ul>
            {settlements.map((s, i) => (
              <li key={i}>
                💸 <strong>{s.from}</strong> owes <strong>{s.to}</strong> ₹
                {s.amount}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Chart */}
      {people.length > 0 && <ExpenseChart data={splitData} />}

     
    </div>
  );
}

export default App;
