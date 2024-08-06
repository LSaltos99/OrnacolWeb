import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseAnon } from '../../supabaseConfig'; // Asegúrate de ajustar la ruta si es necesario

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Busca al usuario en la base de datos
      let { data: users, error } = await supabaseAnon
        .from('usuarios')
        .select('*')
        .eq('username', username)
        .eq('password', password);

      if (error) throw error;

      if (users.length > 0) {
        // Redirige al dashboard si las credenciales son correctas
        navigate('/dashboard');
      } else {
        setErrorMessage('Invalid username or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', width: '400px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px', color: '#333', textTransform: 'uppercase' }}>DASHBOARD ORNACOL</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {errorMessage && <p style={{ color: 'red', marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>{errorMessage}</p>}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>
              Usuario:
              <input type="text" name="username" value={username} onChange={handleInputChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
            </label>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>
              Contraseña:
              <input type="password" name="password" value={password} onChange={handleInputChange} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
            </label>
          </div>
          <button type="submit" style={{ padding: '10px', border: 'none', borderRadius: '4px', backgroundColor: '#007bff', color: 'white', cursor: 'pointer', width: '100%' }}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
