import React from 'react'
import { useState } from 'react'
import './App.css'
function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Emri dhe fjalekalimi jane te nevojshme.')
      setSuccess(false)
      return;
    }

    if (username === 'admin' && password === 'password') {
      setSuccess(true)
      setError('')
    } else {
      setError('Emri ose fjalekalimi jane te pasakta.')
      setSuccess(false)
    }
  }

  return (
    <div className="App">
      <div className='Login-container'>
        <h2>Login</h2>

        {error && <div className='error-message'>{error}</div>}
        {success && <div className='success-message'>Login successful!</div>}
        
        <form onSubmit={handleSubmit}>
          <div className='input-group'>
            <label>Username:</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Shkruaj Emrin'/>
          </div>
          <div className='input-group'>
            <label>Password:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Shkruaj Fjalekalimin'
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  )

}
export default App