import React from "react";
import jsPDF from "jspdf";

function Summary({ balances, expenses, onClear }) {
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Expense Summary", 10, 10);
    let y = 20;
    for (let [person, balance] of Object.entries(balances)) {
      doc.text(`${person}: ${balance >= 0 ? "gets" : "owes"} $${Math.abs(balance).toFixed(2)}`, 10, y);
      y += 10;
    }
    doc.save("summary.pdf");
  };

  const expenseHistory = (person) => {
    return expenses
      .filter((e) => e.payer === person || e.splitBetween.includes(person))
      .map((e) => `${e.payer} paid $${e.amount} for [${e.splitBetween.join(", ")}]`);
  };

  return (
    <div>
      <h3>Summary</h3>
      <ul>
        {Object.entries(balances).map(([person, balance]) => (
          <li key={person}>
            {person}: {balance >= 0 ? "gets" : "owes"} ${Math.abs(balance).toFixed(2)}
            <ul>
              {expenseHistory(person).map((h, i) => (
                <li key={i}>• {h}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <button onClick={exportPDF}>Export PDF</button>
      <button onClick={onClear}>Clear All</button>
    </div>
  );
}

export default Summary;
