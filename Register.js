import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({ username: '', password: '', confirmpassword:'', userType: 'technician' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock registration logic
    alert('Registered successfully!');
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="confirm Password"
          value={formData.confirmpasswordpassword}
          onChange={(e) => setFormData({ ...formData, confirmpasswordpassword: e.target.value })}
          style={styles.input}
          required
        />
        <select
          value={formData.userType}
          onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
          style={styles.input}
        >
          <option value="technician">Technician</option>
          <option value="manager">Manager</option>
        </select>
        <button type="submit" style={styles.button}>Register</button>
      </form>
    </div>
  );
}

const styles = {
  container: { textAlign: 'center', marginTop: '50px' },
  form: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  input: { margin: '10px', padding: '10px', width: '200px' },
  button: { padding: '10px 20px' }
};

export default Register;

 