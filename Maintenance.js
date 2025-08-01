import React from 'react';

function Maintenance() {
  const logs = [
    { date: '2024-06-10', issue: 'Hydraulic leak', action: 'Replaced seal' },
    { date: '2024-07-01', issue: 'Pressure drop', action: 'Adjusted valve' }
  ];

  return (
    <div className="section">
      <h2>Maintenance Logs</h2>
      <ul>
        {logs.map((log, i) => (
          <li key={i}><b>{log.date}</b>: {log.issue} → {log.action}</li>
        ))}
      </ul>
    </div>
  );
}

export default Maintenance;
