import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import blogService from '../services/blogs'
import { showSuccessMessage, showErrorMessage } from '../components/Notification'
import { updateBlogRedux, removeBlogRedux } from '../reducers/blogsReducer'
import { TextField, Button, Dialog, DialogTitle, DialogActions, List, ListItem, ListItemText, Divider } from '@material-ui/core'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import DeleteIcon from '@material-ui/icons/Delete'
import CommentIcon from '@material-ui/icons/Comment'

const Blog = ({ blog }) => {
  const user = useSelector(state => state.user)
  const [comment, setComment] = useState('')
  const [open, setOpen] = React.useState(false)
  const dispatch = useDispatch()
  const history = useHistory()

  if (!blog)
    return null

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
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

  const likeBlog = (blogObject) => {
    blogService
      .likeBlog(blogObject.id)
      .then(returnedBlog => {
        dispatch(updateBlogRedux(returnedBlog))
        showSuccessMessage('Blog updated', dispatch)
      })
  }

  const removeBlog = (blogObject) => {
    blogService
      .remove(blogObject.id)
      .then(() => {
        dispatch(removeBlogRedux(blogObject))
        showSuccessMessage('Blog removed', dispatch)
        history.push('/')
      })
  }

  return (
    <div>
      <div style={{ marginTop: '20px' }} />
      <TextField variant="filled" label="title" value={blog.title} readOnly={true} style={{ width: '60%' }} /><br />
      <TextField variant="filled" label="author" value={blog.author} readOnly={true} style={{ width: '60%' }} /><br />
      <TextField variant="filled" label="url" value={blog.url} readOnly={true} style={{ width: '60%' }} /><br />
      <TextField variant="filled" label="likes" value={blog.likes} InputProps={{ readOnly: true }} />
      <Button startIcon={<ThumbUpIcon />} variant="contained" color="primary" style={{ margin: '11px 0px 0px 11px' }} onClick={() => { likeBlog(blog) }} >like</Button>
      {user && user.id === blog.user.id &&
        <Button startIcon={<DeleteIcon />} variant="contained" color="secondary" style={{ margin: '11px 0px 0px 11px' }} onClick={handleClickOpen} >remove blog</Button>
      }
      <Dialog onClose={handleClose} open={open} disableBackdropClick disableEscapeKeyDown>
        <DialogTitle>
          Remove &quot;{blog.title}&quot; by {blog.author}?
        </DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => { removeBlog(blog) }} color="primary">
            Remove
          </Button>
        </DialogActions>
      </Dialog>
      <br />
      <TextField label="comment" type="text" value={comment} name="comment" multiline style={{ minWidth: '50%' }} onChange={handleCommentChange} />
      <Button startIcon={<CommentIcon />} variant="contained" color="primary" style={{ margin: '5px 0px 0px 5px' }} onClick={addComment} >add comment</Button>
      {user !== null && user.id === blog.user.id &&
        <Button startIcon={<DeleteIcon />} variant="contained" color="secondary" style={{ margin: '5px 0px 0px 10px' }} onClick={removeAllComments} >remove all comments</Button>
      }
      <br />
      <div style={{ marginTop: 20 }} />
      <strong>comments</strong><br />
      <List>
        {blog.comments.map((comment, index) =>
          <div key={index}>
            <ListItem>
              <ListItemText>
                {comment}
              </ListItemText>
            </ListItem>
            <Divider />
          </div>
        )}
      </List>
    </div>
  )
}

export default Blog