import React, { useState } from 'react'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { logInUser } from '../reducers/userReducer'
import { showSuccessMessage, showErrorMessage } from './Notification'
import { useDispatch } from 'react-redux'
import { TextField, Button } from '@material-ui/core'
import { useHistory } from 'react-router-dom'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const history = useHistory()

  const handleLogIn = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      dispatch(logInUser(user))
      blogService.setToken(user.token)
      showSuccessMessage('Logged in', dispatch)
      history.push('/')
    } catch (exception) {
      console.log(exception)
      showErrorMessage('Wrong credentials', dispatch)
    }
  }

  return (
    <div>
      <h2>Log in</h2>
      <form onSubmit={handleLogIn}>
        <div>
          <TextField label="username" type="text" id="username" value={username} name="Username" onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          <TextField label="password" type='password' id="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)} />
        </div>
        <Button variant="contained" color="primary" type="submit" id="loginButton">login</Button>
      </form>
    </div>
  )
}

export default LoginForm