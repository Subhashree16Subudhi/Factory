import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [userType, setUserType] = useState('technician');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/equipment-monitoring', { state: { userType } });
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input type="text" placeholder="Username" style={styles.input} required />
        <input type="password" placeholder="Password" style={styles.input} required />
        <select value={userType} onChange={(e) => setUserType(e.target.value)} style={styles.input}>
          <option value="technician">Technician</option>
          <option value="manager">Manager</option>
        </select>
        <button type="submit" style={styles.button}>Login</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register here</Link></p>
    </div>
  );
}

const styles = {
  container: { textAlign: 'center', marginTop: '50px' },
  form: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  input: { margin: '10px', padding: '10px', width: '200px' },
  button: { padding: '10px 20px' }
};

export default Login;
 