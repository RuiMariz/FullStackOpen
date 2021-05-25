import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const BlogsList = ({ blogForm }) => {
  const blogs = useSelector(state => state.blogs)

  return (
    <div>
      <h2>Blogs</h2>
      {blogForm}
      <ul>
        {blogs.map(blog =>
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
          </li>
        )}
      </ul>
    </div>
  )
}

export default BlogsList