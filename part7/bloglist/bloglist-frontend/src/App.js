import React, { useState, useEffect, useRef } from 'react'
import BlogsList from './components/BlogsList'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import { showNotification } from './reducers/notificationReducer'
import { logInUser, logOutUser } from './reducers/userReducer'
import { useDispatch, useSelector } from 'react-redux'
import { initBlogs, createBlog, removeBlogRedux, updateBlogRedux } from './reducers/blogsReducer'


const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const blogFormRef = useRef()

  const dispatch = useDispatch()

  useEffect(() => {
    blogService.getAll()
      .then(blogs =>
        dispatch(initBlogs(blogs))
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

  const handleLogin = async (event) => {
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
      showSuccessMessage('Logged in')
    } catch (exception) {
      console.log(exception)
      showErrorMessage('Wrong credentials')
    }
  }

  const showErrorMessage = (string) => {
    showNotification(string, 'error', dispatch)
  }

  const showSuccessMessage = (string) => {
    showNotification(string, 'success', dispatch)
  }

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    dispatch(logOutUser())
    blogService.setToken(null)
    showSuccessMessage('Logged out')
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        returnedBlog.user = user
        dispatch(createBlog(returnedBlog))
        showSuccessMessage('Blog added')
      })
  }

  const updateBlog = (blogObject) => {
    blogService
      .update(blogObject.id, blogObject)
      .then(returnedBlog => {
        dispatch(updateBlogRedux(returnedBlog))
        showSuccessMessage('Blog updated')
      })
  }

  const removeBlog = (blogObject) => {
    if (!window.confirm(`Remove ${blogObject.title} by ${blogObject.author}`))
      return
    blogService
      .remove(blogObject.id)
      .then(() => {
        dispatch(removeBlogRedux(blogObject))
        showSuccessMessage('Blog deleted')
      })
  }

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const user = useSelector(state => state.user)
  const blogs = useSelector(state => state.blogs)

  return (
    <div>
      <h1>Blogs</h1>
      <Notification />
      {user === null ?
        <LoginForm handleLogin={handleLogin} username={username} password={password}
          setUsername={setUsername} setPassword={setPassword} /> :
        <div>
          <p>{user.name} logged in <button onClick={() => handleLogOut()} className="logoutButton">logout</button></p>
          {blogForm()}
        </div>
      }
      <BlogsList blogs={blogs} updateBlog={updateBlog} removeBlog={removeBlog} user={user} />
    </div>
  )
}

export default App