import React from 'react'
import './login.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn");
    if (isLoggedIn === 'true') {
      navigate('/home');
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    console.log("response from server:");
    console.log(res);

    if (res.status === 200) {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("username",username);
      navigate('/home');
    }
    else if (res.status === 401 || res.status === 404) {
      window.alert("Wrong username or password");
    }
    setUsername("");
    setPassword("");
  }

  return (
    <div className='page-container'>
      <div className='login-container'>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div class="form-group">
            <input type="text" class="form-input" name="username" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" class="form-input" name="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} style={{ 'marginBottom': '30px' }} />
            <button type="submit" class="login-btn">Login</button>
          </div>
        </form>
        <button class="register-btn" onClick={() => navigate('/register')}>Sign Up</button>
      </div>
    </div>
  )
}

export default Login