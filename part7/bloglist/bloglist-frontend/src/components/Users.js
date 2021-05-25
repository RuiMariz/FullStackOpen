import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Users = () => {
  const users = useSelector(state => state.users)
  const blogs = useSelector(state => state.blogs)
  return (
    <div>
      <h2>Users</h2>
      <strong>Blogs created</strong>
      <ul>
        {users.map(user =>
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>{user.name} - {blogs.filter(blog => blog.user.id === user.id).length}</Link>
          </li>)}
      </ul>
    </div>
  )
}

export const User = ({ user }) => {
  const blogs = useSelector(state => state.blogs)
  if (!user) {
    return null
  }
  return (
    <div>
      <h2>{user.name}</h2>
      <strong>added blogs</strong>
      <ul>
        {blogs.map(blog => blog.user.id === user.id ?
          <li key={blog.id} >
            <p>{blog.title}</p>
          </li>
          : null)}
      </ul>
    </div>
  )
}

export default Users