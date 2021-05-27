import React, { useEffect } from 'react'
import blogService from './services/blogs'
import usersService from './services/users'
import { logInUser, logOutUser } from './reducers/userReducer'
import { useDispatch, useSelector } from 'react-redux'
import { initBlogs, removeBlogRedux, updateBlogRedux } from './reducers/blogsReducer'
import { initUsers } from './reducers/usersReducer'
import Menu from './components/Menu'
import { showSuccessMessage } from './components/Notification'
import { useHistory, } from 'react-router-dom'
import Container from '@material-ui/core/Container'

const App = () => {

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

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    dispatch(logOutUser())
    blogService.setToken(null)
    showSuccessMessage('Logged out', dispatch)
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
    blogService
      .remove(blogObject.id)
      .then(() => {
        dispatch(removeBlogRedux(blogObject))
        showSuccessMessage('Blog removed', dispatch)
        history.push('/')
      })
  }

  const user = useSelector(state => state.user)
  const blogs = useSelector(state => state.blogs)
  const users = useSelector(state => state.users)

  return (
    <Container>
      <h1>Blogs</h1>
      <Menu user={user} users={users} blogs={blogs}
        likeBlog={likeBlog} removeBlog={removeBlog} handleLogOut={handleLogOut}/>
    </Container>
  )
}

export default App