import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import blogService from '../services/blogs'
import { showSuccessMessage, showErrorMessage } from '../components/Notification'
import { useDispatch } from 'react-redux'
import { updateBlogRedux } from '../reducers/blogsReducer'

const Blog = ({ blog, likeBlog, removeBlog }) => {
  const user = useSelector(state => state.user)
  const [comment, setComment] = useState('')
  const dispatch = useDispatch()

  if (!blog) {
    return null
  }

  const handleCommentChange = (event) => {
    setComment(event.target.value)
  }

  const addComment = async () => {
    if (!blog || comment === '')
      return
    try {
      const updatedBlog = await blogService.addComment(blog.id, { comment: comment })
      showSuccessMessage('Comment added', dispatch)
      dispatch(updateBlogRedux(updatedBlog))
      setComment('')
    } catch (ex) {
      showErrorMessage('An error ocurred', dispatch)
      console.log(ex)
    }
  }

  const removeAllComments = async () => {
    if (!blog || blog.comments.length === 0)
      return
    try {
      blog.comments = []
      const updatedBlog = await blogService.update(blog.id, blog)
      showSuccessMessage('Comments removed', dispatch)
      dispatch(updateBlogRedux(updatedBlog))
    } catch (ex) {
      showErrorMessage('An error ocurred', dispatch)
      console.log(ex)
    }
  }

  return (
    <div className="blog">
      <h2>{blog.title} by {blog.author}</h2>{blog.url}
      <br />
        likes {blog.likes}<button onClick={() => { likeBlog(blog) }} className="likeButton">like</button><br />
      {blog.user.username}<br />
      {user !== null && user.username === blog.user.username ?
        <div>
          <button onClick={() => { removeBlog(blog) }} className="removeButton">remove</button><br />
        </div> : <div />}
      <hr />
      <strong>comments</strong><br />
      <input value={comment} id='comment' onChange={handleCommentChange} />
      <button onClick={addComment}>add comment</button>
      {user !== null && user.username === blog.user.username ?
        <div>
          <button onClick={() => { removeAllComments() }} className="removeButton">remove all comments</button><br />
        </div> : <div />}
      <br />
      <ul>
        {blog.comments.map((comment, index) =>
          <li key={index}>{comment}</li>
        )}
      </ul>
    </div>
  )
}

export default Blog