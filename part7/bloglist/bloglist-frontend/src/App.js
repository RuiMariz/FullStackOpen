import React, { useEffect, useRef, useState } from 'react'
import blogService from './services/blogs'
import usersService from './services/users'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import { logInUser, logOutUser } from './reducers/userReducer'
import { useDispatch, useSelector } from 'react-redux'
import { initBlogs, createBlog, removeBlogRedux, updateBlogRedux } from './reducers/blogsReducer'
import { initUsers } from './reducers/usersReducer'
import Menu from './components/Menu'
import { showErrorMessage, showSuccessMessage } from './components/Notification'
import { useHistory, } from 'react-router-dom'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const blogFormRef = useRef()
  const history = useHistory()

  const dispatch = useDispatch()

  useEffect(() => {
    blogService.getAll()
      .then(blogs =>
        dispatch(initBlogs(blogs))
      )
  }, [])
  useEffect(() => {
    usersService.getAll()
      .then(users =>
        dispatch(initUsers(users))
      )
  }, [])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(logInUser(user))
      blogService.setToken(user.token)
    }
  }, [])

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
    } catch (exception) {
      console.log(exception)
      showErrorMessage('Wrong credentials', dispatch)
    }
  }

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    dispatch(logOutUser())
    blogService.setToken(null)
    showSuccessMessage('Logged out', dispatch)
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        returnedBlog.user = user
        dispatch(createBlog(returnedBlog))
        showSuccessMessage('Blog added', dispatch)
      })
  }

  const likeBlog = (blogObject) => {
    blogService
      .likeBlog(blogObject.id)
      .then(returnedBlog => {
        dispatch(updateBlogRedux(returnedBlog))
        showSuccessMessage('Blog updated', dispatch)
      })
  }

  const removeBlog = (blogObject) => {
    if (!window.confirm(`Remove ${blogObject.title} by ${blogObject.author}`))
      return
    blogService
      .remove(blogObject.id)
      .then(() => {
        dispatch(removeBlogRedux(blogObject))
        showSuccessMessage('Blog deleted', dispatch)
        history.push('/')
      })
  }

  const blogForm = () => {
    if (!user)
      return null
    return (
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
    )
  }

  const user = useSelector(state => state.user)
  const blogs = useSelector(state => state.blogs)
  const users = useSelector(state => state.users)

  return (
    <div>
      <h1>Blogs</h1>
      <Notification />
      {user === null ?
        <LoginForm handleLogIn={handleLogIn} username={username} password={password}
          setUsername={setUsername} setPassword={setPassword} /> :
        <div>
          <p>{user.name} logged in <button onClick={() => handleLogOut()} className="logoutButton">logout</button></p>
        </div>
      }
      <Menu user={user} users={users} blogs={blogs} blogForm={blogForm}
        likeBlog={likeBlog} removeBlog={removeBlog} />
    </div>
  )
}

export default App