import React from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ handleLogIn, username, password, setUsername, setPassword }) => {
  return (
    <form onSubmit={handleLogIn}>
      <div>
        <h2>Log in</h2>
        username<input type="text" id="username" value={username} name="Username" onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        password<input type="password" id="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button type="submit" id="loginButton">login </button>
    </form>
  )
}

LoginForm.propTypes = {
  handleLogIn: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired
}

export default LoginForm