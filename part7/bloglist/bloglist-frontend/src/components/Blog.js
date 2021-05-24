import React from 'react'
import Togglable from './Togglable'

const Blog = ({ blog, updateBlog, removeBlog, user }) => {
  return (
    <div className="blog">
      {blog.title} {blog.author}
      <Togglable buttonLabel="show more">
        {blog.url}<br />
        likes {blog.likes}<button onClick={() => { addLike(blog, updateBlog) }} className="likeButton">like</button><br />
        {blog.user.username}<br />
        {user !== null && user.username === blog.user.username ?
          <div>
            <button onClick={() => { removeBlog(blog) }} className="removeButton">remove</button><br />
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