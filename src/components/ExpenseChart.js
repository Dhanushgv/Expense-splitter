import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF", "#FF6B6B"];

function ExpenseChart({ data }) {
  const pieData = data.map(({ name, paid }) => ({ name, value: paid }));
  const barData = data.map(({ name, paid, owes }) => ({
    name,
    Paid: paid,
    Owes: owes,
  }));

  return (
    <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", marginTop: 40 }}>
      <div style={{ width: 300, height: 300 }}>
        <h3 style={{ textAlign: "center" }}>Paid by Person (Pie Chart)</h3>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{ width: 500, height: 300 }}>
        <h3 style={{ textAlign: "center" }}>Paid vs Owes (Bar Chart)</h3>
        <ResponsiveContainer>
          <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Paid" fill="#0088FE" />
            <Bar dataKey="Owes" fill="#FF8042" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ExpenseChart;
