import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import blogService from './services/blogs'
import usersService from './services/users'
import { logInUser } from './reducers/userReducer'
import { initBlogs } from './reducers/blogsReducer'
import { initUsers } from './reducers/usersReducer'
import Menu from './components/Menu'
import Container from '@material-ui/core/Container'

const App = () => {
  const dispatch = useDispatch()

  useEffect(async () => {
    const blogs = await blogService.getAll()
    dispatch(initBlogs(blogs))
  }, [])
  useEffect(async () => {
    const users = await usersService.getAll()
    dispatch(initUsers(users))

  }, [])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(logInUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  return (
    <Container>
      <h1>Blogs</h1>
      <Menu />
    </Container>
  )
}

export default App