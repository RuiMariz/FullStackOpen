import React from 'react'
import { useSelector } from 'react-redux'

const Blog = ({ blog, updateBlog, removeBlog }) => {
  const user = useSelector(state => state.user)
  if (!blog) {
    return null
  }
  return (
    <div className="blog">
      <h2>{blog.title} by {blog.author}</h2>{blog.url}
      <br />
        likes {blog.likes}<button onClick={() => { addLike(blog, updateBlog) }} className="likeButton">like</button><br />
      {blog.user.username}<br />
      {user !== null && user.username === blog.user.username ?
        <div>
          <button onClick={() => { removeBlog(blog) }} className="removeButton">remove</button><br />
        </div> : <div />}
      <hr />
    </div>
  )
}

const addLike = (blog, updateBlog) => {
  blog.likes++
  updateBlog(blog)
}

export default Blog