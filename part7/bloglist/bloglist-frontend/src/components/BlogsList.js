import React from 'react'
import Blog from './Blog'
import { useSelector } from 'react-redux'

const BlogsList = ({ updateBlog, removeBlog, blogForm }) => {
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.users)

  return (
    <div>
      <h2>Blogs</h2>
      {blogForm}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} removeBlog={removeBlog} user={user} />
      )}
    </div>
  )
}

export default BlogsList