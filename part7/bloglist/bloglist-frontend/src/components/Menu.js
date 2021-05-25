import React from 'react'
import { Switch, Route, Link, useRouteMatch } from 'react-router-dom'
import Users, { User } from './Users'
import BlogsList from './BlogsList'
import Blog from './Blog'

const Menu = (props) => {
  const padding = {
    paddingRight: 5
  }
  const matchUsers = useRouteMatch('/users/:id')
  let user
  if (props.users)
    user = matchUsers ? props.users.find(user => user.id === matchUsers.params.id) : null

  const matchBlogs = useRouteMatch('/blogs/:id')
  let blog
  if (props.blogs)
    blog = matchBlogs ? props.blogs.find(blog => blog.id === matchBlogs.params.id) : null

  return (
    <div>
      <Link style={padding} to="/">blogs</Link>
      <Link style={padding} to="/users">users</Link>
      <Switch>
        <Route path="/users/:id">
          <User user={user} />
        </Route>
        <Route path="/users">
          <Users />
        </Route>
        <Route path="/blogs/:id">
          <Blog blog={blog} updateBlog={props.updateBlog} removeBlog={props.removeBlog} />
        </Route>
        <Route path="/">
          <BlogsList updateBlog={props.updateBlog} removeBlog={props.removeBlog} blogForm={props.blogForm()} />
        </Route>
      </Switch>
    </div>
  )
}

export default Menu