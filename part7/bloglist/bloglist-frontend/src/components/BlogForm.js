import React, { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newLikes, setNewLikes] = useState('')

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

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: newLikes
    }
    createBlog(blogObject)
  }

  return (
    <div className="formDiv">
      <h2>Create New Blog</h2>
      <form onSubmit={addBlog}>
        title<input value={newTitle} id='title' onChange={handleTitleChange} /><br />
    author<input value={newAuthor} id='author' onChange={handleAuthorChange} /><br />
    url<input type="url" value={newUrl} id='url' onChange={handleUrlChange} /><br />
    likes<input type="number" value={newLikes} id='likes' onChange={handleLikesChange} /><br />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default BlogForm