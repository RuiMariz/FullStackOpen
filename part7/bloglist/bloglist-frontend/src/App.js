import React, { useState, useEffect, useRef } from 'react'
import BlogsList from './components/BlogsList'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import { showNotification } from './reducers/notificationReducer'
import { useDispatch } from 'react-redux'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => a.likes < b.likes ? 1 : -1))
    )
  }, [])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const setAndSortBlogs = (blogs) => {
    setBlogs([...blogs].sort((a, b) => a.likes < b.likes ? 1 : -1))
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      setUser(user)
      blogService.setToken(user.token)
      showSuccessMessage('Logged in')
    } catch (exception) {
      console.log(exception)
      showErrorMessage('Wrong credentials')
    }
  }

  const dispatch = useDispatch()

  const showErrorMessage = (string) => {
    showNotification(string, 'error', dispatch)
  }

  const showSuccessMessage = (string) => {
    showNotification(string, 'success', dispatch)
  }

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    showSuccessMessage('Logged out')
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        returnedBlog.user = user
        setAndSortBlogs(blogs.concat(returnedBlog))
        showSuccessMessage('Blog added')
      })
  }

  const updateBlog = (blogObject) => {
    blogService
      .update(blogObject.id, blogObject)
      .then(returnedBlog => {
        setAndSortBlogs(blogs.map(blog => blog.id !== returnedBlog.id ? blog : returnedBlog))
        showSuccessMessage('Blog updated')
      })
  }

  const removeBlog = (blogObject) => {
    if (!window.confirm(`Remove ${blogObject.title} by ${blogObject.author}`))
      return
    blogService
      .remove(blogObject.id)
      .then(() => {
        setBlogs(blogs.filter(blog => blog.id !== blogObject.id))
        showSuccessMessage('Blog deleted')
      })
  }

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

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