import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Paper
} from '@material-ui/core'

const Users = () => {
  const users = useSelector(state => state.users)
  const blogs = useSelector(state => state.blogs)
  return (
    <div>
      <div style={{ marginTop: '20px' }}></div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{ backgroundColor: 'darkgrey' }}>
            <TableRow>
              <TableCell>Users</TableCell>
              <TableCell>number of blogs added</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user =>
              <TableRow key={user.id}>
                <TableCell>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </TableCell>
                <TableCell>
                  {blogs.filter(blog => blog.user.id === user.id).length}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div >
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
      <div style={{ marginTop: '20px' }}></div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{ backgroundColor: 'darkgrey' }}>
            <TableRow>
              <TableCell>Blogs</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs.map(blog => blog.user.id === user.id &&
              <TableRow key={blog.id}>
                <TableCell>
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Users