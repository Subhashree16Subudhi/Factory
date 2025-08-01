import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Normal', value: 5 },
  { name: 'Needs Maintenance', value: 2 }
];
const COLORS = ['#28a745', '#dc3545'];

function Reports() {
  return (
    <div className="section">
      <h2>Equipment Health Reports</h2>
      <p>
        This chart shows the proportion of equipment operating normally versus 
        those requiring maintenance. Use this dashboard to prioritize 
        maintenance schedules and reduce downtime.
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Reports;
