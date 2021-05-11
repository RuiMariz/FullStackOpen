import React, { useState, useEffect } from 'react'
import BlogsList from './components/BlogsList'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newLikes, setNewLikes] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
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
      setUsername('')
      setPassword('')
      showSuccessMessage("Logged in")
    } catch (exception) {
      console.log(exception)
      showErrorMessage("Wrong credentials")
    }
  }

  const showErrorMessage = (string) => {
    setErrorMessage(string)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const showSuccessMessage = (string) => {
    setSuccessMessage(string)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    showSuccessMessage("Logged out")
  }

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: newLikes
    }
    try{
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
        setNewLikes('')
        showSuccessMessage("Blog added")
      })
    }catch(exception){
      console.log(exception)
      showErrorMessage("Failed to add blog")
    }
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const handleLikesChange = (event) => {
    setNewLikes(event.target.value)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <h2>Log in</h2>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <h2>Create New Blog</h2>
      title<input value={newTitle} onChange={handleTitleChange} /><br />
      author<input value={newAuthor} onChange={handleAuthorChange} /><br />
      url<input type="url" value={newUrl} onChange={handleUrlChange} /><br />
      likes<input type="number" value={newLikes} onChange={handleLikesChange} /><br />
      <button type="submit">save</button>
    </form>
  )

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={errorMessage} type={"error"} />
      <Notification message={successMessage} type={"success"} />
      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged in <button onClick={() => handleLogOut()}>logout</button></p>
          {blogForm()}
          <BlogsList blogs={blogs} />
        </div>
      }
    </div>
  )
}

export default App