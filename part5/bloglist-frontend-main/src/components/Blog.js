import React from 'react'
import Togglable from './Togglable'

const Blog = ({ blog, updateBlog }) => {
  return (
    <div>
      {blog.title} {blog.author}
      <Togglable buttonLabel="show more">
        {blog.url}<br />
        likes {blog.likes}<button onClick={() => { addLike(blog, updateBlog) }}>like</button><br />
        {blog.user.username}<br />
      </Togglable>
      <hr />
    </div>
  )
}

const addLike = (blog, updateBlog) => {
  blog.likes++
  updateBlog(blog)
}

export default Blog