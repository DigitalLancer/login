import React from 'react'
import './home.css'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [userName, setUserName] = useState('');
  const [id, setId] = useState(null);
  const [password, setPassword] = useState('');
  //input values
  const [usernameInput, setInputName] = useState('');
  const [passwordInput, setInputPassword] = useState('');

  const [loggedIn, setLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn");
    if (isLoggedIn === 'true') {
      const username = localStorage.getItem("username");
      const fetchData = async () => {
        try {
          const res = await fetch(`http://localhost:3000/users/${username}`);
          const data = await res.json();
          setUserName(data.username);
          setId(data.id);
        } catch (err) {
          console.error('Fetch error:', err);
        }
      };
      fetchData();
      setLoggedIn(true);
    }
    else {
      navigate('/');
      setLoggedIn(false);
    }
  }, []);


  const handleExit = () => {
    localStorage.setItem("loggedIn", "false");
    localStorage.removeItem("username");
    navigate('/');
  }

  const handleUpdateName = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:3000/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patchType: 'username', changeValue: usernameInput, id }),
    });
    setUserName(usernameInput);
    setInputName('');
    console.log("response from server:");
    console.log(res);
    window.alert("User name updated");
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:3000/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patchType: 'password', changeValue:password, id }),
    });
    setPassword('');
    console.log("response from server:");
    console.log(res);
    window.alert("Password updated");
  }

  return (
    <div className='home-container'>
      <button onClick={handleExit} className='exit-btn'>Exit</button>
      <h1 style={{ 'margin': "30px" }}>Welcome {userName}</h1>
      <div className="edit-form">
        <h2>Change user info</h2>
        <form onSubmit={handleUpdateName}>
          <div className='edit-input-container'>
            <input type="text" name="username" placeholder="Change username" value={usernameInput} onChange={(e) => setInputName(e.target.value)} required />
            <button className='edit-btn'>OK</button>
          </div>
        </form>
        <form onSubmit={handleUpdatePassword}>
          <div className='edit-input-container'>
            <input type="password" name="password" placeholder="Change password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button className='edit-btn'>OK</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Home