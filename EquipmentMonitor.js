// EquipmentMonitor.js
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from 'axios';
import { Menu, X, Sun, Moon, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { Chart } from 'chart.js/auto';

function EquipmentMonitor() {
  const location = useLocation();
  const navigate = useNavigate();
  const userType = location.state?.userType || 'technician';

  const [equipmentList, setEquipmentList] = useState([
    // fallback sample if API fails
    {
      id: 1,
      name: 'Compressor A',
      temperature: 78,
      vibration: 0.6,
      needsMaintenance: false,
      history: ['2023-08-01: Normal'],
      replacementInfo: 'Not replaced',
      repairsAllowed: 3,
      lifespan: 5,
      description: '',
      report: '',
      installedDate: '',
      efficiencyDependsOn: 'TemperatureVibration',
      repairsDone: 0,
      safeTemp: 90,
      safeVib: 1,
      maxRepairs: 3,
      lifeline: 5,
    },
    {
      id: 2,
      name: 'Pump B',
      temperature: 95,
      vibration: 1.2,
      needsMaintenance: true,
      history: ['2023-07-20: Replaced valve', '2023-06-15: Lubrication done'],
      replacementInfo: 'Valve replaced in 2023',
      repairsAllowed: 2,
      lifespan: 7,
      description: '',
      report: '',
      installedDate: '',
      efficiencyDependsOn: 'TemperatureVibration',
      repairsDone: 1,
      safeTemp: 85,
      safeVib: 1,
      maxRepairs: 2,
      lifeline: 3,
    },
  ]);

  const [newEquipment, setNewEquipment] = useState({
    name: '',
    temperature: '',
    vibration: '',
    replacementInfo: '',
    repairsAllowed: '',
    lifespan: '',
    description: '',
    report: '',
    installedDate: '',
    lifeline: '',
    maxRepairs: '',
    safeTemp: '',
    safeVib: '',
  });

  const [editingEquipment, setEditingEquipment] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const chartRef = useRef(null);
  const tempChartRef = useRef(null);
  const vibChartRef = useRef(null);
  const chartInstance = useRef(null);
  const tempChartInstance = useRef(null);
  const vibChartInstance = useRef(null);

  const toggleDarkMode = () => setDarkMode((d) => !d);

  // Fetch data from API with fallback to sample
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/equipment')
      .then((response) => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          setEquipmentList(response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching equipment data:', error);
      });
  }, []);

  const computeNeedsMaintenance = (eq) => {
    const temp = parseFloat(eq.temperature);
    const vib = parseFloat(eq.vibration);
    const safeTemp = parseFloat(eq.safeTemp || Infinity);
    const safeVib = parseFloat(eq.safeVib || Infinity);
    const installedDate = eq.installedDate ? new Date(eq.installedDate) : null;
    let yearsInService = 0;
    if (installedDate) {
      yearsInService =
        (new Date() - installedDate) / (1000 * 60 * 60 * 24 * 365.25);
    }
    const lifespan = parseInt(eq.lifespan) || 0;

    return (
      temp > safeTemp ||
      vib > safeVib ||
      (lifespan && yearsInService > lifespan)
    );
  };

  const handleAddEquipment = () => {
    if (!newEquipment.name) return;

    const id = equipmentList.length + 1;
    const temperature = parseFloat(newEquipment.temperature) || 0;
    const vibration = parseFloat(newEquipment.vibration) || 0;
    const repairsAllowed = parseInt(newEquipment.repairsAllowed) || 0;
    const lifespan = parseInt(newEquipment.lifespan) || 0;
    const safeTemp = parseFloat(newEquipment.safeTemp) || 0;
    const safeVib = parseFloat(newEquipment.safeVib) || 0;
    const maxRepairs = parseInt(newEquipment.maxRepairs) || repairsAllowed;
    const lifeline = parseInt(newEquipment.lifeline) || 0;

    const base = {
      id,
      name: newEquipment.name,
      temperature,
      vibration,
      replacementInfo: newEquipment.replacementInfo || '',
      repairsAllowed,
      lifespan,
      description: newEquipment.description || '',
      report: newEquipment.report || '',
      installedDate: newEquipment.installedDate || '',
      efficiencyDependsOn: 'TemperatureVibration',
      repairsDone: 0,
      safeTemp,
      safeVib,
      maxRepairs,
      lifeline,
    };
    base.needsMaintenance = computeNeedsMaintenance(base);
    base.history = [`${new Date().toISOString().split('T')[0]}: Added`];

    axios
      .post('http://localhost:5000/api/equipment', base)
      .then((response) => {
        setEquipmentList([...equipmentList, response.data || base]);
      })
      .catch((error) => {
        console.error('Error adding equipment:', error);
        setEquipmentList([...equipmentList, base]);
      });

    setNewEquipment({
      name: '',
      temperature: '',
      vibration: '',
      replacementInfo: '',
      repairsAllowed: '',
      lifespan: '',
      description: '',
      report: '',
      installedDate: '',
      lifeline: '',
      maxRepairs: '',
      safeTemp: '',
      safeVib: '',
    });
    setEditingEquipment(null);
  };

  const handleEditClick = (equipment) => {
    setEditingEquipment(equipment);
    setNewEquipment({
      name: equipment.name || '',
      temperature: equipment.temperature || '',
      vibration: equipment.vibration || '',
      replacementInfo: equipment.replacementInfo || '',
      repairsAllowed: equipment.repairsAllowed || '',
      lifespan: equipment.lifespan || '',
      description: equipment.description || '',
      report: equipment.report || '',
      installedDate: equipment.installedDate || '',
      lifeline: equipment.lifeline || '',
      maxRepairs: equipment.maxRepairs || '',
      safeTemp: equipment.safeTemp || '',
      safeVib: equipment.safeVib || '',
    });
  };

  const handleUpdateEquipment = () => {
    if (!editingEquipment) return;
    const updated = {
      ...editingEquipment,
      ...newEquipment,
      temperature: parseFloat(newEquipment.temperature) || editingEquipment.temperature,
      vibration: parseFloat(newEquipment.vibration) || editingEquipment.vibration,
      repairsAllowed: parseInt(newEquipment.repairsAllowed) || editingEquipment.repairsAllowed,
      lifespan: parseInt(newEquipment.lifespan) || editingEquipment.lifespan,
      maxRepairs: parseInt(newEquipment.maxRepairs) || editingEquipment.maxRepairs,
      lifeline: parseInt(newEquipment.lifeline) || editingEquipment.lifeline,
      safeTemp: parseFloat(newEquipment.safeTemp) || editingEquipment.safeTemp,
      safeVib: parseFloat(newEquipment.safeVib) || editingEquipment.safeVib,
    };
    updated.needsMaintenance = computeNeedsMaintenance(updated);
    if (!Array.isArray(updated.history)) {
      updated.history = updated.history ? [updated.history] : [];
    }
    updated.history = [
      ...updated.history,
      `${new Date().toISOString().split('T')[0]}: Updated`,
    ];

    const updatedList = equipmentList.map((eq) =>
      eq.id === editingEquipment.id ? updated : eq
    );
    setEquipmentList(updatedList);
    setEditingEquipment(null);
    setNewEquipment({
      name: '',
      temperature: '',
      vibration: '',
      replacementInfo: '',
      repairsAllowed: '',
      lifespan: '',
      description: '',
      report: '',
      installedDate: '',
      lifeline: '',
      maxRepairs: '',
      safeTemp: '',
      safeVib: '',
    });
  };

  const handleDeleteEquipment = (id) => {
    setEquipmentList(equipmentList.filter((eq) => eq.id !== id));
  };

  const filteredEquipment = equipmentList.filter(
    (eq) =>
      eq.name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      eq.efficiencyDependsOn === 'TemperatureVibration'
  );

  // Summary pie charts
  useEffect(() => {
    const maintenanceCount = equipmentList.filter((eq) => eq.needsMaintenance)
      .length;
    const normalCount = equipmentList.length - maintenanceCount;

    if (chartInstance.current) chartInstance.current.destroy();
    chartInstance.current = new Chart(chartRef.current, {
      type: 'pie',
      data: {
        labels: ['Needs Maintenance', 'Normal'],
        datasets: [
          {
            data: [maintenanceCount, normalCount],
            backgroundColor: ['#ef4444', '#10b981'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
      },
    });

    const tempRanges = { '<70°C': 0, '70–90°C': 0, '>90°C': 0 };
    const vibRanges = { '<0.5 Hz': 0, '0.5–1 Hz': 0, '>1 Hz': 0 };
    equipmentList.forEach((eq) => {
      const temp = eq.temperature;
      const vib = eq.vibration;
      if (temp < 70) tempRanges['<70°C']++;
      else if (temp <= 90) tempRanges['70–90°C']++;
      else tempRanges['>90°C']++;

      if (vib < 0.5) vibRanges['<0.5 Hz']++;
      else if (vib <= 1) vibRanges['0.5–1 Hz']++;
      else vibRanges['>1 Hz']++;
    });

    if (tempChartInstance.current) tempChartInstance.current.destroy();
    if (vibChartInstance.current) vibChartInstance.current.destroy();

    tempChartInstance.current = new Chart(tempChartRef.current, {
      type: 'pie',
      data: {
        labels: Object.keys(tempRanges),
        datasets: [
          {
            data: Object.values(tempRanges),
            backgroundColor: ['#a5b4fc', '#60a5fa', '#fca5a5'],
          },
        ],
      },
      options: { responsive: true, plugins: { legend: { position: 'top' } } },
    });

    vibChartInstance.current = new Chart(vibChartRef.current, {
      type: 'pie',
      data: {
        labels: Object.keys(vibRanges),
        datasets: [
          {
            data: Object.values(vibRanges),
            backgroundColor: ['#6ee7b7', '#fcd34d', '#c084fc'],
          },
        ],
      },
      options: { responsive: true, plugins: { legend: { position: 'top' } } },
    });
  }, [equipmentList]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <nav className="navbar">
        <div className="logo">Factory Monitor</div>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <a href="#add">Add Equipment</a>
          <a href="#status">Status</a>
        </div>
        <div className="actions">
          <button className="theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="logout-button" onClick={() => navigate('/')}>
            <LogOut size={18} />
          </button>
          <div className="hamburger" onClick={() => setMenuOpen((o) => !o)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </div>
        </div>
      </nav>

      <div className="container">
        <h2>Welcome, {userType === 'manager' ? 'Manager' : 'Technician'}!</h2>

        {/* Add / Edit Equipment */}
        <div id="add" className="section center">
          <h2>{editingEquipment ? 'Edit Equipment' : 'Add New Equipment'}</h2>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Equipment Name"
              value={newEquipment.name}
              onChange={(e) =>
                setNewEquipment({ ...newEquipment, name: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Temperature"
              value={newEquipment.temperature}
              onChange={(e) =>
                setNewEquipment({ ...newEquipment, temperature: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Vibration"
              value={newEquipment.vibration}
              onChange={(e) =>
                setNewEquipment({ ...newEquipment, vibration: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Replacement Info"
              value={newEquipment.replacementInfo}
              onChange={(e) =>
                setNewEquipment({ ...newEquipment, replacementInfo: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Repairs Allowed"
              value={newEquipment.repairsAllowed}
              onChange={(e) =>
                setNewEquipment({ ...newEquipment, repairsAllowed: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Max Repairs"
              value={newEquipment.maxRepairs}
              onChange={(e) =>
                setNewEquipment({ ...newEquipment, maxRepairs: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Lifespan (Years)"
              value={newEquipment.lifespan}
              onChange={(e) =>
                setNewEquipment({ ...newEquipment, lifespan: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Lifeline (Years)"
              value={newEquipment.lifeline}
              onChange={(e) =>
                setNewEquipment({ ...newEquipment, lifeline: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Safe Temperature °C"
              value={newEquipment.safeTemp}
              onChange={(e) =>
                setNewEquipment({ ...newEquipment, safeTemp: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Safe Vibration Hz"
              value={newEquipment.safeVib}
              onChange={(e) =>
                setNewEquipment({ ...newEquipment, safeVib: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Description"
              value={newEquipment.description}
              onChange={(e) =>
                setNewEquipment({ ...newEquipment, description: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Report"
              value={newEquipment.report}
              onChange={(e) =>
                setNewEquipment({ ...newEquipment, report: e.target.value })
              }
            />
            <input
              type="date"
              placeholder="Installed Date"
              value={newEquipment.installedDate}
              onChange={(e) =>
                setNewEquipment({ ...newEquipment, installedDate: e.target.value })
              }
            />
          </div>
          {editingEquipment ? (
            <button onClick={handleUpdateEquipment}>Update Equipment</button>
          ) : (
            <button onClick={handleAddEquipment}>Add Equipment</button>
          )}
        </div>

        {/* Real-Time Metrics */}
        <div className="section">
          <h2>Real-Time Equipment Metrics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={equipmentList}>
              <CartesianGrid stroke="#444" strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="temperature" stroke="#6366f1" />
              <Line type="monotone" dataKey="vibration" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Equipment Status Table */}
        <div id="status" className="section">
          <h2>Equipment Status</h2>
          <input
            type="text"
            className="search-bar"
            placeholder="Search by equipment name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Temperature</th>
                  <th>Vibration</th>
                  <th>Status</th>
                  <th>Replacement Info</th>
                  <th>Repairs Allowed</th>
                  <th>Max Repairs</th>
                  <th>Lifespan</th>
                  <th>Lifeline</th>
                  <th>Description</th>
                  <th>Report</th>
                  <th>History</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipment.map((eq) => {
                  const status =
                    eq.repairsDone >= (eq.maxRepairs || eq.repairsAllowed)
                      ? 'Replacement Needed'
                      : eq.needsMaintenance
                      ? 'Needs Maintenance'
                      : 'Normal';
                  return (
                    <tr key={eq.id}>
                      <td>{eq.id}</td>
                      <td>{eq.name}</td>
                      <td>{eq.temperature}°C</td>
                      <td>{eq.vibration} Hz</td>
                      <td className={status === 'Normal' ? 'normal' : 'alert'}>
                        {status}
                      </td>
                      <td>{eq.replacementInfo}</td>
                      <td>{eq.repairsAllowed}</td>
                      <td>{eq.maxRepairs}</td>
                      <td>{eq.lifespan} years</td>
                      <td>{eq.lifeline} yrs</td>
                      <td>{eq.description}</td>
                      <td>{eq.report}</td>
                      <td>
                        <ul>
                          {(Array.isArray(eq.history) ? eq.history : [eq.history]).map(
                            (h, i) => (
                              <li key={i}>{h}</li>
                            )
                          )}
                        </ul>
                      </td>
                      <td>
                        <button onClick={() => handleEditClick(eq)}>Edit</button>
                        <button onClick={() => handleDeleteEquipment(eq.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredEquipment.length === 0 && (
                  <tr>
                    <td colSpan={14} style={{ textAlign: 'center' }}>
                      No equipment matching filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Charts */}
        <div className="chart-section">
          <div>
            <h3>Equipment Status Overview</h3>
            <canvas ref={chartRef} />
          </div>
          <div>
            <h3>Temperature Distribution</h3>
            <canvas ref={tempChartRef} />
          </div>
          <div>
            <h3>Vibration Distribution</h3>
            <canvas ref={vibChartRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EquipmentMonitor;
