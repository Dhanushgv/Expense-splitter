import React, { useState } from "react";
import NavBar from "./components/NavBar";
import ParticipantForm from "./components/ParticipantForm";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Summary from "./components/Summary";
import { calculateBalances } from "./utils/calculateBalances";

function App() {
  const [participants, setParticipants] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const addParticipant = (name) => {
    if (name && !participants.includes(name)) {
      setParticipants([...participants, name]);
    }
  };

  const addExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };

  const clearAll = () => {
    setParticipants([]);
    setExpenses([]);
  };

  const balances = calculateBalances(participants, expenses);

  return (
    <div className="app">
      <NavBar />
      <ParticipantForm onAdd={addParticipant} />
      <ExpenseForm participants={participants} onAddExpense={addExpense} />
      <ExpenseList expenses={expenses} />
      <Summary balances={balances} expenses={expenses} onClear={clearAll} />
    </div>
  );
}

export default App;
