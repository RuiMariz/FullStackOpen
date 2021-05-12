import React from 'react'
import Togglable from './Togglable'

const Blog = ({ blog, updateBlog, removeBlog, user }) => {
  return (
    <div>
      {blog.title} {blog.author}
      <Togglable buttonLabel="show more">
        {blog.url}<br />
        likes {blog.likes}<button onClick={() => { addLike(blog, updateBlog) }}>like</button><br />
        {blog.user.username}<br />
        {user !== null && user.username === blog.user.username ?
          <div>
            <button onClick={() => { removeBlog(blog) }}>remove</button><br />
          </div> : <div />}
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