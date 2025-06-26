import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css'
function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [reTypePassword, setRetypePassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== reTypePassword) {
            window.alert("Passwords don't match");
        }
        else {
            const res = await fetch('http://localhost:3000/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            console.log("response from server:");
            console.log(res);
            if (!res.ok) {
                window.alert('Username already taken');
            }
            else {
                window.alert("Register success");
                navigate('/');
            }
        }
    }

    return (
        <div className='page-container'>
            <div className='register-container'>
                <h1>Sign Up</h1>
                <form onSubmit={handleRegister}>
                    <div class="form-group">
                        <input type="text" class="form-input" name="username" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} required />
                        <input type="password" class="form-input" name="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <input type="password" class="form-input" name="password" placeholder='Confirm Password' value={reTypePassword} onChange={(e) => setRetypePassword(e.target.value)} required style={{'marginBottom':'30px'}}/>
                        <button type="submit" class="register-btn">Complete</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register