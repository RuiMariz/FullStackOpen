import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import blogService from '../services/blogs'
import { createBlog } from '../reducers/blogsReducer'
import { showSuccessMessage } from './Notification'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core'

const BlogForm = () => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newLikes, setNewLikes] = useState('')
  const [open, setOpen] = React.useState(false)
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  if (!user)
    return null

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
    setNewLikes('')
    setOpen(false)
  }
  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }
  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }
  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }
  const handleLikesChange = (event) => {
    setNewLikes(event.target.value)
  }

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: newLikes
    }
    let returnedBlog = await blogService.create(blogObject)
    returnedBlog.user = user
    dispatch(createBlog(returnedBlog))
    handleClose()
    showSuccessMessage('Blog added', dispatch)
  }

  return (
    <div style={{ marginBottom: '20px', marginTop: '20px' }}>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Add new Blog
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth={'xs'}>
        <form onSubmit={addBlog} >
          <DialogTitle>Add Blog</DialogTitle>
          <DialogContent >
            <TextField label="title" style={{ width: '100%' }} type="text" id="title" value={newTitle} onChange={handleTitleChange} required />
            <TextField label="author" style={{ width: '100%' }} type="text" id="author" value={newAuthor} onChange={handleAuthorChange} required />
            <TextField label="url" style={{ width: '100%' }} type="url" id="url" value={newUrl} onChange={handleUrlChange} required />
            <TextField label="likes" style={{ width: '100%' }} type="number" id="likes" value={newLikes} onChange={handleLikesChange} InputProps={{ inputProps: { min: 0 } }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
}

export default BlogForm