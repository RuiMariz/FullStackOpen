import React from 'react'
import { Switch, Route, Link, useRouteMatch, Redirect } from 'react-router-dom'
import Users, { User } from './Users'
import BlogsList from './BlogsList'
import Blog from './Blog'
import LoginForm from './LoginForm'
import { useSelector } from 'react-redux'
import { Button, AppBar, Toolbar } from '@material-ui/core'
import Notification from './Notification'
import LoginIcon from '@material-ui/icons/AccountCircle'
import LogoutIcon from '@material-ui/icons/ExitToApp'

const Menu = (props) => {
  const user = useSelector(state => state.user)
  const blogs = useSelector(state => state.blogs)
  const padding = {
    paddingRight: 10,
    paddingLeft: 10,
    marginRight: 10
  }

  const matchUsers = useRouteMatch('/users/:id')
  let userMatch
  if (matchUsers)
    userMatch = matchUsers ? props.users.find(user => user.id === matchUsers.params.id) : null

  const matchBlogs = useRouteMatch('/blogs/:id')
  let blogMatch
  if (matchBlogs)
    blogMatch = matchBlogs ? blogs.find(blog => blog.id === matchBlogs.params.id) : null

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Button style={padding} color="inherit" component={Link} to="/">blogs</Button>
          <Button style={padding} color="inherit" component={Link} to="/users">users</Button>
          <div className="superWidth">
            <div className="logInMenuItem">
              {user ?
                <div className="loggedInMenuItem"><div><strong>{user.name}</strong> logged in</div>
                  <div className="logOutButton"></div>
                  <Button startIcon={<LogoutIcon />} variant="contained" color="secondary" onClick={props.handleLogOut}>
                    Logout
                  </Button>
                </div>
                : <Button startIcon={<LoginIcon />} color="inherit" className="logInMenuItem" component={Link} to="/login">login</Button>
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
          <Blog blog={blogMatch} likeBlog={props.likeBlog} removeBlog={props.removeBlog} />
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
    </div>
  )
}

export default Menu