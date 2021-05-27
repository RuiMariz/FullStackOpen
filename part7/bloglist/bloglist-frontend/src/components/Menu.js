import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Switch, Route, Link, useRouteMatch, Redirect } from 'react-router-dom'
import { logOutUser } from '../reducers/userReducer'
import blogService from '../services/blogs'
import Users, { User } from './Users'
import BlogsList from './BlogsList'
import Blog from './Blog'
import LoginForm from './LoginForm'
import Notification, { showSuccessMessage } from './Notification'
import { Button, AppBar, Toolbar } from '@material-ui/core'
import LoginIcon from '@material-ui/icons/AccountCircle'
import LogoutIcon from '@material-ui/icons/ExitToApp'

const Menu = () => {
  const user = useSelector(state => state.user)
  const users = useSelector(state => state.users)
  const blogs = useSelector(state => state.blogs)
  const dispatch = useDispatch()

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    dispatch(logOutUser())
    blogService.setToken(null)
    showSuccessMessage('Logged out', dispatch)
  }

  const matchUsers = useRouteMatch('/users/:id')
  let userMatch
  if (matchUsers)
    userMatch = matchUsers ? users.find(user => user.id === matchUsers.params.id) : null

  const matchBlogs = useRouteMatch('/blogs/:id')
  let blogMatch
  if (matchBlogs)
    blogMatch = matchBlogs ? blogs.find(blog => blog.id === matchBlogs.params.id) : null

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Button style={{ marginRight: '10px' }} color="inherit" component={Link} to="/blogs">blogs</Button>
          <Button color="inherit" component={Link} to="/users">users</Button>
          <div style={{ width: '100%' }}>
            <div style={{ float: 'right', fontSize: '1.2em' }}>
              {user ?
                <div style={{ display: 'flex', alignItems: 'center' }}><div><strong>{user.name}</strong> logged in</div>
                  <div style={{ marginLeft: '10px' }}></div>
                  <Button startIcon={<LogoutIcon />} variant="contained" color="secondary" onClick={handleLogOut}>
                    Logout
                  </Button>
                </div>
                : <Button startIcon={<LoginIcon />} color="inherit" component={Link} to="/login">login</Button>
              }
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <Notification />
      <Switch>
        <Route path="/users/:id">
          <User user={userMatch} />
        </Route>
        <Route path="/users">
          <Users />
        </Route>
        <Route path="/blogs/:id">
          <Blog blog={blogMatch} />
        </Route>
        <Route path="/blogs">
          <BlogsList />
        </Route>
        {!user &&
          <Route path="/login">
            <LoginForm />
          </Route>
        }
        <Route path="/">
          <Redirect to="/blogs" />
        </Route>
      </Switch>
    </div >
  )
}

export default Menu