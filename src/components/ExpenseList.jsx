import React from "react";

function ExpenseList({ expenses }) {
  return (
    <div>
      <h3>Expenses</h3>
      <ul>
        {expenses.map((e, idx) => (
          <li key={idx}>
            {e.payer} paid ${e.amount} split between {e.splitBetween.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseList;
