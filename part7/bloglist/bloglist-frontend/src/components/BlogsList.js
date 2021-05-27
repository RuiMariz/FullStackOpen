import React from 'react'
import BlogForm from './BlogForm'
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

const BlogsList = () => {
  const blogs = useSelector(state => state.blogs)

  return (
    <div>
      <BlogForm />
      <div style={{ marginTop: 20 }} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{ backgroundColor: 'darkgrey' }}>
            <TableRow>
              <TableCell>Blogs</TableCell>
              <TableCell>added by</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs.map(blog =>
              <TableRow key={blog.id}>
                <TableCell>
                  <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
                </TableCell>
                <TableCell>
                  <Link to={`/users/${blog.user.id}`}>{blog.user.name}</Link>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default BlogsList