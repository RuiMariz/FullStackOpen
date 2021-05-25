import React from 'react'
import { Switch, Route, Link, useRouteMatch } from 'react-router-dom'
import Users, { User } from './Users'
import BlogsList from './BlogsList'

const Menu = (props) => {
  const padding = {
    paddingRight: 5
  }
  const match = useRouteMatch('/users/:id')
  let user
  if (props.users)
    user = match ? props.users.find(user => user.id === match.params.id) : null

  return (
    <div>
      <Link style={padding} to="/">main page</Link>
      <Link style={padding} to="/users">users</Link>
      <Switch>
        <Route path="/users/:id">
          <User user={user} />
        </Route>
        <Route path="/users">
          <Users />
        </Route>
        <Route path="/">
          <BlogsList updateBlog={props.updateBlog} removeBlog={props.removeBlog} blogForm={props.blogForm()}/>
        </Route>
      </Switch>
    </div>
  )
}

export default Menu